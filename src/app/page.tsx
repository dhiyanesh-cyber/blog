'use client';

import { useAuth } from '@clerk/nextjs';
import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';

interface Blog {
  id: string;
  title: string;
  description: string;
  authorName: string;
  imageUrl: string;
  content: string;
}

export default function Home() {
  const { userId, isSignedIn } = useAuth(); // Call hooks at the top level
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      if (!userId) {
        setLoading(false); // Set loading to false if userId is not available
        return; // Early return if userId is not available
      }

      try {
        const response = await fetch('/api/getBlogs');
        if (!response.ok) {
          throw new Error('Failed to fetch blogs');
        }
        const data: Blog[] = await response.json();
        setBlogs(data);
      } catch (error) {
        console.error('Error fetching blogs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs(); // Call the function to fetch blogs
  }, [userId]); // Dependency on userId

  if (!isSignedIn) {
    return (
      <div>
        <h1 className='text-center mt-10 min-h-svh'>You are not logged in</h1>
      </div>
    );
  }

  if (loading) {
    return <div className="text-center mt-10 min-h-svh">Loading...</div>; // Optional loading state
  }

  return (
    <div className="px-4 min-h-svh">
      <div className="container mx-auto mt-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map((blog) => (
            <div key={blog.id} className="bg-zinc-800 rounded-xl p-4 shadow-md">
              <h2 className="text-lg font-semibold text-white">{blog.title}</h2>
              <p className="text-gray-400">{blog.description}</p>
              {blog.imageUrl && (
                <img src={blog.imageUrl} alt={blog.title} className="mt-2 mb-2 rounded-md" />
              )}
              {/* Render the content as Markdown */}
              <ReactMarkdown className="text-gray-300">{blog.content}</ReactMarkdown>
              <div className="mt-4">
                <p className="text-sm text-gray-500">Author: {blog.authorName}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
