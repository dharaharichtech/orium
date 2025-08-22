const mongoose = require('mongoose')
const { Schema } = mongoose;



const blogSchema = new Schema({
   title: {
    type:String,
    required: true
   },
      description: {
    type:String,
    required: true
   },
   image: {
    type:String
   },
   slug: {
    type:String,
    unique: true
   },
   
   date: {
    type:Date,
    default: Date.now
   },
   

   
  });
  blogSchema.pre("save", function (next) {
  if (this.isModified("title")) {
    this.slug = this.title
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")    
      .replace(/[^\w\-]+/g, "");   
  }
  next();
});


  const Blog = new mongoose.model( 'Blog', blogSchema);

  module.exports = Blog