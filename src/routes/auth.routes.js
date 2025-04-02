import { Router } from 'express';
import { 
    login, 
    register, 
    logout, 
    updateUser, 
    profile, 
    verifyToken,
    verifyTokenReset, 
    forgot_password, 
    reset_password, 
    verifyKeyword, 
    verifyCode, 
    send_link,
    sendVerificationCode,     // Nueva función para enviar el código
    verifyEmailCode          // Nueva función para verificar el código
} from '../controllers/auth.controller.js';
import { authRequired } from '../middlewares/validateToken.js';
import { validateSchema } from '../middlewares/validator.middlewar.js';
import { registerSchema, loginSchema } from '../schemas/auth.schema.js';

const router = Router();

// Rutas de registro y verificación
router.post('/register', validateSchema(registerSchema), register);


router.post('/verify-email/:token', verifyToken);
router.post('/verifyCode', verifyCode);

// Nuevas rutas para el sistema de verificación por código
router.post('/send-verification-code', sendVerificationCode);  // Envía el código de verificación
router.post('/verify-email-code', verifyEmailCode);           // Verifica el código enviado

// Rutas de autenticación
router.post('/login', validateSchema(loginSchema), login);
router.put('/:id', authRequired, updateUser);
router.post('/logout', logout);
router.get('/verify', authRequired, verifyToken);

// Cambiar de GET a POST para verifyTokenReset
router.post('/verifyTokenReset', verifyTokenReset);

// Rutas de recuperación de contraseña
router.get('/verifyToken/:token', verifyTokenReset);


router.post('/forgot-password', forgot_password);
router.post('/verify-keyword', verifyKeyword);
router.post('/reset-password', reset_password);
router.post('/send-email', send_link);

// Ruta de perfil
router.get('/profile', authRequired, profile);

export default router;

