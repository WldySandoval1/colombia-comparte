import { Request, Response, NextFunction } from 'express';
import { checkToken } from '../app/helpers/jwt';

// Extiende el tipo Request para que TypeScript sepa que req.user existe
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        rol: 'superadmin' | 'admin_pais' | 'editor';
        pais: string | null;
      };
    }
  }
}

// ── Middleware 1: verifica que el token sea válido ──────────────────────────
export function verifyToken(req: Request, res: Response, next: NextFunction) {
  // Lee el header Authorization: Bearer <token>
  const authHeader = req.headers['authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ ok: false, error_message: 'Token no proporcionado' });
  }

  const token = authHeader.split(' ')[1]; // extrae solo el token
  const [valid, decoded] = checkToken(token);

  if (!valid || decoded instanceof Error) {
    return res.status(401).json({ ok: false, error_message: 'Token inválido o expirado' });
  }

  // Adjunta los datos del usuario al request para usarlos en los controladores
  req.user = {
    id: decoded.id,
    rol: decoded.rol as 'superadmin' | 'admin_pais' | 'editor',
    pais: decoded.pais,
  };

  next(); // token válido → continúa al controlador
}

// ── Middleware 2: restringe acceso por rol ──────────────────────────────────
// Uso: router.get('/paises', verifyToken, requireRole('superadmin'), controller)
export function requireRole(...roles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.rol)) {
      return res.status(403).json({ ok: false, error_message: 'Acceso denegado: rol insuficiente' });
    }
    next();
  };
}