const express = require("express");
const router = express.Router();
const upload = require("../utils/multer");
const { createProduct, getAllProducts, getProductById, deleteProduct, updateProduct, addProductDetails, updateProductDetails, deleteProductDetails, toggleWishlist, getWishlist, } = require("../controller/productController");
const { authenticate } = require("../utils/authValidation");
const { addToCart, deleteProductCart, getProductCart, updateProductCart } = require("../controller/cartController");
const { addProductCertificate, updateProductCertificate, deleteProductCertificate, getAllProductCertificate, getProductCertificateById } = require("../controller/productCertificateController");

router.post("/create", authenticate,upload.array("images", 5), createProduct);
router.get("/getall",getAllProducts)
router.get("/getall/:id", getProductById);
router.delete("/delete/:id",authenticate, deleteProduct);
router.patch("/update/:id", authenticate,upload.array("images", 5), updateProduct);

router.post("/details", authenticate, addProductDetails);
router.patch("/details/:id", authenticate, updateProductDetails);
router.delete("/details/:id", authenticate, deleteProductDetails);
router.post("/certificate", authenticate,upload.fields([
    { name: "certificate_img", maxCount: 1 },
    { name: "sdg_img", maxCount: 1 }
  ]), addProductCertificate);

// router.patch("/certificate/:id", authenticate, upload.single("certificate_img"), updateProductCertificate);
router.patch(
  "/certificate/:id",
  upload.fields([
    { name: "certificate_img", maxCount: 1 },
    { name: "sdg_img", maxCount: 1 },
  ]),
  updateProductCertificate
);

router.delete("/certificate/:id", authenticate, deleteProductCertificate);
router.get("/certificate", getAllProductCertificate);
router.get("/certificate/:id", getProductCertificateById);

//cart routes

router.post("/cart",authenticate,addToCart)
router.delete("/cart/:cart_id",authenticate,deleteProductCart)
router.get("/cart",authenticate,getProductCart)
router.patch("/cart/:cart_id", authenticate, updateProductCart);

//wishlist routes
router.post("/wishlist/:product_id", authenticate, toggleWishlist);
router.get("/wishlist/:id", authenticate, getWishlist);

module.exports = router;