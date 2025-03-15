
import { ref, get, set, push, child } from 'firebase/database';
import { database } from './firebase';
import { Category } from '../models/Category';

const categoriesRef = ref(database, 'categories');

export const fetchCategories = async (): Promise<Category[]> => {
  const snapshot = await get(categoriesRef);
  if (snapshot.exists()) {
    const categories: Category[] = [];
    snapshot.forEach(childSnapshot => {
      categories.push({
        id: childSnapshot.key as string,
        ...childSnapshot.val()
      });
    });
    return categories;
  }
  return [];
};

export const createCategory = async (category: Omit<Category, 'id'>): Promise<Category> => {
  const newCategoryRef = push(categoriesRef);
  const newCategory = { ...category, id: newCategoryRef.key };
  await set(newCategoryRef, category);
  return newCategory as Category;
};

export const updateCategory = async (category: Category): Promise<void> => {
  const { id, ...categoryData } = category;
  await set(ref(database, `categories/${id}`), categoryData);
};