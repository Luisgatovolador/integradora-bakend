import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No autorizado: token faltante" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("🔐 Token decodificado:", decoded);
    req.user = decoded;
    next();
  } catch (error) {
    console.error("❌ Error verificando token:", error);
    res.status(403).json({ message: "Token inválido o expirado" });
  }
};
