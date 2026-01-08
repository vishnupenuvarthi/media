import { CategoryModel } from '../models/category.model.js';
export const CategoryService = {
    listAll: () => CategoryModel.find().lean(),
    getBySlug: (slug) => CategoryModel.findOne({ slug }).lean()
};
