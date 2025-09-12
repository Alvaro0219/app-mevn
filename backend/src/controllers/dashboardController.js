import User from '../models/User.js';
import Product from '../models/Product.js';
import Sale from '../models/Sale.js';

export const getDashboardMetrics = async (req, res) => {
  try {
    // Total usuarios
    const totalUsers = await User.countDocuments();
  // Productos activos
  const activeProducts = await Product.countDocuments({ active: true });
    // Ventas del mes
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    const salesOfMonth = await Sale.aggregate([
      { $match: { date: { $gte: firstDay, $lte: lastDay } } },
      { $group: { _id: null, total: { $sum: '$total' } } }
    ]);
    // Reportes generados (simulado, puedes cambiar la lógica)
    const reportsGenerated = 0;
    // Ventas por mes (últimos 6 meses)
    const salesByMonth = await Sale.aggregate([
      { $group: {
        _id: { year: { $year: '$date' }, month: { $month: '$date' } },
        total: { $sum: '$total' }
      } },
      { $sort: { '_id.year': -1, '_id.month': -1 } },
      { $limit: 6 }
    ]);
    // Productos por categoría
    const productsByCategory = await Product.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);
  // Pedidos recientes (últimos 5)
  const recentOrders = await Sale.find().sort({ date: -1 }).limit(5).populate('products.product', 'name price category');
    // Productos más vendidos (top 5)
    const topProducts = await Sale.aggregate([
      { $unwind: '$products' },
      { $group: {
        _id: '$products.product',
        sales: { $sum: '$products.quantity' },
        revenue: { $sum: { $multiply: ['$products.quantity', '$products.price'] } }
      } },
      { $sort: { sales: -1 } },
      { $limit: 5 }
    ]);

    res.json({
      totalUsers,
      activeProducts,
      salesOfMonth: salesOfMonth[0]?.total || 0,
      reportsGenerated,
      salesByMonth,
      productsByCategory,
      recentOrders,
      topProducts
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener métricas', error });
  }
};
