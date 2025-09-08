import Sale from '../models/Sale.js';
import Product from '../models/Product.js';

// Registrar una venta
export const createSale = async (req, res) => {
  try {
    const { products, seller, notes } = req.body;
    if (!products || !Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ message: 'Debes seleccionar al menos un producto.' });
    }
    // Calcular total y actualizar stock
    let total = 0;
    for (const item of products) {
      const prod = await Product.findById(item.product);
      if (!prod) return res.status(404).json({ message: 'Producto no encontrado.' });
      if (prod.stock < item.quantity) return res.status(400).json({ message: `Stock insuficiente para ${prod.name}` });
      total += prod.price * item.quantity;
      prod.stock -= item.quantity;
      await prod.save();
    }
    const sale = new Sale({ products, total, seller, notes });
    await sale.save();
    res.status(201).json(sale);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Listar ventas
export const getSales = async (req, res) => {
  try {
    const sales = await Sale.find().populate('products.product').sort({ date: -1 });
    res.json(sales);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Detalle de venta
export const getSaleById = async (req, res) => {
  try {
    const sale = await Sale.findById(req.params.id).populate('products.product');
    if (!sale) return res.status(404).json({ message: 'Venta no encontrada.' });
    res.json(sale);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
