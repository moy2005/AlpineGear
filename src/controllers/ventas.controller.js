import Sale from '../models/ventas.model.js';  // Importación del modelo Sale
import Product from '../models/product.model.js';  // Importación del modelo Product

export const purchaseProduct = async (req, res) => {
    try {
        const { id } = req.params;  // ID del producto a comprar
        const { quantity, totalPrice } = req.body;  // Cantidad y precio total de la venta
        const userId = req.user.id;  // ID del usuario autenticado

        // Verificar disponibilidad de stock
        const product = await Product.findById(id);
        if (!product || product.stock < quantity) {
            return res.status(400).json({ message: 'Producto no disponible o stock insuficiente' });
        }

        // Registrar la venta
        const sale = await Sale.create({
            product: id,
            user: userId,
            quantity,
            totalPrice
        });

        // Actualizar stock del producto
        product.stock -= quantity;
        await product.save();

        res.status(201).json({ message: 'Venta registrada exitosamente', sale });
    } catch (error) {
        res.status(500).json({ message: 'Error al registrar la venta', error });
    }
};
