import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"

import { prisma } from "@/lib/prisma"
import { getInternalUserId } from "@/lib/users"

export async function POST(req: Request) {
  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  let body: { mood?: unknown; note?: unknown }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 })
  }

  const mood = body?.mood
  if (typeof mood !== "number" || !Number.isInteger(mood) || mood < 1 || mood > 5) {
    return NextResponse.json(
      { error: "mood must be an integer between 1 and 5" },
      { status: 400 },
    )
  }

  const note =
    typeof body?.note === "string" && body.note.trim() ? body.note.trim() : undefined

  const internalUserId = await getInternalUserId(userId)

  const entry = await prisma.moodEntry.create({
    data: { userId: internalUserId, mood, note },
  })

  return NextResponse.json({ success: true, entry })
}

export async function GET() {
  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)

  const internalUserId = await getInternalUserId(userId)

  const entries = await prisma.moodEntry.findMany({
    where: { userId: internalUserId, createdAt: { gte: sevenDaysAgo } },
    orderBy: { createdAt: "asc" },
  })

  return NextResponse.json({ entries })
}
