  const  blogRepo  = require("../repositories/blogRepository");

  const serviceCreateBlog = async (blogData) => {
    return await blogRepo.saveBlog(blogData);
  };

  const getAllBlog = async()=>{
  return await blogRepo.getAllBlog()
  }

  const deleteAllBlog = async()=>{
    return await blogRepo.deleteAllBlog();
  };

  const getBlogById = async (id)=>{
      return await blogRepo.getBlogById(id);
  }

  const updateBlog = async (id, updateData) => {
    return await blogRepo.updateBlog(id, updateData);
  }

  module.exports = { serviceCreateBlog, getAllBlog, deleteAllBlog, getBlogById, updateBlog }; 