import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"

import { prisma } from "@/lib/prisma"

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const user = await prisma.user.findUnique({ where: { clerkId: userId } })
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 })
  }

  const { id } = await params

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

  const data: { title?: string; content?: string; sentiment?: string | null; pinned?: boolean } = {}
  if (typeof body?.title === "string") data.title = body.title
  if (typeof body?.content === "string") data.content = body.content
  if (body?.sentiment !== undefined) {
    data.sentiment = typeof body.sentiment === "string" ? body.sentiment : null
  }
  if (typeof body?.pinned === "boolean") data.pinned = body.pinned

  const updated = await prisma.journal.updateMany({
    where: { id, userId: user.id },
    data,
  })

  if (updated.count === 0) {
    return NextResponse.json({ error: "Journal not found" }, { status: 404 })
  }

  const journal = await prisma.journal.findFirst({
    where: { id, userId: user.id },
  })

  return NextResponse.json({ journal })
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const user = await prisma.user.findUnique({ where: { clerkId: userId } })
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 })
  }

  const { id } = await params

  await prisma.journal.deleteMany({
    where: { id, userId: user.id },
  })

  return NextResponse.json({ success: true })
}
