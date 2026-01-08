import { CategoryModel } from '../models/category.model.js';

export const CategoryService = {
  listAll: async () => {
    try {
      return await CategoryModel.find().lean();
    } catch (error) {
      console.error('Error in CategoryService.listAll:', error.message);
      return [];
    }
  },
  getBySlug: async (slug) => {
    try {
      return await CategoryModel.findOne({ slug }).lean();
    } catch (error) {
      console.error('Error in CategoryService.getBySlug:', error.message);
      return null;
    }
  }
};

