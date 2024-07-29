import { useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/router';
import React, { useEffect, useState, useCallback } from 'react';
import debounce from 'lodash/debounce';

interface LikeButtonProps {
  initialLikes?: number;
}

export const LikeButton: React.FC<LikeButtonProps> = ({ initialLikes = 0 }) => {
  const [likes, setLikes] = useState(initialLikes);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading,setLoading] = useState(false);
  const [liked, setLiked] = useState(false);
  const router = useRouter();
  const { id } = router.query;
  const { isSignedIn, userId } = useAuth();

  
  useEffect(() => {
    
    
    if (isSignedIn && userId && id) {
      checkLikeStatus();
    }
  }, [isSignedIn, userId, id]);
  

  const checkLikeStatus = async () => {
    try {
      const response = await fetch(`/api/checkLike?blogId=${id}`);
      if (response.ok) {
        const data = await response.json();
        setLiked(data.liked);
        setLikes(data.likes); // Assuming your API returns the current like count
      }
    } catch (error) {
      console.error('Error checking like status:', error);
    }
  };

  const handleLike = useCallback(debounce(async () => {
    if (!isSignedIn) {
      alert("Sign-in to like posts");
      return;
    }

  
    const originalLiked = liked;
    const originalLikes = likes;
    
    // Optimistic update
    setLiked(!liked);
    setLikes(liked ? likes - 1 < 0 ? 0 : likes - 1 : likes + 1);
    setErrorMessage(null); // Clear any previous error messages
  
    try {
      const response = await fetch('/api/likes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ blogId: id }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to update like');
      }
  
      const data = await response.json();
      setLiked(data.liked);
      setLikes(data.likes);
      setLoading(false);
    } catch (error) {
      console.error('Error managing like:', error);
      // Revert to original state if there's an error
      setLiked(originalLiked);
      setLikes(originalLikes);
      setErrorMessage("Failed to update like. Please try again.");
      
      // Optionally, clear the error message after a few seconds
      setTimeout(() => setErrorMessage(null), 3000);
    }
  }, 300), [isSignedIn, liked, likes, id]);

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
      {errorMessage && (
      <div className="absolute top-full left-0 mt-2 px-2 py-1 bg-red-500 text-white text-sm rounded">
        {errorMessage}
      </div>
    )}
    </button>
  );
};