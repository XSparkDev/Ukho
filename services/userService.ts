import { collection, getDocs, limit, query, where } from 'firebase/firestore';

import { db } from '@/app/firebase/config';

export type UserProfile = {
  id: string;
  displayName: string;
  avatar?: string;
  clan?: string;
  rating?: number;
};

/**
 * Fetch a random sample of users from Firebase.
 * Efficiently fetches a limited batch and shuffles client-side.
 */
export async function getRandomUsers(count: number = 12): Promise<UserProfile[]> {
  try {
    // Fetch a larger batch to ensure we have enough after filtering
    const batchSize = Math.max(count * 3, 30);
    const usersRef = collection(db, 'users');
    
    // Query with limit - Firestore doesn't support true random, so we'll shuffle client-side
    const q = query(usersRef, limit(batchSize));
    const snapshot = await getDocs(q);

    const users: UserProfile[] = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      // Only include users with displayName (required field)
      if (data.displayName) {
        users.push({
          id: doc.id,
          displayName: data.displayName || '',
          avatar: data.photoURL || data.avatar || undefined,
          clan: data.clan || undefined,
          rating: data.rating || undefined,
        });
      }
    });

    // Shuffle array using Fisher-Yates algorithm
    for (let i = users.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [users[i], users[j]] = [users[j], users[i]];
    }

    // Return only the requested count
    return users.slice(0, count);
  } catch (error) {
    console.error('Error fetching random users:', error);
    // Return empty array on error - screen will handle gracefully
    return [];
  }
}
