'use client'

import React, { useState } from 'react';

interface BlogPost {
    title: string;
    description: string;
    content: string;
    coverPhoto: File | null;
}

export default function CreateBlog() {
    const [blogPost, setBlogPost] = useState<BlogPost>({
        title: '',
        description: '',
        content: '',
        coverPhoto: null,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setBlogPost((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setBlogPost((prev) => ({ ...prev, coverPhoto: e.target.files[0] }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        

        const formData = new FormData();
        formData.append('title', blogPost.title);
        formData.append('description', blogPost.description);
        formData.append('content', blogPost.content);
        if (blogPost.coverPhoto) {
            formData.append('coverPhoto', blogPost.coverPhoto);
        }

        try {
            const response = await fetch('/api/create-blog', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            // Handle success (e.g., show a success message, redirect, etc.)
            console.log('Blog published successfully!');
            console.log(JSON.stringify(response.body));
            
        } catch (error) {
            // Handle error (e.g., show an error message)
            console.error('Error publishing blog:', error);
        }
    };

    return (
        <div className='flex items-center justify-center flex-col gap-10 p-5'>
            <div className='container mx-auto border-0 shadow-lg rounded-xl max-w-md mt-10 p-6 ring-1 ring-inset ring-gray-300'>
                <form onSubmit={handleSubmit}>

                    <div className='flex flex-row items-center justify-between mb-5'>
                        <h3 className='font-semibold'>Create Your Blog</h3>
                        <div className='align-middle select-none font-sans font-medium text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none py-1 px-3 rounded-md bg-gradient-to-tr from-neutral-800 to-zinc-700 text-white shadow-md shadow-gray-900/10 hover:shadow-lg hover:shadow-gray-900/20 focus:shadow-none active:opacity-[0.85] active:shadow-none'>
                            <button type='submit' className='font-sans text-sm font-medium text-white'>
                                PUBLISH BLOG
                            </button>
                        </div>
                    </div>

                    {/* Title */}
                    <div className="sm:col-span-3 mb-5">
                        <label htmlFor="title" className="block text-sm font-medium leading-6 text-gray-600">Title</label>
                        <div className="mt-2">
                            <input
                                type="text"
                                name="title"
                                id="title"
                                value={blogPost.title}
                                onChange={handleChange}
                                className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>

                    {/* Description */}
                    <div className="sm:col-span-3 mb-5">
                        <label htmlFor="description" className="block text-sm font-medium leading-6 text-gray-600">Description</label>
                        <div className="mt-2">
                            <input
                                type="text"
                                name="description"
                                id="description"
                                value={blogPost.description}
                                onChange={handleChange}
                                className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>

                    {/* Blog Content */}
                    <div className="col-span-full mb-5">
                        <label htmlFor="content" className="block text-sm font-medium leading-6 text-gray-600">Write your Blog</label>
                        <div className="mt-2">
                            <textarea
                                id="content"
                                name="content"
                                rows={3}
                                value={blogPost.content}
                                onChange={handleChange}
                                className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            ></textarea>
                        </div>
                    </div>

                    {/* Image Uploading section */}
                    <div className="col-span-full">
                        <label htmlFor="cover-photo" className="block text-sm font-medium leading-6 text-gray-600">Cover photo</label>
                        <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                            <div className="text-center">
                                <svg className="mx-auto h-12 w-12 text-gray-300" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                                    <path fillRule="evenodd" d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0021 18v-1.94l-2.69-2.689a1.5 1.5 0 00-2.12 0l-.88.879.97.97a.75.75 0 11-1.06 1.06l-5.16-5.159a1.5 1.5 0 00-2.12 0L3 16.061zm10.125-7.81a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0z" clipRule="evenodd" />
                                </svg>
                                <div className="mt-4 flex text-sm leading-6 text-gray-600">
                                    <label htmlFor="file-upload" className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500">
                                        <span>Upload a file</span>
                                        <input
                                            id="file-upload"
                                            name="file-upload"
                                            type="file"
                                            className="sr-only"
                                            onChange={handleFileChange}
                                        />
                                    </label>
                                    <p className="pl-1">or drag and drop</p>
                                </div>
                                <p className="text-xs leading-5 text-gray-600">PNG, JPG, GIF up to 10MB</p>
                            </div>
                        </div>
                    </div>

                </form>
            </div>
        </div>
    );
}
