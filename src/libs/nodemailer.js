// import nodemailer from 'nodemailer';
// import { GMAIL_USER, GMAIL_PASS } from '../config.js';


// console.log(GMAIL_USER, GMAIL_PASS);
//  // Crea un objeto de transporte para enviar correos electrónicos
// export const transporter = nodemailer.createTransport({

//     service: 'gmail',
//     auth: {
//         user: GMAIL_USER,
//         pass: GMAIL_PASS,
//     },
// });



import nodemailer from 'nodemailer';
import { GMAIL_USER, GMAIL_PASS } from '../config.js';

// Configuración mejorada del transporter
export const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
        user: GMAIL_USER,
        pass: GMAIL_PASS
    },
    tls: {
        // No fallar en certificados inválidos
        rejectUnauthorized: false
    }
});

// Verificar la conexión al iniciar
transporter.verify((error) => {
    if (error) {
        console.error('Error al configurar el correo:', error);
    } else {
        console.log('Servidor de correo listo para enviar mensajes');
    }
});