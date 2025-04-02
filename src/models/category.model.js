import mongoose from "mongoose";

// Esquema de la colección "categories"
const categorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true, // Asegura que los nombres sean únicos
        },
        description: {
            type: String,
            required: false, // Opcional
        },
    },
    {
        timestamps: true, // Añade "createdAt" y "updatedAt"
    }
);

// Exportar modelo
export default mongoose.model('Category', categorySchema);

