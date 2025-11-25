import express from "express";
import {
  registrarVenta,
  obtenerVentas,
  obtenerVentaPorId,
  eliminarVenta, 
  getVentasHoy, 
  getTopCategorias, 
  getVentasMensuales,
  obtenerVentasPorCliente // 👈 NUEVO - agregar esta importación
} from "../controllers/ventaController.js";

const router = express.Router();

router.post("/", registrarVenta);
router.get("/", obtenerVentas);
router.get("/cliente/:clienteId", obtenerVentasPorCliente); // 👈 NUEVA RUTA
router.get("/:id", obtenerVentaPorId);
router.delete("/:id", eliminarVenta);
router.get('/estadisticas/hoy', getVentasHoy);
router.get('/estadisticas/categorias', getTopCategorias);
router.get('/estadisticas/mensual', getVentasMensuales);

export default router;
