import mongoose from "mongoose"; 
import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import cors from "cors";
import session from "express-session";
import MongoStore from "connect-mongo";
import { connectDB } from "./db.js"; 
import authRoutes from "./routes/auth.routes.js";
import productRoutes from "./routes/products.routes.js";
import ventasRoutes from "./routes/ventas.routes.js";
import categoryRoutes from "./routes/category.routes.js";
import marcaRoutes from "./routes/marca.routes.js"

// Cargar las variables de entorno
dotenv.config();

const app = express();

// Configuración de CORS mejorada
app.use(cors({
    origin: 'https://alpinegear.netlify.app',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['set-cookie']
  }));


app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());

connectDB();

// Configuración mejorada de la sesión
app.use(session({
    secret: 'unaClaveSuperSegura',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      client: mongoose.connection.getClient(),
      collectionName: 'sessions',
      ttl: 24 * 60 * 60,
      autoRemove: 'interval',
      autoRemoveInterval: 10
    }),
    cookie: {
      secure: true,
      httpOnly: true,
      sameSite: 'none',
      maxAge: 24 * 60 * 60 * 1000,
      domain: process.env.NODE_ENV === 'production' ? '.alpine-gear.vercel.app' : undefined
    }
  }));

// Middleware para verificar sesión (opcional, para debug)
app.use((req, res, next) => {
    console.log('Session ID:', req.sessionID);
    console.log('Session data:', req.session);
    next();
});

// Montar las rutas
app.use("/api", authRoutes);
app.use("/api", productRoutes);
app.use("/api", ventasRoutes);
app.use("/api", categoryRoutes);
app.use("/api", marcaRoutes);

export default app;