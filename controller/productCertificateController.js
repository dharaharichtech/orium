const productService = require("../services/productServices");

const addProductCertificate = async (req, res) => {
  try {
    const certificate = await productService.addProductCertificate(req.body, req.files);

    res.status(201).json({
      msg: "Product certificate added successfully",
      certificate,
    });
  } catch (error) {
    console.error("Error in addProductCertificate:", error);
    res.status(400).json({ msg: error.message });
  }
};

const updateProductCertificate = async (req, res) => {
  try {
    const { id } = req.params;

    const certificate = await productService.updateProductCertificate(
      id,
      req.body,
      req.files
    );

    res.status(200).json({
      msg: "Product certificate updated successfully",
      certificate,
    });
  } catch (error) {
    console.error("Error in updateProductCertificate:", error);
    res.status(400).json({ msg: error.message });
  }
};


const deleteProductCertificate = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedCertificate = await productService.deleteProductCertificate(id);

    res.status(200).json({
      msg: "Product certificate deleted successfully",
      deletedCertificate,
    });
  } catch (error) {
    console.error("Error in deleteProductCertificate:", error);
    res.status(400).json({ msg: error.message });
  }
};

const getAllProductCertificate = async (req, res) => {
  try {
    const certificates = await productService.getAllProductCertificate();
    res.status(200).json(certificates);
  } catch (error) {
    console.error("Error in getAllProductCertificate:", error);
    res.status(400).json({ msg: error.message });
  }
};

const getProductCertificateById = async (req, res) => {
  try {
    const { id } = req.params;

    const certificate = await productService.getProductCertificateById(id);

    res.status(200).json(certificate);
  } catch (error) {
    console.error("Error in getProductCertificateById:", error);
    res.status(400).json({ msg: error.message });
  }
};

module.exports = {
  getProductCertificateById,
  addProductCertificate,
  updateProductCertificate,
  deleteProductCertificate,
  getAllProductCertificate
};
