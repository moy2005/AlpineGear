
import { z } from 'zod'; // Importar Zod para definir y validar esquemas de datos

// Esquema de validación para el registro de un usuario
export const registerSchema = z.object({

    realName: z.string({
        required_error: 'El nombre real es requerido',
    }).min(2, {
        message: 'El nombre real debe tener al menos 2 caracteres',
    }).max(50, {
        message: 'El nombre real no debe superar los 50 caracteres',
    }).regex(/^[a-zA-Z\s]+$/, {
        message: 'El nombre real solo puede contener letras y espacios',
    }),

    lastName: z.string({
        required_error: 'El apellido es requerido',
    }).min(2, {
        message: 'El apellido debe tener al menos 2 caracteres',
    }).max(50, {
        message: 'El apellido no debe superar los 50 caracteres',
    }).regex(/^[a-zA-Z\s]+$/, {
        message: 'El apellido solo puede contener letras y espacios',
    }),

    phoneNumber: z.string({
        required_error: 'El número de teléfono es requerido',
    })
    .regex(/^\d{10}$/, {
        message: 'El número de teléfono debe contener exactamente 10 dígitos',
    }),

    email: z.string({
        required_error: 'El correo es requerido',
    }).email({
        message: 'Correo inválido',
    }),

    password: z.string({
        required_error: 'La contraseña es requerida',
    })
    .min(8, {
        message: 'La contraseña debe tener al menos 8 caracteres',
    })
    .max(100, {
        message: 'La contraseña no debe superar los 100 caracteres',
    })
    .regex(/[A-Z]/, {
        message: 'La contraseña debe contener al menos una letra mayúscula',
    })
    .regex(/[a-z]/, {
        message: 'La contraseña debe contener al menos una letra minúscula',
    })
    .regex(/[0-9]/, {
        message: 'La contraseña debe contener al menos un número',
    })
    .regex(/[@$!%*?&]/, {
        message: 'La contraseña debe contener al menos un carácter especial (@$!%*?&)',
    }),

    secretWord: z.string({
        required_error: 'La palabra secreta es requerida',
    })
    .min(4, {
        message: 'La palabra secreta debe tener al menos 4 caracteres',
    })
    .max(50, {
        message: 'La palabra secreta no debe superar los 50 caracteres',
    })
    .regex(/^[a-zA-Z0-9\s]+$/, {
        message: 'La palabra secreta solo puede contener letras, números y espacios',
    }),

    role: z.enum(["admin", "cliente"]).default("cliente")
});

// Esquema de validación para el inicio de sesión de un usuario
export const loginSchema = z.object({
    email: z.string({
        required_error: 'El correo es requerido',
    }).email({
        message: 'Correo inválido',
    }),

    password: z.string({
        required_error: 'La contraseña es requerida',
    })
});