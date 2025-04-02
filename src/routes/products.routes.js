import { Router } from 'express';  // Importar Router de Express para definir rutas
import { authRequired } from '../middlewares/validateToken.js';  // Middleware para verificar autenticación
import {
    getProducts,       // Controlador para obtener todos los productos del usuario
    getProduct,        // Controlador para obtener un producto específico
    createProduct,     // Controlador para crear un nuevo producto
    updateProduct,     // Controlador para actualizar un producto existente
    deleteProduct      // Controlador para eliminar un producto
} from '../controllers/products.controller.js';
import { validateSchema } from '../middlewares/validator.middlewar.js';  // Middleware para validar los datos según un esquema
import { createProductSchema } from '../schemas/product.schema.js';  // Esquema de validación para la creación de productos

const router = Router();  // Crea una nueva instancia de Router

// Ruta para obtener todos los productos del usuario
// Ahora esta ruta es pública, por lo que no lleva 'authRequired'
router.get('/products', getProducts);

// Ruta para obtener un producto específico por su ID
// Ahora esta ruta es pública, por lo que no lleva 'authRequired'
router.get('/products/:id', getProduct);

// Ruta para crear un nuevo producto
// Requiere autenticación para crear productos
router.post('/products', authRequired, validateSchema(createProductSchema), createProduct);

// Ruta para eliminar un producto por su ID
// Requiere autenticación para eliminar productos
router.delete('/products/:id', authRequired, deleteProduct);

// Ruta para actualizar un producto por su ID
// Requiere autenticación para actualizar productos
router.put('/products/:id', authRequired, updateProduct);

// Exporta el router para que pueda ser utilizado en otras partes de la aplicación
export default router;
