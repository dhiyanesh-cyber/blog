// pages/api/blogs.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { getAuth } from '@clerk/nextjs/server'; // Import Clerk's server-side auth helper

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      // Get the auth information from the request
      const id = parseInt(req.query.id as string, 10);

      if (!id) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      // Fetch blogs based on the user ID
      const blog = await prisma.blog.findUnique({
        where: {
          id: id,
        },
      });

      res.status(200).json(blog); // Send the filtered blogs as a JSON response
    } catch (error) {
      console.error('Error fetching blogs:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    } finally {
      await prisma.$disconnect(); // Ensure the Prisma client is disconnected
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
