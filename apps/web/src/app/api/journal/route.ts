import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"

import { prisma } from "@/lib/prisma"

export async function GET() {
  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const user = await prisma.user.findUnique({ where: { clerkId: userId } })
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 })
  }

  const journals = await prisma.journal.findMany({
    where: { userId: user.id },
    orderBy: [{ pinned: "desc" }, { updatedAt: "desc" }],
  })

  return NextResponse.json({ journals })
}

export async function POST(req: Request) {
  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const user = await prisma.user.findUnique({ where: { clerkId: userId } })
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 })
  }

  let body: {
    title?: unknown
    content?: unknown
    sentiment?: unknown
    pinned?: unknown
  }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 })
  }

  if (typeof body?.title !== "string" || typeof body?.content !== "string") {
    return NextResponse.json({ error: "title and content are required" }, { status: 400 })
  }

  const journal = await prisma.journal.create({
    data: {
      userId: user.id,
      title: body.title,
      content: body.content,
      sentiment:
        typeof body.sentiment === "string" ? body.sentiment : null,
      pinned: body.pinned === true,
    },
  })

  return NextResponse.json({ journal })
}
