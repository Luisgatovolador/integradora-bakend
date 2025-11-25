import Venta from "../models/Venta.js";
import Inventario from "../models/Inventario.js";

export const registrarVenta = async (req, res) => {
  try {
    const { productos, total, cliente, empleado, metodoPago } = req.body;

    for (const item of productos) {
      const producto = await Inventario.findById(item.producto);
      if (!producto) return res.status(404).json({ mensaje: `Producto no encontrado: ${item.nombre}` });
      if (producto.stock < item.cantidad) return res.status(400).json({ mensaje: `Stock insuficiente para ${item.nombre}` });
      producto.stock -= item.cantidad;
      await producto.save();
    }

    const nuevaVenta = new Venta({ productos, total, cliente, empleado, metodoPago });
    await nuevaVenta.save();
    res.status(201).json({ mensaje: "Venta registrada correctamente", nuevaVenta });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al registrar venta", error });
  }
};

export const obtenerVentas = async (req, res) => {
  try {
    const ventas = await Venta.find().populate("productos.producto cliente empleado");
    res.status(200).json(ventas);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener ventas", error });
  }
};

export const obtenerVentaPorId = async (req, res) => {
  try {
    const venta = await Venta.findById(req.params.id).populate("productos.producto cliente empleado");
    if (!venta) return res.status(404).json({ mensaje: "Venta no encontrada" });
    res.status(200).json(venta);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener venta", error });
  }
};

export const eliminarVenta = async (req, res) => {
  try {
    const ventaEliminada = await Venta.findByIdAndDelete(req.params.id);
    if (!ventaEliminada) return res.status(404).json({ mensaje: "Venta no encontrada" });
    res.status(200).json({ mensaje: "Venta eliminada correctamente" });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al eliminar venta", error });
  }
};

export const getVentasHoy = async (req, res) => {
  try {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    
    const ventasHoy = await Venta.find({
      fecha: { $gte: hoy }
    });
    
    const total = ventasHoy.reduce((sum, venta) => sum + venta.total, 0);
    res.json({ total, cantidad: ventasHoy.length });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTopCategorias = async (req, res) => {
  try {
    // Esta es una implementación básica - puedes mejorarla según tus necesidades
    const ventas = await Venta.find().populate('productos.producto');
    
    // Simulación de categorías
    const categorias = [
      { categoria: 'Panadería', ventas: 45 },
      { categoria: 'Pastelería', ventas: 32 },
      { categoria: 'Bebidas', ventas: 28 }
    ];
    
    res.json(categorias);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getVentasMensuales = async (req, res) => {
  try {
    const ventas = await Venta.find();
    const totalMensual = ventas.reduce((sum, venta) => sum + venta.total, 0);
    res.json({ total: totalMensual });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const obtenerVentasPorCliente = async (req, res) => {
  try {
    const { clienteId } = req.params;
    console.log("📦 Buscando ventas para cliente:", clienteId);
    
    const ventas = await Venta.find({ cliente: clienteId })
      .populate("productos.producto")
      .populate("cliente")
      .populate("empleado")
      .sort({ fecha: -1 });
    
    console.log("✅ Ventas encontradas:", ventas.length);
    res.status(200).json(ventas);
  } catch (error) {
    console.error("❌ Error al obtener ventas del cliente:", error);
    res.status(500).json({ 
      mensaje: "Error al obtener ventas del cliente", 
      error: error.message 
    });
  }
};

