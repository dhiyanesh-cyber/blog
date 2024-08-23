import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'DELETE') {
    try {
       const blogId = parseInt(req.query.id as string, 10);

      if (!blogId) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

       const deletedBlogLikes = await prisma.likes.deleteMany({
        where: {
            blogId: blogId,
        },
      });

      res.status(200).json({ message: 'Like data deleted successfully', deletedBlogLikes }); // Send the filtered blogs as a JSON response
    } catch (error) {
      console.error('Error deleting blog likes:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    } finally {
      await prisma.$disconnect(); // Ensure the Prisma client is disconnected
    }
  } else {
    res.setHeader('Allow', ['DELETE']);
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
