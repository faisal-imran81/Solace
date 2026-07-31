import { currentUser } from "@clerk/nextjs/server"

import { prisma } from "@/lib/prisma"

export async function getInternalUserId(clerkId: string) {
  const existing = await prisma.user.findUnique({
    where: { clerkId },
    select: { id: true },
  })
  if (existing) return existing.id

  const clerkUser = await currentUser()
  return prisma.user
    .create({
      data: {
        clerkId,
        email: clerkUser?.emailAddresses?.[0]?.emailAddress ?? null,
        name: clerkUser?.firstName ?? null,
      },
      select: { id: true },
    })
    .then((u) => u.id)
}
