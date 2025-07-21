import mongoose, { model, Schema, Document } from "mongoose";

export interface Imenu extends Document {
    title: string;
    path: string;
    icon: string;
    roles: string[];
}

const menuSchema = new Schema<Imenu>({
    title: {
        type: String,
        required: true
    },
    path: {
        type: String,
        required: true
    },
    icon: {
        type: String
    },
    roles: {
        type: [String]
    }
});

export const Menu = model<Imenu>('Menu', menuSchema, 'menu');
