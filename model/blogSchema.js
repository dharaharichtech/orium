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


   date: {
    type:Date,
    default: Date.now
   },

   
  });


  const Blog = new mongoose.model( 'Blog', blogSchema);

  module.exports = Blog