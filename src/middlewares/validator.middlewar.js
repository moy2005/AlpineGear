/* Este archivo contiene un middleware que valida los datos enviados por el cliente 
 contra un esquema definido utilizando una librería de validación. 
 Si los datos no cumplen con el esquema, se devuelve un error al cliente; 
 de lo contrario, se permite continuar con la solicitud. */

// Middleware para validar los datos de entrada según un esquema
export const validateSchema = (schema) => (req, res, next) => {
    try {
        // Validar los datos del cuerpo de la solicitud usando el esquema proporcionado
        schema.parse(req.body);

        // Si la validación es exitosa, pasar al siguiente middleware o controlador
        next();
    } catch (error) {
        // Si la validación falla, devolver un error 400 con los mensajes de error
        return res.status(400).json(
            error.errors.map((error) => error.message) // Extraer y enviar solo los mensajes de error
        );
    }
};

