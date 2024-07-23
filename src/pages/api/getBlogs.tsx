// pages/api/blogs.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      // Fetch all blogs from the database
      const blogs = await prisma.blog.findMany();
      res.status(200).json(blogs); // Send the blogs as a JSON response
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