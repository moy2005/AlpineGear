/* Este archivo contiene una función para crear un JSON Web Token (JWT), 
  que es una herramienta ampliamente utilizada en aplicaciones web para la autenticación y autorización. 
  Los JWT permiten transmitir información de forma segura entre el cliente y el servidor. */

import { TOKEN_SECRET } from '../config.js'  // Importar la clave secreta para firmar el token
import jwt from 'jsonwebtoken'  // Importar el módulo jwt para trabajar con JSON Web Tokens

// Función para crear un token de acceso (JWT)
export function createAccessToken(payload) {
    // Devuelve una promesa que se resuelve con el token
    return new Promise((resolve, reject) => {
        // Usamos el método sign de jwt para firmar el payload y crear el token
        jwt.sign(
            payload,  // El payload es la información que será codificada dentro del token (por ejemplo, el ID del usuario)
            TOKEN_SECRET,  // La clave secreta utilizada para firmar el token (debe mantenerse en secreto)
            {
                expiresIn: "1d",  // El token tendrá una duración de 1 día
            },
            (err, token) => {
                // Si ocurre un error durante la creación del token, se rechaza la promesa
                if (err) reject(err)
                // Si no hay errores, se resuelve la promesa con el token generado
                resolve(token)
            }
        )
    })
}
