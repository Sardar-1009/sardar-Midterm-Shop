
import { ref, get, set, push, query, orderByChild, equalTo, remove } from 'firebase/database';
import { database } from './firebase';
import { Listing } from '../models/Listing';

const listingsRef = ref(database, 'listings');

export const fetchListings = async (): Promise<Listing[]> => {
  const snapshot = await get(listingsRef);
  if (snapshot.exists()) {
    const listings: Listing[] = [];
    snapshot.forEach(childSnapshot => {
      listings.push({
        id: childSnapshot.key as string,
        ...childSnapshot.val()
      });
    });
    return listings;
  }
  return [];
};

export const fetchListingsByCategory = async (categoryId: string): Promise<Listing[]> => {
  const categoryListingsQuery = query(
    listingsRef,
    orderByChild('categoryId'),
    equalTo(categoryId)
  );
  
  const snapshot = await get(categoryListingsQuery);
  if (snapshot.exists()) {
    const listings: Listing[] = [];
    snapshot.forEach(childSnapshot => {
      listings.push({
        id: childSnapshot.key as string,
        ...childSnapshot.val()
      });
    });
    return listings;
  }
  return [];
};

export const fetchListingById = async (id: string): Promise<Listing | null> => {
  const snapshot = await get(ref(database, `listings/${id}`));
  if (snapshot.exists()) {
    return { id: snapshot.key as string, ...snapshot.val() };
  }
  return null;
};

export const createListing = async (listing: Omit<Listing, 'id'>): Promise<Listing> => {
  const newListingRef = push(listingsRef);
  const newListing = { 
    ...listing, 
    id: newListingRef.key,
    createdAt: Date.now(),
    updatedAt: Date.now()
  };
  await set(newListingRef, listing);
  return newListing as Listing;
};

export const updateListing = async (listing: Listing): Promise<void> => {
  const { id, ...listingData } = listing;
  const updatedListing = {
    ...listingData,
    updatedAt: Date.now()
  };
  await set(ref(database, `listings/${id}`), updatedListing);
};

export const deleteListing = async (id: string): Promise<void> => {
  await remove(ref(database, `listings/${id}`));
};