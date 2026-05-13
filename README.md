# backend

necesitan configurar el config.ts en local dentro de la carpeta src, con la siguiente estructura:

export const CONFIG = {
db: process.env.DB_CONNECTION || 'direccion de su base de datos',
db_test: process.env.DB_CONNECTION_TEST || 'direccion de la base de datos test',
app: {
// Puerto en el que escucha el servidor HTTP
port: process.env.PORT || 3000
},
jwt_key: process.env.JWT_KEY || 'secreto de su firmador de tokens',
}

# README - Backend Colombia Comparte

## Requisitos

Antes de ejecutar el proyecto, asegúrese de tener instalado:

- Node.js (versión 18 o superior recomendada)
- npm
- MongoDB local o una conexión a MongoDB Atlas

## Instalación

Clone el repositorio y entre a la carpeta del backend:

```bash
cd backend
```

Instale las dependencias:

```bash
npm install
```

## Configuración de variables de entorno

Cree un archivo `config.ts` en la raíz del proyecto con la siguiente estructura:

```config.ts
PORT=3000
MONGO_URI=su_cadena_de_conexion_mongodb
JWT_KEY=su_clave_secreta_jwt
```

## Ejecutar el proyecto

Modo desarrollo:

```bash
npm run dev
```

Si todo funciona correctamente, deberá aparecer:

```bash
server started
API listen on 3000
connected to the database
```

---

# Pruebas en Postman

## 1. Crear usuarios por rol

### Superadmin

**POST** `http://localhost:3000/api/v1/user/create`

```json
{
  "name": "Super Admin",
  "email": "superadmin@test.com",
  "phone": "3001111111",
  "password": "123456",
  "rol": "superadmin"
}
```

### Admin país

**POST** `http://localhost:3000/api/v1/user/create`

```json
{
  "name": "Admin Chile",
  "email": "admin@test.com",
  "phone": "3002222222",
  "password": "123456",
  "rol": "admin_pais",
  "pais_asignado": "Chile"
}
```

### Editor

**POST** `http://localhost:3000/api/v1/user/create`

```json
{
  "name": "Editor Chile",
  "email": "editor@test.com",
  "phone": "3003333333",
  "password": "123456",
  "rol": "editor",
  "pais_asignado": "Chile"
}
```

---

## 2. Iniciar sesión

**POST** `http://localhost:3000/api/v1/user`

Ejemplo:

```json
{
  "email": "admin@test.com",
  "password": "123456"
}
```

La respuesta devolverá un `token` JWT.

---

## 3. Probar rutas protegidas

En Postman, agregar en headers:

```text
Authorization: Bearer TOKEN_AQUI
```

---

## 4. Probar dashboard por roles

**GET** `http://localhost:3000/api/v1/dashboard`

### Superadmin

Debe visualizar métricas globales de todos los países:

- Solicitudes pendientes por país
- Testimonios publicados por país
- Noticias activas por país

### Admin país

Debe visualizar únicamente métricas del país asignado.

### Editor

Debe visualizar únicamente métricas del país asignado.

---

## Notas

Los países permitidos actualmente son:

- Chile
- Colombia
- Ecuador

El sistema utiliza MongoDB y Mongoose para la persistencia de datos.
