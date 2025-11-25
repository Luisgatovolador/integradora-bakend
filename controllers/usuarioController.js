import Usuario from "../models/Usuario.js";
import bcrypt from "bcryptjs";

// 🔹 Obtener todos los usuarios
// 🔹 Obtener todos los usuarios
export const getUsuarios = async (req, res) => {
  try {
    console.log("🟢 GET /api/usuarios ejecutándose...");
    console.log("🔑 Usuario autenticado:", req.user);
    
    const usuarios = await Usuario.find().populate("sucursal");
    
    console.log("📊 Usuarios encontrados en BD:", usuarios.length);
    console.log("👥 Lista de usuarios:", usuarios.map(u => ({ id: u._id, nombre: u.nombre, email: u.email })));
    
    res.json(usuarios);
  } catch (error) {
    console.error("❌ Error en getUsuarios:", error);
    res.status(500).json({ message: error.message });
  }
};

// 🔹 Obtener usuario por ID
export const getUsuarioById = async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.params.id).populate("sucursal");
    if (!usuario)
      return res.status(404).json({ message: "Usuario no encontrado" });
    res.json(usuario);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔹 Crear usuario (encripta contraseña automáticamente)
export const createUsuario = async (req, res) => {
  try {
    const { nombre, email, password, rol, sucursal } = req.body;

    // Verificar si ya existe el correo
    const usuarioExistente = await Usuario.findOne({ email });
    if (usuarioExistente) {
      return res
        .status(400)
        .json({ message: "El correo ya está registrado" });
    }

    // Encriptar contraseña
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Crear nuevo usuario
    const nuevoUsuario = new Usuario({
      nombre,
      email,
      password: passwordHash,
      rol: rol || "cliente",
      sucursal: sucursal || null,
      activo: true,
    });

    await nuevoUsuario.save();

    res.status(201).json({
      success: true,
      message: "Usuario creado exitosamente",
      usuario: {
        id: nuevoUsuario._id,
        nombre: nuevoUsuario.nombre,
        email: nuevoUsuario.email,
        rol: nuevoUsuario.rol,
      },
    });
  } catch (error) {
    console.error("❌ Error al crear usuario:", error);
    res.status(400).json({ message: error.message });
  }
};

// 🔹 Actualizar usuario
export const updateUsuario = async (req, res) => {
  try {
    const { password } = req.body;
    let updateData = { ...req.body };

    // Si se envía una nueva contraseña, encriptarla antes de actualizar
    if (password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(password, salt);
    }

    const actualizado = await Usuario.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    res.json(actualizado);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// 🔹 Eliminar usuario
export const deleteUsuario = async (req, res) => {
  try {
    await Usuario.findByIdAndDelete(req.params.id);
    res.json({ message: "Usuario eliminado" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
