import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { PUZZLE_IMAGES } from '@/data/puzzleData';

// Picsum Photos API - free, no API key needed
// Uses seeded random images so same puzzleId always gets same image
function getPicsumFallbackUrl(puzzleId: number): string {
  return `https://picsum.photos/seed/bible-puzzle-${puzzleId}/600/600`;
}

// Local session cache
const imageCache: Record<number, string> = {};

// Queue management
let isGenerating = false;
const generationQueue: Array<{ puzzleId: number; resolve: (url: string | null) => void }> = [];

async function processQueue() {
  if (isGenerating || generationQueue.length === 0) return;
  
  isGenerating = true;
  const item = generationQueue.shift();
  
  if (item) {
    try {
      const puzzle = PUZZLE_IMAGES.find(p => p.id === item.puzzleId);
      if (!puzzle) {
        item.resolve(null);
        isGenerating = false;
        processQueue();
        return;
      }

      const description = `${puzzle.title} - ${puzzle.verse}`;

      const { data, error } = await supabase.functions.invoke('generate-puzzle-image', {
        body: {
          puzzleId: item.puzzleId,
          title: puzzle.title,
          description: description,
          category: puzzle.category,
        },
      });

      if (error) {
        console.error('Error generating image, using Picsum fallback:', error);
        const fallback = getPicsumFallbackUrl(item.puzzleId);
        imageCache[item.puzzleId] = fallback;
        item.resolve(fallback);
      } else if (data?.imageUrl) {
        imageCache[item.puzzleId] = data.imageUrl;
        item.resolve(data.imageUrl);
      } else {
        console.warn('No image from AI, using Picsum fallback');
        const fallback = getPicsumFallbackUrl(item.puzzleId);
        imageCache[item.puzzleId] = fallback;
        item.resolve(fallback);
      }
    } catch (err) {
      console.error('Error in queue processing:', err);
      const fallback = getPicsumFallbackUrl(item.puzzleId);
      imageCache[item.puzzleId] = fallback;
      item.resolve(fallback);
    }
  }
  
  isGenerating = false;
  
  if (generationQueue.length > 0) {
    setTimeout(processQueue, 500);
  }
}

export function usePuzzleImage(puzzleId: number | null) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!puzzleId) {
      setImageUrl(null);
      setIsLoading(false);
      return;
    }

    // Check local cache first
    if (imageCache[puzzleId]) {
      setImageUrl(imageCache[puzzleId]);
      setIsLoading(false);
      return;
    }

    // Check database for existing image
    const checkDatabase = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const { data: existingImage } = await supabase
          .from('puzzle_images')
          .select('image_url')
          .eq('puzzle_id', puzzleId)
          .single();

        if (existingImage?.image_url) {
          imageCache[puzzleId] = existingImage.image_url;
          setImageUrl(existingImage.image_url);
          setIsLoading(false);
          return;
        }

        // Not in database, add to generation queue
        const promise = new Promise<string | null>((resolve) => {
          generationQueue.push({ puzzleId, resolve });
          processQueue();
        });

        const url = await promise;
        setImageUrl(url);
        setIsLoading(false);
      } catch (err) {
        console.error('Error checking database:', err);
        // Try generating anyway
        const promise = new Promise<string | null>((resolve) => {
          generationQueue.push({ puzzleId, resolve });
          processQueue();
        });

        const url = await promise;
        setImageUrl(url);
        setIsLoading(false);
      }
    };

    checkDatabase();

    return () => {
      const index = generationQueue.findIndex(item => item.puzzleId === puzzleId);
      if (index > -1) {
        generationQueue.splice(index, 1);
      }
    };
  }, [puzzleId]);

  return { imageUrl, isLoading, error };
}

// Function to fetch existing images from database
export async function fetchExistingPuzzleImages(): Promise<Record<number, string>> {
  const { data } = await supabase
    .from('puzzle_images')
    .select('puzzle_id, image_url');
  
  const result: Record<number, string> = {};
  if (data) {
    data.forEach(item => {
      result[item.puzzle_id] = item.image_url;
      imageCache[item.puzzle_id] = item.image_url;
    });
  }
  return result;
}
