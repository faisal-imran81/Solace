import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"

import { prisma } from "@/lib/prisma"

export async function POST() {
  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const user = await prisma.user.findUnique({ where: { clerkId: userId } })
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 })
  }

  const session = await prisma.chatSession.create({
    data: { userId: user.id, title: "New Conversation" },
  })

  return NextResponse.json({ sessionId: session.id })
}

export async function GET() {
  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const user = await prisma.user.findUnique({ where: { clerkId: userId } })
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 })
  }

  const sessions = await prisma.chatSession.findMany({
    where: { userId: user.id },
    orderBy: { updatedAt: "desc" },
    take: 20,
    select: { id: true, title: true, pinned: true, createdAt: true, updatedAt: true },
  })

  return NextResponse.json({ sessions })
}

export async function PATCH(req: Request) {
  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  let body: { sessionId?: unknown; title?: unknown; pinned?: unknown }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 })
  }

  const { sessionId, title, pinned } = body
  if (typeof sessionId !== "string") {
    return NextResponse.json({ error: "Missing sessionId" }, { status: 400 })
  }

  const user = await prisma.user.findUnique({ where: { clerkId: userId } })
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 })
  }

  // Verify session belongs to user
  const session = await prisma.chatSession.findFirst({
    where: { id: sessionId, userId: user.id },
  })
  if (!session) {
    return NextResponse.json({ error: "Session not found" }, { status: 404 })
  }

  const updateData: { title?: string; pinned?: boolean } = {}
  if (title !== undefined && typeof title === "string") updateData.title = title
  if (pinned !== undefined && typeof pinned === "boolean") updateData.pinned = pinned

  await prisma.chatSession.update({
    where: { id: sessionId },
    data: updateData,
  })

  return NextResponse.json({ success: true })
}

export async function DELETE(req: Request) {
  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const sessionId = searchParams.get("sessionId")
  if (!sessionId) {
    return NextResponse.json({ error: "Missing sessionId" }, { status: 400 })
  }

  const user = await prisma.user.findUnique({ where: { clerkId: userId } })
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 })
  }

  await prisma.chatSession.deleteMany({
    where: { id: sessionId, userId: user.id },
  })

  return NextResponse.json({ success: true })
}
