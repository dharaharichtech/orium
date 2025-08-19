const express = require('express');
const connectDB = require('./db/db');
const authRouter = require("./routes/authRoutes");
const blogRouter = require("./routes/blogRoutes");
const productRouter = require("./routes/productRoutes");
const app = express();
const PORT = process.env.PORT || 5000;
const path = require('path');
const cors = require('cors');


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); 

connectDB();


app.get('/', (req, res) => {
  res.send('API is running...');
});
app.use("/api/auth", authRouter);
app.use("/api/blog", blogRouter);
app.use("/api/product",productRouter);




app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
