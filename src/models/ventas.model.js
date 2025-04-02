import mongoose from 'mongoose';

// Definir el esquema de la colección "sales" en la base de datos
const saleSchema = new mongoose.Schema(
    {
        // Referencia al producto relacionado con la venta
        product: {
            type: mongoose.Schema.Types.ObjectId,  // Referencia al ID del producto
            ref: 'Product',  // Nombre de la colección "Product"
            required: true,  // Este campo es obligatorio
        },
        // Referencia al usuario que realiza la compra
        user: {
            type: mongoose.Schema.Types.ObjectId,  // Referencia al ID del usuario
            ref: 'User',  // Nombre de la colección "User"
            required: true,  // Este campo es obligatorio
        },
        // Cantidad comprada del producto
        quantity: {
            type: Number,  // La cantidad debe ser un número
            required: true,  // Este campo es obligatorio
        },
        // Precio total de la venta
        totalPrice: {
            type: Number,  // El precio total debe ser un número
            required: true,  // Este campo es obligatorio
        },
        // Fecha en la que se realizó la venta
        saleDate: {
            type: Date,
            default: Date.now,  // Si no se proporciona, se establece la fecha actual por defecto
        }
    },
    {
        timestamps: true,  // Añade automáticamente campos "createdAt" y "updatedAt" al documento
    }
);

// Exportar el modelo "Sale" basado en el esquema definido
export default mongoose.model('Ventas', saleSchema);

