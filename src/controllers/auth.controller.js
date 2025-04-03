
import crypto from 'crypto'
import User from '../models/user.model.js'
import bcrypt from 'bcryptjs'
import { createAccessToken } from '../libs/jwt.js'
import { transporter } from '../libs/nodemailer.js'
import jwt from 'jsonwebtoken'
import { TOKEN_SECRET, FRONTEND_URL, GMAIL_USER, GMAIL_PASS } from '../config.js'
import userModel from '../models/user.model.js'

// Controlador para registrar un nuevo usuario
export const register = async (req, res) => {
    const { email, password, realName, lastName, phoneNumber, secretWord, role } = req.body;

    try {
        // 1. Validación de campos requeridos
        if (!email || !password || !realName || !lastName || !phoneNumber || !secretWord) {
            return res.status(400).json({
                success: false,
                message: "Todos los campos son requeridos",
                code: "MISSING_FIELDS"
            });
        }

        // 2. Verificar si el usuario ya existe
        const userFound = await User.findOne({ email });
        if (userFound) {
            return res.status(400).json({
                success: false,
                message: "El correo ya está en uso",
                code: "EMAIL_IN_USE"
            });
        }

        // 3. Encriptar contraseña
        const passwordHash = await bcrypt.hash(password, 10);

        // 4. Generar código de verificación (6 dígitos numéricos)
        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
        const verificationCodeExpires = new Date(Date.now() + 10 * 60 * 1000); // Expira en 10 minutos

        // 5. Crear nuevo usuario en la base de datos
        const newUser = new User({
            email,
            password: passwordHash,
            realName,
            lastName,
            phoneNumber,
            secretWord,
            role: role || "cliente",
            verificationCode,
            verificationCodeExpires,
            isVerified: false
        });

        await newUser.save();

        // 6. Generar token temporal para verificación (válido por 10 minutos)
        const tempToken = jwt.sign(
            { 
                id: newUser._id, 
                purpose: 'email_verification',
                code: verificationCode // Opcional: incluir el código en el token
            }, 
            TOKEN_SECRET, 
            { expiresIn: '10m' }
        );

        // 7. Enviar correo de verificación con diseño profesional
        try {
            // Creando una plantilla de correo HTML más avanzada
            const emailHtml = `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verificación de Cuenta - AlpineGear</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #343a40; background-color: #f8f9fa;">
    <table align="center" role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="max-width: 600px; margin: 0 auto;">
        <!-- Header with Logo -->
        <tr>
            <td style="padding: 0;">
                <table width="100%" border="0" cellspacing="0" cellpadding="0" role="presentation">
                    <tr>
                        <td style="background-color: #3e4095; padding: 30px 20px; text-align: center;">
                            <table width="100%" border="0" cellspacing="0" cellpadding="0" role="presentation">
                                <tr>
                                    <td>
                                        <div style="display: flex; align-items: center; justify-content: center; margin: 0 auto; width: fit-content;">
                                            <!-- Mountain Icon -->
                                            <div style="background-color: #f26522; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 15px;">
                                                <div style="border-left: 10px solid transparent; border-right: 10px solid transparent; border-bottom: 20px solid white; margin-top: -5px;"></div>
                                            </div>
                                            <!-- Brand Name -->
                                            <h1 style="color: white; font-size: 26px; font-weight: 700; margin: 0;">AlpineGear</h1>
                                        </div>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
        
        <!-- Main Content -->
        <tr>
            <td style="background-color: #ffffff; padding: 40px 30px; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); border-radius: 0 0 8px 8px;">
                <table width="100%" border="0" cellspacing="0" cellpadding="0" role="presentation">
                    <!-- Greeting -->
                    <tr>
                        <td>
                            <h2 style="color: #3e4095; font-size: 24px; font-weight: 600; margin-top: 0; margin-bottom: 20px;">Confirma tu Cuenta</h2>
                            <p style="font-size: 16px; line-height: 1.6; color: #495057;">¡Hola <strong style="color: #3e4095;">${realName} ${lastName}</strong>!</p>
                            <p style="font-size: 16px; line-height: 1.6; color: #495057; margin-bottom: 30px;">¡Gracias por unirte a AlpineGear! Para completar tu registro y acceder a nuestra tienda de equipamiento para aventuras al aire libre, necesitamos verificar tu dirección de correo electrónico.</p>
                        </td>
                    </tr>
                    
                    <!-- Verification Code Box -->
                    <tr>
                        <td>
                            <table width="100%" border="0" cellspacing="0" cellpadding="0" role="presentation">
                                <tr>
                                    <td style="background-color: #f4f4fd; border-left: 4px solid #3e4095; border-radius: 8px; padding: 25px 20px; text-align: center;">
                                        <p style="font-size: 14px; color: #495057; margin-top: 0; margin-bottom: 15px;">Tu código de verificación es:</p>
                                        <p style="font-size: 32px; font-weight: 700; letter-spacing: 8px; color: #3e4095; margin: 0;">${verificationCode}</p>
                                        <div style="margin-top: 20px; padding-top: 20px; border-top: 1px dashed #dee2e6;">
                                            <p style="color: #dc3545; font-size: 14px; margin: 0;">⏱️ Este código expirará en 10 minutos</p>
                                        </div>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    
                    <!-- Instructions -->
                    <tr>
                        <td style="padding-top: 30px;">
                            <p style="font-size: 16px; line-height: 1.6; color: #495057; margin-bottom: 25px;">Por favor ingresa este código en la página de verificación para completar tu registro. Si no has solicitado crear una cuenta en AlpineGear, puedes ignorar este mensaje.</p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
        
        <!-- Help Section -->
        <tr>
            <td style="padding: 30px 20px; text-align: center; background-color: #f8f9fa; border-top: 1px solid #dee2e6;">
                <p style="font-size: 14px; color: #6c757d; margin-bottom: 20px;">¿Necesitas ayuda? Contáctanos en <a href="mailto:soporte@alpinegear.com" style="color: #3e4095; text-decoration: none;">soporte@alpinegear.com</a></p>
                
                <!-- Social Links -->
                <table align="center" style="margin: 0 auto; text-align: center;">
                    <tr>
                        <td style="padding: 0 10px;">
                            <img src="https://cdn-icons-png.flaticon.com/512/733/733547.png" width="24" height="24" alt="Facebook" style="border: 0;">
                        </td>
                        <td style="padding: 0 10px;">
                            <img src="https://cdn-icons-png.flaticon.com/512/2111/2111463.png" width="24" height="24" alt="Instagram" style="border: 0;">
                        </td>
                        <td style="padding: 0 10px;">
                            <img src="https://cdn-icons-png.flaticon.com/512/733/733579.png" width="24" height="24" alt="Twitter" style="border: 0;">
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
        
        <!-- Footer -->
        <tr>
            <td style="padding: 20px; text-align: center; color: #adb5bd; font-size: 12px;">
                <p style="margin: 0 0 10px;">© ${new Date().getFullYear()} AlpineGear. Todos los derechos reservados.</p>
                <p style="margin: 0;">Este correo fue enviado a ${email} porque se registró en AlpineGear.</p>
            </td>
        </tr>
    </table>
</body>
</html>
            `;

            await transporter.sendMail({
                from: `"AlpineGear" <${process.env.GMAIL_USER}>`,
                to: email,
                subject: 'Verifica tu cuenta en AlpineGear',
                html: emailHtml,
                text: `Tu código de verificación para AlpineGear es: ${verificationCode}. Este código expira en 10 minutos. Ingresa este código en la página de verificación para completar tu registro.`
            });
        } catch (emailError) {
            console.error('Error al enviar email:', emailError);
            // No detenemos el proceso aunque falle el envío del correo
        }

        // 8. Responder con éxito
        return res.status(201).json({
            success: true,
            message: 'Usuario registrado. Por favor verifica tu correo electrónico.',
            tempToken, // Token temporal para la verificación
            userId: newUser._id // Opcional: enviar el ID para referencia
        });

    } catch (error) {
        console.error('Error en registro:', error);
        return res.status(500).json({
            success: false,
            message: "Error al registrar usuario",
            error: error.message,
            code: "SERVER_ERROR"
        });
    }
};


// Controlador para iniciar sesión de un usuario
export const login = async (req, res) => {
    const { email, password } = req.body
    console.log('Login attempt:', { email, password });

    try {
        // Buscar al usuario en la base de datos por su email
        const userFound = await User.findOne({ email })


        // Verificar si el usuario no existe
        if (!userFound) return res.status(400).json(["Usuario no encontrado"])

        // Comparar la contraseña proporcionada con la almacenada en la base de datos
        const isMatch = await bcrypt.compare(password, userFound.password)

        console.log('Password match:', isMatch);

        // Verificar si las contraseñas no coinciden
        if (!isMatch) return res.status(400).json(["Contraseña incorrecta"])

        // Crear un token JWT para autenticar al usuario
        const token = await createAccessToken({ id: userFound._id, role: userFound.role })

        // Guardar el token en una cookie para mantener la sesión
        res.cookie('token', token)

        // Enviar al cliente los datos del usuario logueado (sin la contraseña)
        res.json({
            id: userFound._id,
            realName: userFound.realName,
            lastName: userFound.lastName,
            email: userFound.email,
            phoneNumber: userFound.phoneNumber,
            secretWord: userFound.secretWord,
            role: userFound.role || 'cliente',
            createdAt: userFound.createdAt,
            updatedAt: userFound.updatedAt,
            token
        })
    } catch (error) {
        console.error('Login error:', error);
        // Manejo de errores: devolver un mensaje de error si algo falla
        res.status(500).json({ message: error.message })
    }
}

// Controlador para cerrar sesión de un usuario
export const logout = (req, res) => {
    // Limpiar la cookie que contiene el token
    res.cookie('token', "", {
        expires: new Date(0) // Establecer la cookie con una fecha de expiración pasada
    })
    return res.sendStatus(200) // Responder con un estado exitoso
}

// Controlador para obtener la información del perfil de un usuario
export const profile = async (req, res) => {
    try {
        // Buscar al usuario por su ID obtenido del token
        const userFound = await User.findById(req.user.id)

        // Verificar si el usuario no existe
        if (!userFound) return res.status(400).json(["Usuario no encontrado"])

        // Enviar los datos del usuario al cliente
        return res.json({
            id: userFound._id,
            realName: userFound.realName,
            lastName: userFound.lastName,
            email: userFound.email,
            phoneNumber: userFound.phoneNumber,
            secretWord: userFound.secretWord,
            role: userFound.role || 'cliente',
            createdAt: userFound.createdAt,
            updatedAt: userFound.updatedAt,
        })
    } catch (error) {
        // Manejo de errores
        res.status(500).json({ message: error.message })
    }
}

export const updateUser = async (req, res) => {
    try {
        // Verificar si el usuario está intentando actualizar su propio perfil
        if (req.user.id !== req.params.id) {
            return res.status(403).json({
                message: "No tienes permiso para actualizar este perfil"
            });
        }

        const updates = {
            username: req.body.username,
            lastName: req.body.lastName,
            phoneNumber: req.body.phoneNumber,
            password: req.body.password
        };

        // Actualizar el usuario
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            updates,
            { new: true, runValidators: true }
        ).select('-password');

        if (!updatedUser) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        res.json(updatedUser);
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({
                message: "El email o nombre de usuario ya existe"
            });
        }
        res.status(500).json({ message: error.message });
    }
};

// Controlador para verificar la validez del token de sesión
export const verifyToken = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(401).json({ message: "Usuario no autorizado" });

        return res.json({
            id: user._id,
            realName: user.realName,
            lastName:user.lastName,
            phoneNumber:user.phoneNumber,
            secretWord:user.secretWord,
            email: user.email,
            role: user.role,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

//Verfica si el token es valido no regresa ningun dato al fronend
export const verifyTokenReset = async (req, res) => {
    const { token } = req.body;

    if (!token) {
        return res.status(400).json({ message: 'Token es requerido' });
    }

    try {
        const decoded = jwt.verify(token, TOKEN_SECRET);
        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        res.status(200).json({ message: 'Token válido' });
    } catch (err) {
        console.error('Error verificando token:', err);
        res.status(400).json({ message: 'Token inválido o expirado' });
    }
};


export const forgot_password = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ 
            success: false,
            message: 'El correo es requerido' 
        });
    }

    try {
        // Solo verificar si el email existe
        const user = await User.findOne({ email }).select('_id email');
        
        if (!user) {
            return res.status(404).json({ 
                success: false,
                message: 'El correo no está registrado' 
            });
        }

        return res.status(200).json({ 
            success: true,
            message: 'Correo verificado. Por favor ingrese su palabra secreta.'
        });

    } catch (error) {
        console.error('Error en forgot_password:', error);
        return res.status(500).json({ 
            success: false,
            message: 'Error al verificar el correo' 
        });
    }
};



export const reset_password = async (req, res) => {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) return res.status(400).json({ message: 'La nueva contraseña es requerida' });

    if (newPassword.length < 6) return res.status(400).json({ message: 'La contraseña debe tener al menos 6 caracteres' });

    try {
        const decoded = jwt.verify(token, TOKEN_SECRET);

        console.log(decoded)

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        const userUpdated = await User.findByIdAndUpdate(decoded.id, { password: hashedPassword });

        const mailOptions = {
            to: userUpdated.email,
            subject: 'Contraseña actualizada',
            html: `<p>Tu contraseña ha sido actualizada con éxito. <a href="${FRONTEND_URL}/login">Iniciar sesion</a></p>`,
        };

        await transporter.sendMail(mailOptions); //Enviar correco de confirmacion

        res.status(200).json({ message: 'Contraseña actualizada con éxito' });

    } catch (err) {
        res.status(400).json({ message: 'Token inválido o expirado' });
    }
};

export const verifyCode = async (req, res) => {
    try {
        const { email, code } = req.body;

        const user = await User.findOne({ email });

        if (!user) return res.status(404).json({ message: 'Usuario no encontrado.' });
        if (User.isVerified) return res.status(400).json({ message: 'Cuenta ya verificada.' });

        // Validar el código y su expiración
        if (user.verificationCode !== code) return res.status(400).json({ message: 'Código incorrecto.' });
        if (user.verificationCodeExpires < Date.now()) return res.status(400).json({ message: 'Código expirado.' });

        // Marcar como verificado y eliminar el código
        user.isVerified = true;
        user.verificationCode = null;
        user.verificationCodeExpires = null;

        await user.save();

        res.json({ message: 'Cuenta verificada con éxito.' });
    } catch (err) {
        res.status(500).json({ message: 'Error al verificar usuario.', error: err.message });
    }
};


export const send_link = async (req, res) => {

    const { email } = req.body;

    //if (!email) return res.status(400).json({ message: 'El correo es requerido' });

    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

    // Generar el token de recuperación
    const token = jwt.sign({ id: user._id }, TOKEN_SECRET, { expiresIn: '1h' });

    // Construir la URL de recuperación de contraseña
    const resetUrl = `${FRONTEND_URL}/reset-password/${token}`;

    // Configurar las opciones del correo
    const mailOptions = {
        to: email,
        subject: 'Recuperación de contraseña',
        html: `<p>Haz clic <a href="${resetUrl}">aquí</a> para restablecer tu contraseña. Este enlace es válido por 1 hora.</p>`,
    };

    // Enviar el correo
    await transporter.sendMail(mailOptions);

    return res.status(200).json({ message: 'Correo de recuperación enviado' });
};


export const verifyKeyword = async (req, res) => {
    const { email, secretWord } = req.body;

    if (!email || !secretWord) {
        return res.status(400).json({ 
            success: false,
            message: 'Todos los campos son requeridos' 
        });
    }

    try {
        // Consulta única que verifica ambos campos
        const user = await User.findOne({ 
            email,
            secretWord 
        });

        if (!user) {
            return res.status(401).json({ 
                success: false,
                message: 'Credenciales inválidas' 
            });
        }

        // Generar token de recuperación
        const token = jwt.sign({ id: user._id }, TOKEN_SECRET, { expiresIn: '1h' });
        const resetUrl = `${FRONTEND_URL}/reset-password/${token}`;

        // Enviar correo
        await transporter.sendMail({
            to: email,
            subject: 'Recuperación de contraseña',
            html: `<p>Haz clic <a href="${resetUrl}">aquí</a> para restablecer tu contraseña. Este enlace expira en 1 hora.</p>`
        });

        return res.status(200).json({ 
            success: true,
            message: 'Correo de recuperación enviado' 
        });

    } catch (error) {
        console.error('Error en verifyKeyword:', error);
        return res.status(500).json({ 
            success: false,
            message: 'Error al procesar la solicitud' 
        });
    }
};


export const sendVerificationCode = async (req, res) => {
    const { email, realName, lastName, phoneNumber, password, secretWord } = req.body;

    try {
        const userFound = await User.findOne({ email });
        if (userFound) return res.status(400).json({ message: "El correo ya está en uso." });

        const verificationCode = crypto.randomBytes(3).toString('hex');
        const verificationCodeExpires = new Date(Date.now() + 10 * 60 * 1000);

        // Guardar datos en la sesión
        req.session.pendingUser = {
            email,
            realName,
            lastName,
            phoneNumber,
            password,
            secretWord,
            verificationCode,
            verificationCodeExpires
        };

        // 🔥 Guardar la sesión manualmente
        req.session.save((err) => {
            if (err) {
                console.error("❌ Error guardando sesión:", err);
                return res.status(500).json({ message: "Error al guardar la sesión." });
            }

            console.log("✅ Sesión guardada:", req.session);

            // Enviar código por correo
            // transporter.sendMail({
            //     from: `"Empresa" <huellitas2032@gmail.com>`, // 👈 Aquí agregamos el nombre
            //     to: email,
            //     subject: "Código de verificación",
            //     text: `Tu código de verificación es: ${verificationCode}. Expira en 10 minutos.`,
            // });
            transporter.sendMail({
                from: `"Huellitas" <${GMAIL_USER}>`, // Usar el email configurado
                to: email,
                subject: "Verifica tu cuenta en Huellitas",
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eaeaea; padding: 20px;">
                        <h2 style="color: #4CAF50;">¡Bienvenido a Huellitas!</h2>
                        <p>Hola ${realName},</p>
                        <p>Para completar tu registro, por favor ingresa el siguiente código de verificación:</p>
                        
                        <div style="background: #f4f4f4; margin: 20px 0; padding: 15px; 
                                    text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 2px;">
                            ${verificationCode}
                        </div>
                        
                        <p>Este código expirará en 10 minutos.</p>
                        <p>Si no solicitaste este registro, por favor ignora este mensaje.</p>
                        
                        <hr style="border: none; border-top: 1px solid #eaeaea; margin: 20px 0;">
                        
                        <footer style="font-size: 12px; color: #777;">
                            <p>© ${new Date().getFullYear()} Huellitas. Todos los derechos reservados.</p>
                            <p><small>Este es un mensaje automático, por favor no respondas directamente.</small></p>
                        </footer>
                    </div>
                `,
                text: `Tu código de verificación para Huellitas es: ${verificationCode}. Este código expira en 10 minutos.`,
                headers: {
                    'X-Priority': '1',
                    'X-MSMail-Priority': 'High',
                    'Importance': 'High',
                    'X-Mailer': 'Nodemailer'
                }
            });
            

            return res.status(200).json({ message: "Código de verificación enviado" });
        });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};


export const verifyEmailCode = async (req, res) => {
    const { email, code, tempToken } = req.body;

    try {
        // Verificar token temporal
        const decoded = jwt.verify(tempToken, TOKEN_SECRET);
        
        // Buscar usuario
        const user = await User.findOne({
            _id: decoded.id,
            email,
            verificationCode: code
        });

        if (!user) {
            return res.status(400).json({ 
                message: "Código inválido o expirado",
                code: "INVALID_CODE"
            });
        }

        if (user.verificationCodeExpires < new Date()) {
            return res.status(400).json({ 
                message: "El código ha expirado", 
                code: "CODE_EXPIRED" 
            });
        }

        // Actualizar usuario
        user.isVerified = true;
        user.verificationCode = null;
        user.verificationCodeExpires = null;
        await user.save();

        // Generar token definitivo
        const token = jwt.sign(
            { id: user._id, role: user.role }, 
            TOKEN_SECRET, 
            { expiresIn: '1d' }
        );

        return res.status(200).json({ 
            success: true, 
            message: "Usuario verificado correctamente",
            token
        });

    } catch (error) {
        console.error('Error en verifyEmailCode:', error);
        return res.status(400).json({
            message: error.message.includes('jwt expired') 
                ? "Token temporal expirado, por favor registrese nuevamente"
                : "Error al verificar el código",
            code: "VERIFICATION_ERROR"
        });
    }
};