import express from "express";
import mongoose from "mongoose";
import { Server } from 'socket.io';

const app = express();
const PORT = process.env.PORT || 8080;
const DB_URL = 'mongodb+srv://backend:wp3pY3V896VQxtfp@ecommerce.zhcscvh.mongodb.net/?retryWrites=true&w=majority&appName=ecommerce';

const connectMongoDB = async () => {
  const dataBase = 'ecommerce';
  try {
    await mongoose.connect(DB_URL, { dbName: dataBase });
    console.log("Conectado a la base de datos 'ecommerce'");
  } catch (error) {
    console.error("No se pudo conectar a la base de datos", error);
    process.exit();
  }
}

connectMongoDB()

const server = app.listen(PORT, () => console.log("Server listening in", PORT))
const io = new Server(server)

export { app, io };