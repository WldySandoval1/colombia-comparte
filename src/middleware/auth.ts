import { Request, Response, NextFunction } from "express";
import { checkToken } from "../app/helpers/jwt";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        rol: "superadmin" | "admin_pais" | "editor";
        pais: string | null;
      };
    }
  }
}

// Verifica que el token sea válido
export function verifyToken(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const authHeader = req.headers["authorization"];

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({
      ok: false,
      error_message: "Token no proporcionado",
    });
    return;
  }

  const token = authHeader.split(" ")[1];
  const [valid, decoded] = checkToken(token);

  if (!valid || decoded instanceof Error) {
    res.status(401).json({
      ok: false,
      error_message: "Token inválido o expirado",
    });
    return;
  }

  req.user = {
    id: decoded.id,
    rol: decoded.rol as "superadmin" | "admin_pais" | "editor",
    pais: decoded.pais,
  };

  next();
}

// Restringe acceso por rol
type UserRole = "superadmin" | "admin_pais" | "editor";
export function requireRole(...roles: UserRole[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user || !roles.includes(req.user.rol)) {
      res.status(403).json({
        ok: false,
        error_message: "Acceso denegado: rol insuficiente",
      });
      return;
    }

    next();
  };
}
