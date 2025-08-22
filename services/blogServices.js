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
  const getBlogByTitle = async (title) => {
      title: { $regex: new RegExp(`^${req.params.title}$`, "i") } 
 
  return await blogRepo.getBlogByTitle(title);
};


  const updateBlog = async (id, updateData) => {
    return await blogRepo.updateBlog(id, updateData);
  }

  module.exports = {getBlogByTitle, serviceCreateBlog, getAllBlog, deleteAllBlog, getBlogById, updateBlog }; 