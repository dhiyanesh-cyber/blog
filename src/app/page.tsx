'use client'
import { useAuth } from '@clerk/nextjs';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Modal from '@/components/Modal';
import { useSearch } from '../context/SearchContext';
import SearchBar from '@/components/searchBar';

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
  const { searchTerm, setSearchTerm } = useSearch();

  useEffect(() => {
    const fetchBlogs = async () => {
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


  const filteredBlogs = blogs.filter(blog =>
    blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    blog.authorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    blog.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <Modal show={loading}>
        <span className="loading loading-infinity loading-lg"></span>
      </Modal>
    );
  }

  return (
    <div className="px-4 min-h-svh">
      <div className="block mt-8 sm:hidden">
        <SearchBar width="w-full" bg="neutral-100" onSearch={setSearchTerm} />
      </div>
      <div className="container mx-auto mt-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
          {filteredBlogs.map((blog) => (
            <Link
              href={`/blog/${blog.id}`}
              key={blog.id}
              className="bg-neutral-50 h-fit rounded-2xl ring-1 ring-stone-300 transition-shadow duration-300 hover:shadow-lg hover:shadow-neutral-400/50"
            >
              <div>
                {blog.imageUrl && (
                  <Image
                    width={500}
                    height={500}
                    src={blog.imageUrl}
                    alt={blog.title}
                    className="rounded-t-2xl w-full h-48 object-cover"
                  />
                )}
                <div className='px-3 py-3'>
                  <h2 className="font-semibold text-neutral-800 text-base">{blog.title}</h2>
                  <h3 className="text-neutral-600 text-sm">By {blog.authorName}</h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}