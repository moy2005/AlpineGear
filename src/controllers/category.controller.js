import Category from '../models/category.model.js';

export const createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    // Validación básica
    if (!name) {
      return res.status(400).json({ message: 'El nombre es obligatorio' });
    }

    // Crear nueva categoría
    const newCategory = new Category({ name, description });
    await newCategory.save();

    res.status(201).json(newCategory); // Devuelve la categoría creada
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al crear la categoría' });
  }
};

export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({});
    res.json(categories);
  } catch (error) {
    return res.status(500).json({ message: "Hubo un fallo al obtener las categorías" });
  }
};

export const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ message: 'Categoría no encontrada' });
    }

    res.json(category);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error al obtener la categoría' });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ message: 'Categoría no encontrada' });
    }

    category.name = name || category.name;
    category.description = description || category.description;

    await category.save();

    res.json(category);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error al actualizar la categoría' });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ message: 'Categoría no encontrada' });
    }

    await category.remove();

    res.json({ message: 'Categoría eliminada exitosamente' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error al eliminar la categoría' });
  }
};

