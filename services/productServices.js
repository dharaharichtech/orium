const  productRepository  = require("../repositories/productRepository");
const ProductDetail = require("../model/productDetailSchema");
const ProductCertificate = require("../model/productCertificateSchema");
const api_url = process.env.API_URL
const crypto = require("crypto");


 const createProduct = async (data,files) => {
//   return await productRepository.saveProduct(userData);
const{title,price,description,stock}=data;
    if (!title || !price || !description || !stock) {
      throw new Error("All fields are required");
    }

    const titleExists = await productRepository.getProductByTitle(title);
    if (titleExists) throw new Error("Product with this title already exists");
    if (!files || files.length === 0) {
      throw new Error("At least one image is required");
    }

    const images = files.map((file) => ({
      filename: file.filename,
      url: `${api_url}/uploads/${file.filename}`,
    }));

    return await productRepository.saveProduct({ title, price, description, stock, images });
  }
const getAllProducts = async () => {
  const products = await productRepository.getAllProducts();

  const productsWithDetails = await Promise.all(
    products.map(async (product) => {
      const details = await ProductDetail.find({ product_id: product._id });
      const certificates = await ProductCertificate.find({ product_id: product._id });

      const updatedImages = product.images.map((img) => ({
        ...img.toObject(),
        url: img.url || `${api_url}/uploads/${img.filename}`,
      }));

      return {
        ...product.toObject(),
        images: updatedImages,
        details,
        certificates,
      };
    })
  );

  return productsWithDetails;
};

const getProductById = async (id) => {
  const product = await productRepository.getProductById(id);

  if (!product) {
    return null;
  }

  const details = await ProductDetail.find({ product_id: product._id });
  const certificates = await ProductCertificate.find({ product_id: product._id });

  const updatedImages = product.images.map((img) => ({
    ...img.toObject(),
    url: img.url || `${api_url}/uploads/${img.filename}`,
  }));

  return {
    ...product.toObject(),
    images: updatedImages,
    details,
    certificates,
  };
};

const deleteProductById = async () => {
  return await productRepository.deleteProductById();
};


const updateProduct = async(id,data,files)=>{
    const updateData = {...data}
      if (files && files.length > 0) {
    updateData.images = files.map((file) => ({
      filename: file.filename,
      url: `${api_url}/uploads/${file.filename}`,
    }));
  }
  const updatedProduct = await productRepository.updateProductById(id, updateData);
  return updatedProduct;
};


//product details
const addProductDetails = async (data)=>{
    const {product_id,product_que,product_ans}=data;
    if(!product_id || !product_que || !product_ans){
        throw new Error("all fields are required")
    }

    const productExists = await productRepository.getProductById(product_id);
    if(!productExists) throw new Error("Product not found");

    return await productRepository.saveProductDetail({
        product_id: product_id,
        product_que,product_ans
    })
}

const updateProductDetails = async(id,data)=>{
    const {product_que,product_ans}=data;

    // if(!id || !product_que || !product_ans){
    //     throw new Error("all fields are required")
    // }

    const updateDetail = await productRepository.updateDetailById(id,{product_que,product_ans})

    if(!updateDetail) throw new Error("product detail not found")

        return updateDetail
}

const deleteProductDetails = async (id) => {
  if (!id) {
    throw new Error("Product detail ID is required");
  }

  const deletedDetail = await productRepository.deleteDetailById(id);

  if (!deletedDetail) {
    throw new Error("Product detail not found");
  }

  return deletedDetail;
};


// product certificate and goals 
const addProductCertificate = async (data, files) => {
  const { product_id, certificate_title, sdg_title } = data;

  if (!product_id || !certificate_title || !sdg_title) {
    throw new Error("All fields are required");
  }

  const productExists = await productRepository.getProductById(product_id);
  if (!productExists) throw new Error("Product not found");

  const titleExists = await productRepository.getCertificateByTitle(
    product_id,
    certificate_title,
    sdg_title
  );
  if (titleExists) {
    throw new Error("Certificate with this title already exists for this product");
  }

  if (!files || !files.certificate_img || !files.sdg_img) {
    throw new Error("Certificate and SDG images are required");
  }

  const certificatePath = `${api_url}/uploads/${files.certificate_img[0].filename}`;
  const sdgPath = `${api_url}/uploads/${files.sdg_img[0].filename}`;

  return await productRepository.saveProductCertificate({
    product_id,
    certificate_img: certificatePath,
    certificate_title,
    sdg_title,
    sdg_img: sdgPath,
  });
};

const updateProductCertificate = async (id, data, files) => {
  const { product_id, certificate_title, sdg_title } = data;

  

  const certificate = await productRepository.updateCertificateById(id, {
    product_id,
    certificate_title,
    sdg_title,
  });

  if (!certificate) {
    throw new Error("Product certificate not found");
  }

  if (files) {
    if (files.certificate_img) {
      certificate.certificate_img = `${api_url}/uploads/${files.certificate_img[0].filename}`;
    }
    if (files.sdg_img) {
      certificate.sdg_img = `${api_url}/uploads/${files.sdg_img[0].filename}`;
    }
    await certificate.save();
  }

  return certificate;
};



const deleteProductCertificate = async (id) => {
  if (!id) {
    throw new Error("Product certificate ID is required");
  }

  const deletedCertificate = await productRepository.deleteCertificateById(id);

  if (!deletedCertificate) {
    throw new Error("Product certificate not found");
  }

  return deletedCertificate;
};

const getAllProductCertificate = async () => {
  return await productRepository.getAllCertificates();
};

const getProductCertificateById = async (id) => {
  if (!id) {
    throw new Error("Product certificate ID is required");
  }

  const certificate = await productRepository.getCertificateById(id);

  if (!certificate) {
    throw new Error("Product certificate not found");
  }

  return certificate;
};


/// cart services 
const addToCart = async (user_id, product_id, quantity, subtotal) => {
  if (!product_id) {
    throw new Error("Product id is required");
  }

  const product = await productRepository.getProductById(product_id);
  if (!product) throw new Error("Product not found");

  const qty = parseInt(quantity, 10);
  if (isNaN(qty) || qty <= 0) {
    throw new Error("Invalid quantity");
  }

    const existingCartItem = await productRepository.getCartItemByUserAndProduct(
    user_id,
    product_id
  );

  if (existingCartItem) {
    throw new Error("Product already in cart");
  }

  if (product.stock < qty) {
    throw new Error("Not enough stock available");
  }

  // Update stock
  product.stock -= qty;
  await product.save();

  const cartItem = await productRepository.saveCartItem({
    product_id,
    quantity: qty.toString(),
    subtotal,
    user_id,
  });

  return { cartItem, remainingStock: product.stock };
};

const deleteProductCart = async (cart_id, user_id) => {
  if (!cart_id) throw new Error("Cart ID is required");

  const cartItem = await productRepository.getCartItemById(cart_id);
  if (!cartItem) throw new Error("Cart item not found");

  if (cartItem.user_id.toString() !== user_id.toString()) {
    throw new Error("You are not authorized to delete this cart item");
  }

  const product = await productRepository.getProductById(cartItem.product_id);
  if (!product) throw new Error("Product not found");

  product.stock += parseInt(cartItem.quantity, 10);
  await product.save();

  await productRepository.deleteCartItemById(cart_id);

  return { remainingStock: product.stock };
};

const getProductCart = async (user_id) => {
  const cartItems = await productRepository.getCartItemsByUser(user_id);
  if (!cartItems || cartItems.length === 0) {
    throw new Error("No items in cart");
  }
  return cartItems;
};

const updateProductCart = async (cart_id, user_id, quantity, subtotal) => {
  if (!cart_id) throw new Error("Cart ID is required");

  const cartItem = await productRepository.getCartItemById(cart_id);
  if (!cartItem) throw new Error("Cart item not found");

  if (cartItem.user_id.toString() !== user_id.toString()) {
    throw new Error("You are not authorized to update this cart item");
  }

  const product = await productRepository.getProductById(cartItem.product_id);
  if (!product) throw new Error("Product not found");

  const qty = parseInt(quantity, 10);
  if (isNaN(qty) || qty <= 0) throw new Error("Invalid quantity");

  const oldQty = parseInt(cartItem.quantity, 10);

  if (qty > oldQty) {
    const diff = qty - oldQty;
    if (product.stock < diff) throw new Error("Not enough stock available");
    product.stock -= diff;
  } else if (qty < oldQty) {
    const diff = oldQty - qty;
    product.stock += diff;
  }

  await product.save();

  const updatedCartItem = await productRepository.updateCartItemById(cart_id, {
    quantity: qty.toString(),
    subtotal,
  });

  return { updatedCartItem, remainingStock: product.stock };
};


//wishlist 
const toggleWishlist = async(user_id,product_id)=>{
  if (!user_id || !product_id) {
    throw new Error("User ID and Product ID are required");
  }

  const existingItem = await productRepository.findWishlistItem(user_id, product_id);

  if (existingItem) {
    await productRepository.removeWishlistItem(user_id, product_id);
    return { message: "Product removed from wishlist" };
  } else {
    const newItem = await productRepository.addWishlistItem(user_id, product_id);
    return { message: "Product added to wishlist", item: newItem };
  }
};

const getWishlist = async (user_id) => {
  if (!user_id) throw new Error("User ID is required");

  const wishlistItems = await productRepository.findWishlistItemsByUser(user_id);

  const formattedWishlist = wishlistItems.map((item) => {
    const product = item.product_id;
    if (!product) return null;

    return {
      _id: item._id,
      user_id: item.user_id,
      product: {
        _id: product._id,
        title: product.title,
        price: product.price,
        image: product.images && product.images.length > 0 ? product.images[0] : null,
      },
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    };
  }).filter(item => item !== null);

  return formattedWishlist;
};

//order
const checkout = async (user_id, { product_id, quantity, amount, paymentInfo }) => {
  if (!product_id || !quantity || !amount) {
    throw new Error("Product ID, quantity, and amount are required");
  }

  const product = await productRepository.getProductById(product_id);
  if (!product) throw new Error("Product not found");

  const qty = parseInt(quantity, 10);
  if (isNaN(qty) || qty <= 0) throw new Error("Invalid quantity");

  if (product.stock < qty) throw new Error("Not enough stock available");

  // Deduct stock
  product.stock -= qty;
  await product.save();

  
  const orderId = `ORD-${crypto.randomBytes(6).toString("hex").toUpperCase()}`;

  const orderData = {
    orderId,
    user_id,
    product_id,
    quantity: qty,
    amount,
    paymentInfo,
    status: "paid", 
  };

  const order = await productRepository.saveOrder(orderData);
  return order;
};


const getUserOrders = async (user_id)=>{
  return await productRepository.getOrderByUser(user_id);
}

const getOrder = async (id) => {
  const order = await productRepository.getOrderById(id);
  if (!order) throw new Error("Order not found");
  return order;
};


const getAllOrders = async () => {
  const orders = await productRepository.getAllOrders();
  if (!orders || orders.length === 0) {
    throw new Error("No orders found");
  }
  return orders;
};

module.exports = {getAllOrders,getUserOrders,getOrder,checkout,getWishlist,toggleWishlist,deleteProductCertificate,getProductCertificateById,getAllProductCertificate,deleteProductDetails,getProductById, deleteProductById, getAllProducts, createProduct ,updateProduct,addProductDetails,updateProductDetails,addProductCertificate,updateProductCertificate,getProductCart,deleteProductCart,addToCart,updateProductCart}