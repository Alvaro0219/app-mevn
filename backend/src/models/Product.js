import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'El nombre del producto es requerido'],
    trim: true,
    maxlength: [100, 'El nombre no puede tener más de 100 caracteres']
  },
  description: {
    type: String,
    required: [true, 'La descripción es requerida'],
    trim: true
  },
  price: {
    type: Number,
    required: [true, 'El precio es requerido'],
    min: [0, 'El precio no puede ser negativo']
  },
  stock: {
    type: Number,
    required: [true, 'El stock es requerido'],
    min: [0, 'El stock no puede ser negativo'],
    default: 0
  },
  category: {
    type: String,
    required: [true, 'La categoría es requerida'],
    enum: {
      values: ['Electrónica', 'Hogar', 'Ropa', 'Deportes', 'Otros'],
      message: 'Categoría no válida'
    }
  },
  image: {
    type: String,
    default: 'default.jpg'
  },
  active: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  versionKey: false
});

// Índice para búsqueda
productSchema.index({ name: 'text', description: 'text' });

// Aplicar el plugin de paginación
productSchema.plugin(mongoosePaginate);

const Product = mongoose.model('Product', productSchema);

export default Product;
