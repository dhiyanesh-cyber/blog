import { NextApiRequest, NextApiResponse } from 'next';
import { clerkClient, getAuth } from '@clerk/nextjs/server'; // Assuming you're using Clerk for authentication
import { PrismaClient } from '@prisma/client';
import { getBlogAnaysis } from '@/utils/BlogAnalysis';

const prisma = new PrismaClient();

type BlogAnalysis = {
  isValid: boolean
  reason: string
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { userId } = getAuth(req); 
  const user = userId ? await clerkClient().users.getUser(userId) : null;



  if (req.method === 'POST') {
    try {
      console.log(user?.emailAddresses[0].emailAddress);
      
      const { title, description, imageUrl, content } = req.body;

      const blogAnalysis: BlogAnalysis = await getBlogAnaysis(title, description, content);

      if(!blogAnalysis.isValid){
        res.status(400).json({message: "post is invalid", description: blogAnalysis.reason});
        return;
      }

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
