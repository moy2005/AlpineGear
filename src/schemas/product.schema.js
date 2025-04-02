import { z } from 'zod';  // Importar Zod para definir y validar esquemas de datos

export const createProductSchema = z.object({
    name: z.string({
        required_error: 'El nombre es requerido',
    }),
    description: z.string({
        required_error: 'La descripción debe ser String',
    }),
    category: z.string({
        required_error: 'La categoría es requerida',
    }),
    price: z.number({
        required_error: 'El precio es requerido',
    }),
    stock: z.number({
        required_error: 'El stock es requerido',
    }),
    images: z.array(z.string()).optional(),
    marca: z.string({
        required_error: 'La marca es requerida',
    }),
    rating: z.number().default(0),
    reviews: z.array(z.object({
        user: z.string({
            required_error: 'El usuario es requerido',
        }),
        rating: z.number({
            required_error: 'La calificación es requerida',
        }),
        comment: z.string({
            required_error: 'El comentario es requerido',
        }),
        createdAt: z.date().default(new Date()),
    })).optional(),
});

