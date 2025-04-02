import Marca from '../models/marca.model.js';

// Crear una nueva marca
export const createMarca = async (req, res) => {
    try {
        const { name, description } = req.body;

        // Validación básica
        if (!name) {
            return res.status(400).json({ message: 'El nombre es obligatorio' });
        }

        // Crear nueva marca
        const newMarca = new Marca({ name, description });
        await newMarca.save();

        res.status(201).json(newMarca); // Devuelve la marca creada
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al crear la marca' });
    }
};

// Obtener todas las marcas
export const getMarcas = async (req, res) => {
    try {
        const marcas = await Marca.find({});
        res.json(marcas);
    } catch (error) {
        return res.status(500).json({ message: "Hubo un fallo al obtener las marcas" });
    }
};

// Obtener una marca por ID
export const getMarcaById = async (req, res) => {
    try {
        const { id } = req.params;
        const marca = await Marca.findById(id);

        if (!marca) {
            return res.status(404).json({ message: 'Marca no encontrada' });
        }

        res.json(marca);
    } catch (error) {
        return res.status(500).json({ message: "Error al obtener la marca" });
    }
};

// Actualizar una marca
export const updateMarca = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description } = req.body;

        const updatedMarca = await Marca.findByIdAndUpdate(
            id,
            { name, description },
            { new: true } // Devuelve la marca actualizada
        );

        if (!updatedMarca) {
            return res.status(404).json({ message: 'Marca no encontrada' });
        }

        res.json(updatedMarca);
    } catch (error) {
        return res.status(500).json({ message: "Error al actualizar la marca" });
    }
};

// Eliminar una marca
export const deleteMarca = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedMarca = await Marca.findByIdAndDelete(id);

        if (!deletedMarca) {
            return res.status(404).json({ message: 'Marca no encontrada' });
        }

        res.json({ message: 'Marca eliminada correctamente' });
    } catch (error) {
        return res.status(500).json({ message: "Error al eliminar la marca" });
    }
};

