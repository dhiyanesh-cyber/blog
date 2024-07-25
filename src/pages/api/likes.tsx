import { NextApiRequest, NextApiResponse } from 'next';
import { getAuth, clerkClient } from '@clerk/nextjs/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { userId } = getAuth(req);

  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  // Check if the user exists
  try {
    const user = await clerkClient.users.getUser(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Error fetching user:', error);
    return res.status(500).json({ message: 'Error verifying user' });
  }

 

  if (req.method === 'POST') {
    try {
      const { blogId } = req.body;

      // Check if the like already exists
      const existingLike = await prisma.likes.findUnique({
        where: {
          blogId_userId: {
            blogId: Number(blogId),
            userId: userId,
          },
        },
      });

      if (existingLike) {
        // If like exists, remove it
        await prisma.$transaction(async (tx) => {
          await tx.likes.delete({
            where: {
              id: existingLike.id,
            },
          });

          await tx.blog.update({
            where: { id: Number(blogId) },
            data: { likes: { decrement: 1 } },
          });
        });

        return res.status(200).json({ message: 'Like removed successfully' });
      } else {
        // If like doesn't exist, add it
        await prisma.$transaction(async (tx) => {
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
        });

        return res.status(201).json({ message: 'Like added successfully' });
      }
    } catch (error) {
      console.error('Error managing like:', error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
}