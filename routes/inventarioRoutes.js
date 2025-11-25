import express from "express";
import {
  obtenerInventario,
  agregarProducto,
  actualizarProducto,
  eliminarProducto,
  buscarProducto,
} from "../controllers/inventarioController.js";
import { verifyToken } from "../middlewares/verifyToken.js";
import { getProductos } from "../controllers/productoController.js";


const router = express.Router();

router.get("/", verifyToken,obtenerInventario);
router.post("/", verifyToken,agregarProducto);
router.put("/:id", actualizarProducto);
router.delete("/:id",verifyToken, eliminarProducto);
router.get("/buscar",verifyToken, buscarProducto);

router.get("/productos", verifyToken, getProductos);
router.get("/productos/buscar", verifyToken, buscarProducto);

export default router;
