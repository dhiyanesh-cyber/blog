import { GetStaticProps, GetStaticPaths } from 'next';
import Head from 'next/head';
import ReactMarkdown from 'react-markdown';
import { LikeButton } from '@/components/LikeButton';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface Blog {
  id: number;
  title: string;
  description: string;
  authorName: string;
  imageUrl: string;
  content: string;
  likes: number;
}

interface BlogPageProps {
  blog: Blog | null;
  error?: string;
}

const BlogPage: React.FC<BlogPageProps> = ({ blog, error }) => {
  if (error) {
    return <div className="text-center mt-10 min-h-screen flex items-center justify-center text-xl text-red-500">Error: {error}</div>;
  }

  if (!blog) {
    return <div className="text-center mt-10 min-h-screen flex items-center justify-center text-xl text-gray-500">Blog not found</div>;
  }

  return (
    <>
      <Head>
        <title>{blog.title} | Blog</title>
        <meta name="description" content={blog.description} />
        <meta property="og:title" content={blog.title} />
        <meta property="og:description" content={blog.description} />
        <meta property="og:image" content={blog.imageUrl} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`https://yourdomain.com/blog/${blog.id}`} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={blog.title} />
        <meta name="twitter:description" content={blog.description} />
        <meta name="twitter:image" content={blog.imageUrl} />
      </Head>
      
      <div className="container mx-auto mt-8 px-4 min-h-screen font-sans">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {blog.imageUrl && (
            <img src={blog.imageUrl} alt={blog.title} className="w-full h-64 object-cover rounded-t-lg" />
          )}
          <div className="p-6">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">{blog.title}</h1>
            <p className="text-gray-600 mb-6">{blog.description}</p>
            <div className="text-gray-800">
              <ReactMarkdown>{blog.content}</ReactMarkdown>
            </div>
            <div className="mt-4">
              <LikeButton initialLikes={blog.likes} />
            </div>
            <p className="mt-6 text-sm text-gray-500">Author: {blog.authorName}</p>
          </div>
        </div>
      </div>
    </>
  );
};

export const getStaticProps: GetStaticProps = async (context) => {
  const { id } = context.params as { id: string };

  try {
    const blog = await prisma.blog.findUnique({
      where: { id: Number(id) },
    });

    if (!blog) {
      return { notFound: true };
    }

    return {
      props: {
        blog,
      },
      revalidate: 60, // Revalidate at most once every 60 seconds
    };
  } catch (error) {
    return {
      props: {
        error: 'Failed to fetch blog',
      },
    };
  }
};

export const getStaticPaths: GetStaticPaths = async () => {
  try {
    const blogs = await prisma.blog.findMany({
      select: { id: true },
    });

    const paths = blogs.map(blog => ({
      params: { id: blog.id.toString() },
    }));

    return {
      paths,
      fallback: 'blocking', // Can be false, true, or 'blocking'
    };
  } catch (error) {
    return {
      paths: [],
      fallback: 'blocking',
    };
  }
};

export default BlogPage;
