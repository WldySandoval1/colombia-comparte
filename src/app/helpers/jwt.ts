// Importa el paquete jsonwebtoken y su tipo JwtPayload para trabajar con JWT
import jwt, { JwtPayload } from "jsonwebtoken";
// Importa la configuración global, donde está la clave secreta JWT
import { CONFIG } from "../../config";

// Define una interfaz para extender el JwtPayload y asegurar que el payload personalizado contiene una propiedad id de tipo string
interface CustomJwtPayload extends JwtPayload {
  id: string;
  rol: string;
  pais: string | null;
}

// Función asíncrona para generar un token JWT tomando como argumento el id del usuario
export async function generateToken(user: {
  id: string;
  rol: string;
  pais_asignado: string | null;
}): Promise<string> {
  try {
    const payload: CustomJwtPayload = {
      id: user.id,
      rol: user.rol,
      pais: user.pais_asignado || null,
    };

    const token = jwt.sign(payload, CONFIG.jwt_key, { expiresIn: "48h" });

    return token;
  } catch (error) {
    console.error("No se pudo generar el JWT", error);
    throw new Error("Error generando token");
  }
}

// Función que verifica y decodifica un JWT, retornando un booleano e id de usuario, o un error si la verificación falla
export function checkToken(token: string): [boolean, CustomJwtPayload | Error] {
  try {
    // Decodifica (y valida) el token usando la clave secreta, asegurando el tipo del payload
    const decoded = jwt.verify(token, CONFIG.jwt_key) as CustomJwtPayload;
    // Si la decodificación fue exitosa y contiene un 'id', retorna true y el 'id'
    if (decoded && decoded.id) {
      return [true, decoded];
    }
    // Si el token es válido pero no contiene un 'id', retorna false y un error personalizado
    return [false, new Error("Token does not contain id")];
  } catch (error) {
    // Si ocurre un error (token inválido, expirado, etc.), retorna false y el error capturado
    return [false, error as Error];
  }
}
