import mongoose from "mongoose"; // Importar mongoose para trabajar con MongoDB

// Función para conectar a la base de datos MongoDB
export const connectDB = async () => {
    try {
        await mongoose.connect(
            "mongodb+srv://Castro:2eUrwXavARUa4oFX@alpinegear.3d1fzp2.mongodb.net/AlpineGear?retryWrites=true&w=majority&appName=AlpineGear"
        );
        console.log("MongoDB conectado");
    } catch (error) {
        console.error("Error al conectar MongoDB:", error);
        process.exit(1);
    }
};