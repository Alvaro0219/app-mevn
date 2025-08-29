import Product from '../models/Product.js';

// Obtener todos los productos
const getProducts = async (req, res) => {
  try {
    const { page = 1, limit = 10, sort = '-createdAt', q } = req.query;
    const query = { active: true };
    
    // Búsqueda por texto
    if (q) {
      query.$or = [
        { name: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } }
      ];
    }
    
    const options = {
      page: Math.max(1, parseInt(page, 10)),
      limit: Math.min(50, Math.max(1, parseInt(limit, 10))),
      sort: sort,
      lean: true
    };
    
    const result = await Product.paginate(query, options);
    
    res.json({
      docs: result.docs,
      totalDocs: result.totalDocs,
      limit: result.limit,
      totalPages: result.totalPages,
      page: result.page,
      pagingCounter: result.pagingCounter,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevPage: result.prevPage,
      nextPage: result.nextPage
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtener un producto por ID
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Crear un nuevo producto
const createProduct = async (req, res) => {
  try {
    console.log('Request body:', req.body);
    console.log('Uploaded file:', req.file);
    
    const { name, description, price, stock, category } = req.body;
    
    // Validar campos requeridos
    if (!name || !description || price === undefined || stock === undefined || !category) {
      console.log('Validation failed - Missing required fields');
      return res.status(400).json({ 
        success: false,
        message: 'Todos los campos son requeridos',
        fields: { name, description, price, stock, category }
      });
    }
    
    // Validar categoría
    const validCategories = ['Electrónica', 'Hogar', 'Ropa', 'Deportes', 'Otros'];
    if (!validCategories.includes(category)) {
      console.log(`Invalid category: ${category}`);
      return res.status(400).json({
        success: false,
        message: 'Categoría no válida',
        validCategories
      });
    }
    
    const productData = {
      name: name.trim(),
      description: description.trim(),
      price: parseFloat(price),
      stock: parseInt(stock, 10),
      category,
      image: req.file ? req.file.filename : 'default.jpg'
    };
    
    console.log('Creating product with data:', productData);
    
    const newProduct = new Product(productData);
    const productSaved = await newProduct.save();
    
    console.log('Product created successfully:', productSaved);
    
    res.status(201).json({
      success: true,
      data: productSaved
    });
    
  } catch (error) {
    console.error('Error creating product:', error);
    
    // Manejar errores de validación de Mongoose
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        message: 'Error de validación',
        errors: messages
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error al crear el producto',
      error: error.message
    });
  }
};

// Actualizar un producto
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = { ...req.body };
    
    if (req.file) {
      updates.image = req.file.filename;
    }
    
    const updatedProduct = await Product.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true
    });
    
    if (!updatedProduct) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
    
    res.json(updatedProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Eliminar un producto (borrado lógico)
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { active: false },
      { new: true }
    );
    
    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
    
    res.json({ message: 'Producto desactivado correctamente' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Búsqueda de productos
const searchProducts = async (req, res) => {
  try {
    const { q } = req.query;
    const products = await Product.find({
      $text: { $search: q },
      active: true
    }).limit(10);
    
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  searchProducts
};
