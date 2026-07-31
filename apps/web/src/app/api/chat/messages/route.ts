import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"

import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const user = await prisma.user.findUnique({ where: { clerkId: userId } })
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 })
  }

  let body: { sessionId?: unknown; role?: unknown; content?: unknown }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 })
  }

  const sessionId = body?.sessionId
  const role = body?.role
  const content = body?.content

  if (
    typeof sessionId !== "string" ||
    (role !== "user" && role !== "assistant") ||
    typeof content !== "string"
  ) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
  }

  const session = await prisma.chatSession.findFirst({
    where: { id: sessionId, userId: user.id },
    select: { id: true },
  })
  if (!session) {
    return NextResponse.json({ error: "Session not found" }, { status: 404 })
  }

  const message = await prisma.$transaction([
    prisma.message.create({
      data: { sessionId: session.id, role, content },
      select: { id: true },
    }),
    prisma.chatSession.update({
      where: { id: session.id },
      data: { updatedAt: new Date() },
    }),
  ])

  return NextResponse.json({ messageId: message[0].id })
}

export async function GET(req: Request) {
  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const sessionId = new URL(req.url).searchParams.get("sessionId")
  if (!sessionId) {
    return NextResponse.json({ error: "sessionId is required" }, { status: 400 })
  }

  const messages = await prisma.message.findMany({
    where: { sessionId },
    orderBy: { createdAt: "asc" },
    select: { id: true, role: true, content: true, createdAt: true },
  })

  return NextResponse.json({ messages })
}
