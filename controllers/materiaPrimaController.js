import MateriaPrima from "../models/MateriaPrima.js";

export const getMateriasPrimas = async (req, res) => {
  try {
    console.log("🟢 GET /api/materias-primas ejecutándose...");
    
    const materias = await MateriaPrima.find()
      .populate("proveedores");
      // .populate("comparativaProveedores.proveedor"); // ← ESTA LÍNEA CAUSA EL ERROR
    
    console.log("✅ Materias primas encontradas:", materias.length);
    res.json(materias);
  } catch (error) {
    console.error("❌ Error en getMateriasPrimas:", error);
    res.status(500).json({ message: error.message });
  }
};

export const getMateriaPrimaById = async (req, res) => {
  try {
    const materia = await MateriaPrima.findById(req.params.id)
      .populate("proveedores");
      // .populate("comparativaProveedores.proveedor"); // ← ESTA TAMBIÉN
    
    if (!materia) return res.status(404).json({ message: "Materia prima no encontrada" });
    res.json(materia);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createMateriaPrima = async (req, res) => {
  try {
    const nueva = new MateriaPrima(req.body);
    await nueva.save();
    res.status(201).json(nueva);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateMateriaPrima = async (req, res) => {
  try {
    const actualizada = await MateriaPrima.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(actualizada);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteMateriaPrima = async (req, res) => {
  try {
    await MateriaPrima.findByIdAndDelete(req.params.id);
    res.json({ message: "Materia prima eliminada" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
