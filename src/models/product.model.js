import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        description: { type: String, required: true },
        price: { type: Number, required: true },
        stock: { type: Number, required: true },
        images: { type: [String], optional: true },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Category',
            required: true,
        },
        marca: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Marca',
            required: true,
        },
        rating: { type: Number, default: 0 }, // Calificación promedio
        reviews: [
            {
                user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
                rating: { type: Number, required: true },
                comment: { type: String, required: true },
                createdAt: { type: Date, default: Date.now }
            }
        ]
    },
    
    {
        timestamps: true,
    }
);


export default mongoose.model('Product', productSchema);

