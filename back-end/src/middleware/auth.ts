import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    name: string;
  };
}

export const authenticateToken = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    res.status(401).json({ message: "Token de acesso requerido" });
    return;
  }

  jwt.verify(
    token,
    process.env.JWT_SECRET || "sexta-feira-secret",
    (err: any, decoded: any) => {
      if (err) {
        res.status(403).json({ message: "Token inválido" });
        return;
      }
      // Adapta o payload para o formato esperado pela interface
      req.user = {
        id: decoded.id || decoded.userId,
        email: decoded.email,
        name: decoded.name, // pode ser undefined
      };
      next();
    }
  );
};