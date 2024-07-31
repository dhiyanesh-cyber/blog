'use client'

import React, { useState } from 'react';
import { storage } from '../../firebaseConfig'; // Adjust the import path
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useRouter } from 'next/navigation';
import Modal from '@/components/Modal';



interface BlogPost {
    title: string;
    description: string;
    content: string;
    coverPhoto: File | null;
}

export default function CreateBlog() {
    const router = useRouter();
    const [loading,setLoading] = useState(false);
    const [blogPost, setBlogPost] = useState<BlogPost>({
        title: '',
        description: '',
        content: '',
        coverPhoto: null,
    });

    const CloseModal = () => {
        setLoading(false);
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setBlogPost((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files; // Get the files property
        if (files && files.length > 0) { // Check if files is not null and has at least one file
            setBlogPost((prev) => ({ ...prev, coverPhoto: files[0] }));
        } else {
            // Optionally handle the case where no file is selected
            setBlogPost((prev) => ({ ...prev, coverPhoto: null })); // Reset coverPhoto if no file is selected
        }
    };
    

    const handleSubmit = async (e: React.FormEvent) => {
        
        e.preventDefault();

        if (!blogPost.title || !blogPost.description || !blogPost.content || !blogPost.coverPhoto) {
            alert('Please fill in all fields, including uploading a cover photo.');
            return;
          }

        if (!blogPost.coverPhoto) {
            console.error('No cover photo selected.');
            return;
        }

        setLoading(true);

        try {
            // Upload image to Firebase
            const imageRef = ref(storage, `blog-covers/${blogPost.coverPhoto.name}`);
            await uploadBytes(imageRef, blogPost.coverPhoto);
            const imageUrl = await getDownloadURL(imageRef);

            // Prepare form data for the API
            const formData = {
                title: blogPost.title,
                description: blogPost.description,
                content: blogPost.content,
                imageUrl: imageUrl,
            };

            console.log(JSON.stringify(formData));
            

            // Send blog data to your API
            const response = await fetch('/api/create-blog', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            // Handle success
            console.log('Blog published successfully!');
            router.push('/my-blogs');
            // alert("Blog Published Successfully");
            setLoading(false);
        } catch (error) {
            console.error('Error publishing blog:', error);
            setLoading(false);
        }
    };

    return (
        <div className='flex items-center justify-start flex-col gap-10 p-5 min-h-svh' >
            <div className='container mx-auto border-0 ring-1 ring-inset ring-gray-300 shadow-lg rounded-xl max-w-md mt-6 p-6 '>
                <form onSubmit={handleSubmit}>
                    <div className='flex flex-row items-center justify-between mb-5'>
                        <h3 className='font-semibold'>Create Your Blog</h3>
                        <button type='submit' className='font-sans text-sm font-medium text-white bg-gradient-to-tr from-neutral-800 to-zinc-700 py-1 px-3 rounded-md shadow-md'>
                            PUBLISH BLOG
                        </button>
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

                    {/* Display uploaded image preview */}
                    {blogPost.coverPhoto && (
                        <div className="mt-4">
                            <p className="text-sm text-gray-600">Uploaded Image:</p>
                            <img
                                src={URL.createObjectURL(blogPost.coverPhoto)}
                                alt="Uploaded"
                                className="mt-2 max-w-xs rounded-md"
                            />
                        </div>
                    )}

                </form>
            </div>

            <Modal show={loading}>
                
                <span className="loading loading-infinity loading-lg"></span>       
            
            </Modal>
        </div>
    );
}
