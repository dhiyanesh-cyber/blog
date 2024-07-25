import { useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

interface LikeButtonProps {
  initialLikes?: number;
}

export const LikeButton: React.FC<LikeButtonProps> = ({ initialLikes = 0 }) => {
  const [likes, setLikes] = useState(initialLikes);
  const [liked, setLiked] = useState(false);
  const router = useRouter();
    const { id } = router.query;

    const { isSignedIn, userId } = useAuth();

    useEffect(() => {
      if (isSignedIn && userId) {
        checkLikeStatus();
      }
    }, [isSignedIn, userId, id]);
  
    const checkLikeStatus = async () => {
      try {
        const response = await fetch(`/api/checkLike?blogId=${id}`);
        if (response.ok) {
          const data = await response.json();
          setLiked(data.liked);
        }
      } catch (error) {
        console.error('Error checking like status:', error);
      }
    };
  
    const handleLike = async () => {
      if (!isSignedIn) {
        alert("Sign-in to like posts");
        return;
      }
      setLiked(!liked);
      setLikes(liked ? likes - 1 : likes + 1);
      try {
        const response = await fetch('/api/likes', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ blogId :id }),
        });
  
        if (response.ok) {
          console.log("success");
          
          setLiked(!liked);
          setLikes(liked ? likes - 1 : likes + 1);
        }
      } catch (error) {
        console.error('Error managing like:', error);
      }
    };

  return (
    <button
      onClick={handleLike}
      className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-colors duration-200 ${
        liked ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
      }`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
          clipRule="evenodd"
        />
      </svg>
      <span>{likes} {likes === 1 ? 'Like' : 'Likes'}</span>
    </button>
  );
};