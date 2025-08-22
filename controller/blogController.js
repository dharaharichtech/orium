const Blog = require("../model/blogSchema");
const path = require("path");
const blogService = require("../services/blogServices");

const createBlog = async (req, res) => {
  try {
    const { title, description, date } = req.body;
    const serverUrl = `${req.protocol}://${req.get("host")}`;
    const image = req.file ? `${serverUrl}/uploads/${req.file.filename}` : null;

    // Validation
    if (!title || !description || !image) {
      return res.status(400).json({
        msg: "Please fill all the fields and upload an image",
      });
    }

    // Check duplicate title
    const existingBlogs = await blogService.getAllBlog();
    if (existingBlogs.some(blog => blog.title === title)) {
      return res.status(400).json({
        msg: "Blog with this title already exists",
      });
    }

    // Create blog using service
    const blogData = {
      title,
      description,
      date: date || new Date(),
      image,
    };

    const blog = await blogService.serviceCreateBlog(blogData);

    res.status(201).json({
      msg: "Blog created successfully",
      blog,
    });

  } catch (error) {
    console.error("Error in createBlog:", error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

const getAllBlogs = async (req, res) => {
  try {
    const blogs = await blogService.getAllBlog();

    if (!blogs || blogs.length === 0) {
      return res.status(404).json({ msg: "No blogs found" });
    }

    res.status(200).json({
      msg: "Blogs retrieved successfully",
      blogs,
    });
  } catch (error) {
    console.error("Error in getAllBlogs:", error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

const getBlogById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ msg: "Blog ID is required" });
    }

    const blog = await blogService.getBlogById(id);

    if (!blog) {
      return res.status(404).json({ msg: "Blog not found" });
    }

    res.status(200).json(blog);
  } catch (error) {
    console.error("Error in getBlogById:", error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};


const getBlogByTitle = async (req, res) => {
  try {
    const title = req.params.title;

    const blog = await Blog.findOne({
      title: { $regex: new RegExp(`^${title}$`, "i") }
    });

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    res.json(blog);
  } catch (error) {
    console.error("Error fetching blog by title:", error);
    res.status(500).json({ message: "Server error" });
  }
};




const deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ msg: "Blog ID is required" });
    }

    const blog = await blogService.deleteAllBlog(id);

    if (!blog) {
      return res.status(404).json({ msg: "Blog not found" });
    }

    res.status(200).json({ msg: "Blog deleted successfully" });
  } catch (error) {
    console.error("Error in deleteBlog:", error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};



const updateBlog = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ msg: "Blog ID is required" });
    }

    const existingBlog = await blogService.getBlogById(id);
    if (!existingBlog) {
      return res.status(404).json({ msg: "Blog not found" });
    }

    const updateData = { ...req.body };

    if (req.file) {
      const serverUrl = `${req.protocol}://${req.get("host")}`;
      updateData.image = `${serverUrl}/uploads/${req.file.filename}`;
    }

    const updatedBlog = await blogService.updateBlog(id, updateData);

    res.status(200).json({
      msg: "Blog updated successfully",
      blog: updatedBlog,
    });

  } catch (error) {
    console.error("Error in updateBlog:", error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};


module.exports = {getBlogByTitle, createBlog, getAllBlogs, getBlogById, deleteBlog, updateBlog };
