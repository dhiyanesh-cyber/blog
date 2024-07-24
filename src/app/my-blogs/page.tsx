'use client';

import { useAuth } from '@clerk/nextjs';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

interface Blog {
    id: string;
    title: string;
    description: string;
    authorName: string;
    imageUrl: string;
    content: string;
}

export default function MyBlog() {
    const { userId, isSignedIn } = useAuth(); // Call hooks at the top level
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBlogs = async () => {
            if (!userId) {
                setLoading(false); // Set loading to false if no userId
                return; // Early return if userId is not available
            }
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

        fetchBlogs(); // Call the function to fetch blogs
    }, [userId]); // Dependency on userId


    const handleDelete = async (id: any) => {
        if (!userId) {
            setLoading(false); // Set loading to false if no userId
            return; // Early return if userId is not available
        }
        try {
            const response = await fetch(`/api/deleteBlog?id=${id}`,{
                method: 'DELETE'});
            if (!response.ok) {
                throw new Error('Failed to delete blog');
            }
        } catch (error) {
            console.error('Error deleting blog:', error);
        } finally {
            setLoading(false);
            location.reload();
            alert("Blog Deleted Successfully");
            
        }
    }

    if (!isSignedIn) {
        return (
            <div>
                <h1 className='text-center mt-10'>You are not logged in</h1>
            </div>
        );
    }

    if (loading) {
        return <div className="text-center mt-10 min-h-svh">Loading...</div>;
    }

    return (
        <div className="px-4 min-h-screen">
            <div className='container flex justify-center items-center pt-10 mx-auto'>
                <Link href='/create-blog'>
                    <button
                        className="align-middle select-none font-sans font-bold text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-3 px-6 rounded-lg bg-neutral-800 text-white shadow-md shadow-gray-900/10 hover:shadow-lg hover:shadow-gray-900/20 focus:shadow-none active:opacity-[0.85] active:shadow-none"
                        type="button"
                    >
                        Create Blog
                    </button>
                </Link>
            </div>
            <div className="container mx-auto mt-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {blogs.map((blog) => (
                        <div key={blog.id} className="bg-zinc-800 h-fit rounded-xl p-4 shadow-md">
                            <div className='container flex justify-between items-start gap-3'>
                                <h2 className="text-lg font-semibold text-white">{blog.title}</h2>
                                <div className='container flex items-start justify-end gap-3'>
                                    <Link href={`/edit-blog/${blog.id}`}>
                                        <button
                                            className="align-middle select-none font-sans font-normal text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-1.5 px-1.5 rounded-md bg-gradient-to-tr from-white to-neutral-400 text-white shadow-md shadow-gray-900/10 hover:shadow-lg hover:shadow-gray-900/20 active:opacity-[0.85]"
                                            type="button">
                                            <img className='w-4' src="/edit.png" alt="" />
                                        </button>
                                    </Link>
                                    
                                    <button
                                        onClick={() => {
                                            handleDelete(blog.id)
                                        }}
                                        className="align-middle select-none font-sans font-normal text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-1.5 px-3 rounded-md bg-gradient-to-tr from-red-800 to-red-600 text-white shadow-md shadow-gray-900/10 hover:shadow-lg hover:shadow-gray-900/20 active:opacity-[0.85]"
                                        type="button">
                                        delete
                                    </button>
                                </div>
                            </div>
                            <p className="text-gray-400">{blog.description}</p>
                            {blog.imageUrl && (
                                <img src={blog.imageUrl} alt={blog.title} className="mt-2 mb-2 rounded-md" />
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
