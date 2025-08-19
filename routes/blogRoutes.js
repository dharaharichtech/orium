const express = require('express');
const router = express.Router();

const { createBlog, getAllBlogs, getBlogById, deleteBlog, updateBlog } = require('../controller/blogController');
const upload = require('../utils/multer');
const { authenticate } = require('../utils/authValidation');

//create blog routes for orium
router.post("/add-blog", authenticate, upload.single('image'), createBlog);

//update blog routes
router.patch("/update/:id", authenticate, upload.single('image'), updateBlog);

//delete blog routes
router.delete("/delete/:id", authenticate, deleteBlog);

//get blog routes
router.route("/all-blogs").get(getAllBlogs);

//get blog by id 
router.route("/all-blogs/:id").get(getBlogById);    

module.exports = router;