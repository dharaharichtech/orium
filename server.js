const express = require('express');
const connectDB = require('./db/db');
const authRouter = require("./routes/authRoutes");
const blogRouter = require("./routes/blogRoutes");
const productRouter = require("./routes/productRoutes");
const reviewRouter = require("./routes/reviewsRoutes")
const app = express();
const passport = require("passport"); 
const session = require("express-session");
const path = require('path');
const cors = require('cors');
connectDB();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(cors());
app.use(cors({
  origin: [
    "https://demo.harichtech.com",
    "http://demo.harichtech.com",
    "http://localhost:3000",
    "http://localhost:5000",

  ],
  methods: ["GET", "POST", "PUT","PATCH", "DELETE"],
  credentials: true
}));


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



app.get('/', (req, res) => {
  res.send('API is running...');
});
app.use("/api/auth", authRouter);
app.use("/api/blog", blogRouter);
app.use("/api/product",productRouter);
app.use("/api/review", reviewRouter);




const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});