import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { PUZZLE_IMAGES } from '@/data/puzzleData';

// Cache for generated images (persists during session)
const imageCache: Record<number, string> = {};

// Queue management to avoid overwhelming the API
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
        return;
      }

      // Create a description from the title and verse
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
        console.error('Error generating image:', error);
        item.resolve(null);
      } else if (data?.imageUrl) {
        imageCache[item.puzzleId] = data.imageUrl;
        item.resolve(data.imageUrl);
      } else {
        item.resolve(null);
      }
    } catch (err) {
      console.error('Error in queue processing:', err);
      item.resolve(null);
    }
  }
  
  isGenerating = false;
  
  // Process next item after a small delay to respect rate limits
  if (generationQueue.length > 0) {
    setTimeout(processQueue, 1000);
  }
}

export function usePuzzleImage(puzzleId: number | null) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!puzzleId) {
      setImageUrl(null);
      return;
    }

    // Check cache first
    if (imageCache[puzzleId]) {
      setImageUrl(imageCache[puzzleId]);
      return;
    }

    // Add to generation queue
    setIsLoading(true);
    setError(null);

    const promise = new Promise<string | null>((resolve) => {
      generationQueue.push({ puzzleId, resolve });
      processQueue();
    });

    promise.then((url) => {
      setImageUrl(url);
      setIsLoading(false);
    }).catch((err) => {
      setError(err.message);
      setIsLoading(false);
    });

    return () => {
      // Remove from queue if component unmounts
      const index = generationQueue.findIndex(item => item.puzzleId === puzzleId);
      if (index > -1) {
        generationQueue.splice(index, 1);
      }
    };
  }, [puzzleId]);

  return { imageUrl, isLoading, error };
}

// Preload images for a batch of puzzles
export async function preloadPuzzleImages(puzzleIds: number[]): Promise<void> {
  for (const puzzleId of puzzleIds) {
    if (!imageCache[puzzleId]) {
      await new Promise<void>((resolve) => {
        generationQueue.push({
          puzzleId,
          resolve: () => resolve(),
        });
        processQueue();
      });
    }
  }
}
