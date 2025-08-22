const Blog = require("../model/blogSchema");

const saveBlog = async (blogData) => {
  const blog = new Blog(blogData);
  return await blog.save();
};

const getAllBlog = async()=> {
    return await Blog.find();
};
const getBlogById = async (id)=>{
    return await Blog.findById(id);
}
const getBlogByTitle = async (title)=>{
    return await Blog.findOne({ title });
}

const updateBlog = async (id, updateData) => {
  return await Blog.findByIdAndUpdate(id, updateData, { new: true });
};

const deleteAllBlog = async()=> {
  return await Blog.deleteMany({})
}

module.exports = { getBlogByTitle,saveBlog, getAllBlog, getBlogById, updateBlog, deleteAllBlog}


