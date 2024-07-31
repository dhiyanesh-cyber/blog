'use client'
import { useAuth } from '@clerk/nextjs';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';



interface Blog {
  id: number;
  title: string;
  description: string;
  authorName: string;
  imageUrl: string;
  content: string;
}

export default function Home() {
  const { userId, isSignedIn } = useAuth();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchBlogs = async () => {
      if (!userId) {
        setLoading(false);
        return;
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

    fetchBlogs();
  }, [userId]);

  if (!isSignedIn) {
    return (
      <div>
        <h1 className='text-center mt-10 min-h-svh'>You are not logged in</h1>
      </div>
    );
  }

  if (loading) {
    return <div className="text-center mt-10 min-h-svh">Loading...</div>;
  }

  return (
    <div className="px-4 min-h-svh">
      <div className="container mx-auto mt-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map((blog) => (
            <Link
              href={`/blog/${blog.id}`}
              key={blog.id}
              className="bg-neutral-50 h-fit rounded-2xl ring-1 ring-stone-300 transition-shadow duration-300 hover:shadow-lg hover:shadow-neutral-400/50"          >
              <div>
                {blog.imageUrl && (
                  <Image
                    width={500}
                    height={500}
                    src={blog.imageUrl}
                    alt={blog.title}
                    className="rounded-t-2xl  w-full h-48 object-cover"
                  />
                )}
                <div className='px-3 py-3'>
                  <h2 className="font-semibold text-neutral-800 text-base ">{blog.title}</h2>
                  <h3 className="text-neutral-600 text-sm">By {blog.authorName}</h3>
                  {/* <p className="text-neutral-600 text-sm">{blog.description}</p> */}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}