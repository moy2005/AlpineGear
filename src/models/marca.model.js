import mongoose from "mongoose";

// Definir el esquema de la colección "brands"
const marcaSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, unique: true },
        description: { type: String }
    },
    {
        timestamps: true,
    }
);

export default mongoose.model('Marca', marcaSchema);
