import { Router } from 'express';  // Importar Router de Express
import { authRequired } from '../middlewares/validateToken.js';  // Middleware para verificar autenticación
import { purchaseProduct } from '../controllers/ventas.controller.js';  // Controlador para manejo de ventas

const router = Router();  // Crear una nueva instancia de Router

// Ruta para registrar una compra
// - Método: POST
// - Middleware: 'authRequired' asegura que el usuario esté autenticado
// - Controlador: 'purchaseProduct' maneja la lógica para registrar la venta
router.post('/products/:id/purchase', authRequired, purchaseProduct);

export default router;

