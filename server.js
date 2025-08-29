const express = require('express');
const connectDB = require('./db/db');
const authRouter = require("./routes/authRoutes");
const blogRouter = require("./routes/blogRoutes");
const productRouter = require("./routes/productRoutes");
const reviewRouter = require("./routes/reviewsRoutes")
const app = express();
const PORT = process.env.PORT || 5000;
const passport = require("passport"); 
const session = require("express-session");
const path = require('path');
const cors = require('cors');


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); 

app.use(
  session({
    secret: process.env.JWT_SECRET || "secret_key", 
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

require("./utils/passport")(passport);

connectDB();


app.get('/', (req, res) => {
  res.send('API is running...');
});
app.use("/api/auth", authRouter);
app.use("/api/blog", blogRouter);
app.use("/api/product",productRouter);
app.use("/api/review", reviewRouter);




app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
