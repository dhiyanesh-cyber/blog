// pages/api/updateBlog.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'PUT') {
    const { id, title, description, imageUrl, content } = req.body;

    try {
      const updatedBlog = await prisma.blog.update({
        where: { id },
        data: { title, description, imageUrl, content },
      });
      res.status(200).json(updatedBlog);
    } catch (error) {
      console.error('Error updating blog:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    } finally {
      await prisma.$disconnect();
    }
  } else {
    res.setHeader('Allow', ['PUT']);
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
