import mongoose from 'mongoose';

const saleSchema = new mongoose.Schema({
  products: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
      quantity: { type: Number, required: true, min: 1 }
    }
  ],
  total: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  seller: { type: String }, // opcional, puede ser el usuario logueado
  notes: { type: String }
});

const Sale = mongoose.model('Sale', saleSchema);

export default Sale;

