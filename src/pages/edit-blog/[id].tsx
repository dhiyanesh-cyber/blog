// pages/edit-blog/[id].tsx
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@clerk/nextjs';
import { storage } from '../../firebaseConfig'; // Adjust the import path
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import Image from 'next/image';

interface Blog {
    id: string;
    title: string;
    description: string;
    authorName: string;
    imageUrl: string;
    content: string;
    authorId: string;
}

const EditBlog = () => {
    const { userId } = useAuth();
    const router = useRouter();
    const { id } = router.query; // Get the blog ID from the URL
    const [blog, setBlog] = useState<Blog | null>(null);
    const [loading, setLoading] = useState(true);
    const [hasPermission, setHasPermission] = useState<boolean | null>(null);
    const [error, setError] = useState('');
    const [coverPhoto, setCoverPhoto] = useState<File | null>(null); // State for the uploaded file

    useEffect(() => {
        if (id) {
            const fetchBlog = async () => {
                try {
                    const response = await fetch(`/api/getBlog?id=${id}`);
                    if (!response.ok) {
                        throw new Error('Failed to fetch blog');
                    }
                    const data: Blog = await response.json();
                    setBlog(data);
                    setHasPermission(data.authorId === userId);
                } catch (error) {
                    console.error('Error fetching blog:', error);
                    setError('Failed to load blog data');
                } finally {
                    setLoading(false);
                }
            };

            fetchBlog();
        }
    }, [id, userId]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            setCoverPhoto(files[0]);
        } else {
            setCoverPhoto(null);
        }
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!blog) return;

        try {
            let imageUrl = blog.imageUrl; // Default to the existing image URL

            // Upload image if a new file is selected
            if (coverPhoto) {
                const imageRef = ref(storage, `blog-covers/${coverPhoto.name}`);
                await uploadBytes(imageRef, coverPhoto);
                imageUrl = await getDownloadURL(imageRef); // Get the new image URL
            }

            // Prepare updated blog data
            const updatedBlog = { ...blog, imageUrl };

            const response = await fetch(`/api/updateBlog`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedBlog),
            });

            if (!response.ok) {
                throw new Error('Failed to update blog');
            }

            // Redirect to the blog page or show a success message
            router.push('/my-blogs'); // Adjust the redirect as needed
        } catch (error) {
            console.error('Error updating blog:', error);
            setError('Failed to update blog');
        }
    };

    if (loading || hasPermission === null) return <div className="text-center min-h-svh">Loading...</div>;
    if (error) return <div className="text-red-500 text-center min-h-svh">{error}</div>;
    if (hasPermission === false) return <div className="text-red-500 text-center min-h-svh">You do not have permission to edit this blog.</div>;

    return (
        <div className='flex items-center justify-start flex-col gap-10 p-5 min-h-svh'>
            <div className='container mx-auto border-0 ring-1 ring-inset ring-gray-300 shadow-lg rounded-xl mt-10 max-w-md p-6'>
                <form onSubmit={handleUpdate} className="space-y-4">
                    <div className='flex flex-row items-center justify-between mb-5'>
                        <h3 className='font-semibold'>Edit Blog</h3>
                        <button type='submit' className='font-sans text-sm font-medium text-white bg-gradient-to-tr from-neutral-800 to-zinc-700 py-1 px-3 rounded-md shadow-md'>
                            UPDATE BLOG
                        </button>
                    </div>

                    {/* Title */}
                    <div className="sm:col-span-3 mb-5">
                        <label className="block text-sm font-medium leading-6 text-gray-600">Title</label>
                        <div className="mt-2">
                            <input
                                type="text"
                                value={blog?.title}
                                onChange={(e) => setBlog((prev) => prev ? { ...prev, title: e.target.value } : null)}
                                required
                                className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>

                    {/* Description */}
                    <div className="sm:col-span-3 mb-5">
                        <label className="block text-sm font-medium leading-6 text-gray-600">Description</label>
                        <div className="mt-2">
                            <input
                                type='text'
                                value={blog?.description}
                                onChange={(e) => setBlog((prev) => prev ? { ...prev, description: e.target.value } : null)}
                                required
                                className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>

                    {/* Content */}
                    <div className="col-span-full mb-5">
                        <label className="block text-sm font-medium leading-6 text-gray-600">Content</label>
                        <div className="mt-2">
                            <textarea
                                value={blog?.content}
                                rows={3}
                                onChange={(e) => setBlog((prev) => prev ? { ...prev, content: e.target.value } : null)}
                                required
                                className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>



                    {/* Image Uploading section */}
                    <div className="mb-4 ">

                        <label className="block text-sm font-medium leading-6 text-gray-600">Cover Photo</label>

                        <div className="mt-2 flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10" >
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                id="file-upload"
                                className="hidden" // Hide the default file input
                            />
                            <svg className="mx-auto h-12 w-12 text-gray-300" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                                <path fillRule="evenodd" d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0021 18v-1.94l-2.69-2.689a1.5 1.5 0 00-2.12 0l-.88.879.97.97a.75.75 0 11-1.06 1.06l-5.16-5.159a1.5 1.5 0 00-2.12 0L3 16.061zm10.125-7.81a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0z" clipRule="evenodd" />
                            </svg>
                            <label
                                htmlFor="file-upload"
                                className="mt-1 text-sm block w-full border-gray-300 rounded-md cursor-pointer  focus:ring focus:ring-blue-500 focus:border-blue-500 p-2 text-center"
                            >
                                <span className='relative cursor-pointer rounded-md font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500'>Choose File</span>
                            </label>
                            <span className='text-neutral-700 text-sm text-center w-9/12'> Upload a file or drag and drop PNG, JPG, GIF up to 10MB</span>
                        </div>
                        {coverPhoto && (
                            <p className="mt-2 text-sm text-gray-600">Selected file: {coverPhoto.name}</p>
                        )}
                    </div>

                    {/* Display uploaded image preview */}
                    {coverPhoto && (
                        <div className="mt-4">
                            <p className="text-sm text-gray-600">Uploaded Image:</p>
                            <Image
                                width={20}
                                src={URL.createObjectURL(coverPhoto)}
                                alt="Uploaded"
                                className="mt-2 max-w-xs rounded-md"
                            />
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
};

export default EditBlog;
