import { NextApiRequest, NextApiResponse } from 'next';
import { getAuth } from '@clerk/nextjs/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { userId } = getAuth(req);
  const { blogId } = req.query;

  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    

    const like = await prisma.likes.findUnique({
      where: {
        blogId_userId: {
          blogId: Number(blogId),
          userId: userId,
        },
      },
    });

    const blog = await prisma.blog.findUnique({
      where: {
        id: Number(blogId),
      },
    });
    

    return res.status(200).json({ liked: !!like ,likes: blog?.likes});
  } catch (error) {
    console.error('Error checking like:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}