// pages/edit-blog/[id].tsx
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@clerk/nextjs';

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

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!blog) return;

        try {
            const response = await fetch(`/api/updateBlog`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(blog),
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

    if (loading || hasPermission === null) return <div className="text-center">Loading...</div>;
    if (error) return <div className="text-red-500 text-center">{error}</div>;
    if (hasPermission === false) return <div className="text-red-500 text-center"></div>;

    return (
        <div className='flex items-center justify-center flex-col gap-10 p-5 min-h-svh' >
            <div className='container mx-auto border-0 ring-1 ring-inset ring-gray-300 shadow-lg rounded-xl max-w-md mt-10 p-6 '>
            
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
                                onChange={(e) => setBlog((prev) => prev ? { ...prev, content: e.target.value } : null)}
                                required
                                className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>
                    {/* Image URL */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Image URL</label>
                        <input
                            type="text"
                            value={blog?.imageUrl}
                            onChange={(e) => setBlog((prev) => prev ? { ...prev, imageUrl: e.target.value } : null)}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-500 focus:border-blue-500 p-2"
                        />
                    </div>
                    {/* Update */}
            
                </form>
            </div>
        </div>
    );
};

export default EditBlog;
