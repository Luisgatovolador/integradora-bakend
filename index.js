import express from "express";
import mongoose from "mongoose";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";

import usuarioRoutes from "./routes/usuarioRoutes.js";
import compraRoutes from "./routes/compraRoutes.js";
import inventarioRoutes from "./routes/inventarioRoutes.js";
import materiaPrimaRoutes from "./routes/materiaPrimaRoutes.js";
import productoRoutes from "./routes/productoRoutes.js";
import produccionRoutes from "./routes/produccionRoutes.js";
import proveedorRoutes from "./routes/proveedorRoutes.js";
import recetaRoutes from "./routes/recetaRoutes.js";
import sucursalRoutes from "./routes/sucursalRoutes.js";
import alertaRoutes from "./routes/alertaRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import ventaRoutes from "./routes/ventaRoutes.js";
import pagosRoutes from "./routes/pagos.js";

dotenv.config();
const app = express();

// Middlewares
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));
app.use("/uploads", express.static("uploads"));

// Conexión a MongoDB Atlas
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Conectado a MongoDB Atlas"))
  .catch((err) => console.error("Error de conexión:", err));

// Rutas
app.use("/api/usuarios", usuarioRoutes);
app.use("/api/compras", compraRoutes);
app.use("/api/inventario", inventarioRoutes);
app.use("/api/materias-primas", materiaPrimaRoutes);
app.use("/api/productos", productoRoutes);
app.use("/api/produccion", produccionRoutes);
app.use("/api/proveedores", proveedorRoutes);
app.use("/api/recetas", recetaRoutes);
app.use("/api/sucursales", sucursalRoutes);
app.use("/api/alertas", alertaRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/ventas", ventaRoutes);
app.use("/api/pagos", pagosRoutes);

// Inicio del servidor
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Servidor en ejecución en puerto ${PORT}`));
