import Product from '../models/Product.js';
import cloudinary from '../config/cloudinary.js';

// Get all active products with pagination
const getProducts = async (req, res) => {
  try {
    const { page = 1, limit = 10, sort = '-createdAt', q } = req.query;
    const query = {};
    
    if (q) {
      query.$or = [
        { name: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } }
      ];
    }
    
    const options = {
      page: parseInt(page, 10),
      limit: Math.min(50, parseInt(limit, 10)),
      sort,
      lean: true
    };
    
    const result = await Product.paginate(query, options);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los productos', error: error.message });
  }
};

// Get product by ID
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product || !product.active) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el producto', error: error.message });
  }
};

// Create new product
const createProduct = async (req, res) => {
  try {
    const { name, description, price, stock, category } = req.body;
    
    if (!name || !description || price === undefined || stock === undefined || !category) {
      return res.status(400).json({ message: 'Todos los campos son requeridos' });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'Por favor sube una imagen' });
    }
    
    const productData = {
      name: name.trim(),
      description: description.trim(),
      price: parseFloat(price),
      stock: parseInt(stock, 10),
      category,
      image: req.file ? req.file.path : 'default.jpg'
    };
    
    const newProduct = new Product(productData);
    const productSaved = await newProduct.save();
    
    res.status(201).json({
      message: 'Producto creado exitosamente',
      product: productSaved
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Error al crear el producto', error: error.message });
  }
};

// Update product
const updateProduct = async (req, res) => {
  try {
    const { name, description, price, stock, category, active } = req.body;
    const updateData = {};
    
    if (name) updateData.name = name.trim();
    if (description) updateData.description = description.trim();
    if (price !== undefined) updateData.price = parseFloat(price);
    if (stock !== undefined) updateData.stock = parseInt(stock, 10);
    if (category) updateData.category = category;
    if (active !== undefined) updateData.active = active;
    if (req.file) {
      // Si hay una imagen previa, opcionalmente puedes eliminarla de Cloudinary
      if (req.body.oldImageId) {
        await cloudinary.uploader.destroy(req.body.oldImageId);
      }
      updateData.image = req.file.path;
    }
    
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!updatedProduct) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
    
    res.json({
      message: 'Producto actualizado exitosamente',
      product: updatedProduct
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Error al actualizar el producto', error: error.message });
  }
};

// Delete product (soft delete)
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    // Opcional: Eliminar la imagen de Cloudinary
    if (product.image) {
      const publicId = product.image.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(`productos/${publicId}`);
    }

    await Product.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'Producto eliminado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al eliminar el producto', error: error.message });
  }
};

export {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};
