import { Document, model, Schema, Types } from 'mongoose';

export interface IProduct extends Document {
  _id: Types.ObjectId;
  name: string;
  description: string;
  quantity: number;
  status: boolean;
  price: number;
  createDate: Date;
  deleteDate: Date;
}

const productSchema = new Schema<IProduct>({
  name: { type: String, required: true },
  description: { type: String },
  quantity: { type: Number, required: true },
  status: { type: Boolean, default: true },
  price: { type: Number, required: true },
  createDate: { type: Date, default: Date.now },
  deleteDate: { type: Date }
});

export const Product = model<IProduct>('Product', productSchema, 'product');