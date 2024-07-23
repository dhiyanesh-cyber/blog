import { auth, currentUser } from "@clerk/nextjs/server";
import { PrismaClient } from "@prisma/client";
import ReactMarkdown from 'react-markdown';

export default async function Home() {
  const { userId } = auth();
  const user = await currentUser();
  const prisma = new PrismaClient();

  await prisma.$connect();

  const allBlogs = await prisma.blog.findMany();

  await prisma.$disconnect();

  if (!userId) {
    return (
      <div>
        <h1 className='text-center mt-10'>You are not logged in</h1>
      </div>
    );
  }

  return (
    <div className="px-4 min-h-screen">
      <div className="container mx-auto mt-8">
        <h1 className='text-center text-white mb-6'>Hi, {user?.firstName}</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {allBlogs.map((blog) => (
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
