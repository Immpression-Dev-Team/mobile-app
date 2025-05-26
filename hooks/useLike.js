import { useState, useCallback } from 'react';
import axios from 'axios';
import { API_URL } from '../API_URL';

export const useLike = (initialLikes, initialHasLiked, imageId, token) => {
  const [likes, setLikes] = useState(initialLikes);
  const [hasLiked, setHasLiked] = useState(initialHasLiked);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const toggleLike = useCallback(async () => {
    if (!imageId || !token) return;

    setIsLoading(true);
    setError(null);

    try {
      const newHasLiked = !hasLiked;
      const newLikes = newHasLiked ? likes + 1 : likes - 1;

      setHasLiked(newHasLiked);
      setLikes(newLikes);

      const response = await axios.post(
        `${API_URL}/image/${imageId}/like`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
          timeout: 5000, // 5 second timeout
        }
      );

      if (!response.data.success) {
        // Revert optimistic update if API call failed
        setHasLiked(hasLiked);
        setLikes(likes);
        throw new Error(response.data.error || 'Like action failed');
      }
    } catch (error) {
      setError(err.message);
      // Revert optimistic update
      setHasLiked(hasLiked);
      setLikes(likes);
    } finally {
      setIsLoading(false);
    }
  }, [imageId, token, hasLiked, likes]);
  return { likes, hasLiked, toggleLike, isLoading, error };
};
