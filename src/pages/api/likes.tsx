import { NextApiRequest, NextApiResponse } from 'next';
import { getAuth } from '@clerk/nextjs/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { userId } = getAuth(req);
  const { blogId } = req.body;

  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const result = await prisma.$transaction(async (tx) => {
      const existingLike = await tx.likes.findUnique({
        where: {
          blogId_userId: {
            blogId: Number(blogId),
            userId: userId,
          },
        },
      });

      if (existingLike) {
        await tx.likes.delete({
          where: { id: existingLike.id },
        });
        await tx.blog.update({
          where: {
            id: Number(blogId),
            likes: { gte: 1 }
          },
          data: {
            likes: { decrement: 1 }
          },
        });
        return { liked: false };
      } else {
        await tx.likes.create({
          data: {
            blogId: Number(blogId),
            userId: userId,
          },
        });
        await tx.blog.update({
          where: { id: Number(blogId) },
          data: { likes: { increment: 1 } },
        });
        return { liked: true };
      }
    });

    const updatedBlog = await prisma.blog.findUnique({
      where: { id: Number(blogId) },
      select: { likes: true },
    });

    return res.status(200).json({ ...result, likes: updatedBlog?.likes });
  } catch (error) {
    console.error('Error managing like:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}