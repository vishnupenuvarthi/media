import { LiveBlogModel } from '../models/liveBlog.model.js';

export const LiveService = {
  getBySlug: (slug) => LiveBlogModel.findOne({ slug }).lean(),
  listActive: () => LiveBlogModel.find({ status: 'live' }).select('title slug summary').lean()
};
