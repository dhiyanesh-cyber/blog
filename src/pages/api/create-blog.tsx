import { NextApiRequest, NextApiResponse } from 'next';
import { clerkClient, getAuth } from '@clerk/nextjs/server'; // Assuming you're using Clerk for authentication
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { userId } = getAuth(req); // Get user information from Clerk
  const user = userId ? await clerkClient().users.getUser(userId) : null;



  if (req.method === 'POST') {
    try {
      console.log(user?.emailAddresses[0].emailAddress);
      
      const { title, description, imageUrl, content } = req.body;

      // Create a new blog post using Prisma
      const newBlog = await prisma.blog.create({
        data: {
          title,
          description,
          imageUrl,
          content,
          authorName: user?.firstName || 'Unknown', // Assuming you get the first name from the user object
          authorId: userId || 'unknown', // Use userId from Clerk
        },
      });

      // Log the created blog post
      console.log('New Blog Created:', newBlog);

      // Send a success response
      res.status(201).json({ message: 'Blog created successfully'});
    } catch (error) {
      console.error('Error creating blog:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
