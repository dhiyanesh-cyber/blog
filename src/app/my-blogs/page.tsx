'use client'

import { useAuth } from '@clerk/nextjs';
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown';

interface Blog {
    id: string;
    title: string;
    description: string;
    authorName: string;
    imageUrl: string;
    content: string;
  }

export default function MyBlog() {
    try {
        const { userId, isSignedIn } = useAuth();
        const [blogs, setBlogs] = useState<Blog[]>([]);
        const [loading, setLoading] = useState(true);
    
        useEffect(() => {
          const fetchBlogs = async () => {
            try {
              const response = await fetch(`/api/getUserBlog?userId=${userId}`);
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
      
          fetchBlogs();
        }, []);
        
    
        if (!userId) {
          return (
            <div>
              <h1 className='text-center mt-10'>You are not logged in</h1>
            </div>
          );
        }
    
        return (
          <div className="px-4 min-h-screen">
          <div className='container flex justify-center items-center pt-10 mx-auto'>
                <Link href='/create-blog'>
                    <button
                        className="align-middle select-none font-sans font-bold text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-3 px-6 rounded-lg bg-neutral-800 text-white shadow-md shadow-gray-900/10 hover:shadow-lg hover:shadow-gray-900/20 focus:shadow-none active:opacity-[0.85] active:shadow-none"
                        type="button"
                    >Create Blog</button>
                </Link>
            </div>
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
      } catch (error) {
        console.error('Error in Home component:', error);
        return (
          <div className="text-center mt-10 text-white">
            <h1>An error occurred while loading the page.</h1>
          </div>
        );
      }
}
