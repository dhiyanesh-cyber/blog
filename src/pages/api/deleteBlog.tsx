import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

// Initialize Prisma client
const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Check if the request method is DELETE
  if (req.method === 'DELETE') {
    try {
      // Parse the blog ID from the query parameters
      const id = parseInt(req.query.id as string, 10);

      // Validate the blog ID
      if (!id) {
        return res.status(400).json({ message: 'Invalid blog ID' });
      }

      // Use a transaction to ensure all operations are performed atomically
      const deletedBlog = await prisma.$transaction(async (tx) => {
        // Step 1: Delete related likes
        await tx.likes.deleteMany({
          where: { blogId: id },
        });

        // Step 2: Delete the blog
        return tx.blog.delete({
          where: { id: id },
        });
      });

      // Send a success response
      res.status(200).json({ message: 'Blog deleted successfully', deletedBlog });
    } catch (error) {
      // Log and handle any errors
      console.error('Error deleting blog:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    } finally {
      // Ensure the Prisma client is disconnected
      await prisma.$disconnect();
    }
  } else {
    // Handle unsupported HTTP methods
    res.setHeader('Allow', ['DELETE']);
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}