import { Schema, model } from 'mongoose';

const CategorySchema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: String,
    heroImage: String
  },
  { timestamps: true }
);

export const CategoryModel = model('Category', CategorySchema);

