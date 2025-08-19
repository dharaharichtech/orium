const productService = require("../services/productServices");

const addToCart = async (req, res) => {
  try {
    const { product_id, quantity, subtotal } = req.body;
    const user_id = req.user.userId;

    const { cartItem, remainingStock } = await productService.addToCart(
      user_id,
      product_id,
      quantity,
      subtotal
    );

    res.status(201).json({
      msg: "Product added to cart successfully",
      cartItem,
      remainingStock,
    });
  } catch (error) {
    console.error("Error in addToCart:", error);
    res.status(400).json({ msg: error.message });
  }
};

const updateProductCart = async (req, res) => {
  try {
    const { cart_id } = req.params;
    const { quantity, subtotal } = req.body;
    const user_id = req.user.userId;

    const { updatedCartItem, remainingStock } = await productService.updateProductCart(
      cart_id,
      user_id,
      quantity,
      subtotal
    );

    res.status(200).json({
      msg: "Cart updated successfully",
      updatedCartItem,
      remainingStock,
    });
  } catch (error) {
    console.error("Error in updateProductCart:", error);
    res.status(400).json({ msg: error.message });
  }
};

const deleteProductCart = async (req, res) => {
  try {
    const { cart_id } = req.params;
    const user_id = req.user.userId;

    const { remainingStock } = await productService.deleteProductCart(
      cart_id,
      user_id
    );

    res.status(200).json({
      msg: "Product removed from cart successfully",
      remainingStock,
    });
  } catch (error) {
    console.error("Error in deleteProductCart:", error);
    res.status(400).json({ msg: error.message });
  }
};

const getProductCart = async (req, res) => {
  try {
    const user_id = req.user.userId;
    const cartItems = await productService.getProductCart(user_id);
    res.status(200).json(cartItems);
  } catch (error) {
    console.error("Error in getProductCart:", error);
    res.status(400).json({ msg: error.message });
  }
};

module.exports = {
  addToCart,
  updateProductCart,
  deleteProductCart,
  getProductCart,
};
