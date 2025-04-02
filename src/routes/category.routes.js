import { Router } from 'express';
import { createCategory, getCategories, getCategoryById, updateCategory, deleteCategory } from '../controllers/category.controller.js';

const router = Router();

// Crear categoría
router.post('/categories', createCategory);

// Obtener todas las categorías
router.get('/categories', getCategories);

// Obtener categoría por ID
router.get('/categories/:id', getCategoryById);

// Actualizar categoría por ID
router.put('/categories/:id', updateCategory);

// Eliminar categoría por ID
router.delete('/categories/:id', deleteCategory);

export default router;
