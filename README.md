# REST API — Node.js + Express + PostgreSQL

> API RESTful con autenticación JWT, arquitectura en capas (MVC + Service + Repository), documentación Swagger y pruebas con Jest.

---

## Tabla de contenidos

- [Descripción general](#descripción-general)
- [Stack tecnológico](#stack-tecnológico)
- [Arquitectura](#arquitectura)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Requisitos previos](#requisitos-previos)
- [Instalación y configuración](#instalación-y-configuración)
- [Variables de entorno](#variables-de-entorno)
- [Ejecución](#ejecución)
- [Documentación de la API](#documentación-de-la-api)
- [Pruebas](#pruebas)
- [Decisiones de diseño](#decisiones-de-diseño)
- [Convenciones](#convenciones)

---

## Descripción general

Esta API REST expone endpoints para la gestión de usuarios y autenticación. Está desarrollada con **Node.js** y **Express**, utiliza **PostgreSQL** como base de datos relacional y **JWT** para el control de sesiones mediante tokens de acceso y refresco.

El proyecto aplica el patrón **MVC extendido** con capas de Service y Repository, separando claramente las responsabilidades entre controladores, lógica de negocio y acceso a datos.

---

## Stack tecnológico

| Capa | Tecnología |
|---|---|
| Runtime | Node.js |
| Framework HTTP | Express |
| Base de datos | PostgreSQL |
| Autenticación | JSON Web Tokens (JWT) |
| Validación | express-validator |
| Documentación | Swagger (swagger-jsdoc + swagger-ui-express) |
| Pruebas | Jest |

---

## Arquitectura

El proyecto implementa el patrón **MVC + Service + Repository**:

```
Request
   │
   ▼
Router          → Define rutas y aplica middlewares
   │
   ▼
Controller      → Recibe la request, construye la response
   │
   ▼
Service         → Contiene la lógica de negocio
   │
   ▼
Repository      → Ejecuta las sentencias SQL
   │
   ▼
PostgreSQL
```

### ¿Por qué MVC + Service + Repository y no Clean/Hexagonal Architecture?

Esta decisión fue tomada deliberadamente para evitar sobreingeniería dado el alcance del proyecto y el tamaño del equipo. MVC extendido ofrece una separación de responsabilidades clara, es ampliamente conocido y resulta más accesible para equipos pequeños sin perder mantenibilidad.

---

## Estructura del proyecto

```
app/src/
├── config.js                  # Exporta constantes desde variables de entorno
├── index.js                   # Punto de entrada: configura Express, middlewares y rutas
├── app.js                     # Copia de index.js utilizada en pruebas
│
├── config/
│   └── database.js            # Gestiona la conexión a PostgreSQL
│
├── controllers/
│   ├── authController.js      # Maneja autenticación: register, login, logout, refreshToken
│   └── userController.js      # Maneja CRUD de usuarios: getAll, getById, create, update, delete
│
├── dtos/
│   ├── userCreateDTO.js       # Forma el objeto de entrada para creación (name, username, email, password)
│   ├── userUpdateDTO.js       # Forma el objeto de entrada para actualización (campos opcionales)
│   └── userResponseDTO.js     # Forma el objeto de salida antes de responder al cliente
│
├── lib/
│   ├── databaseMapping.js        # Utilidad: convierte arreglos a sintaxis PostgreSQL
│   ├── getFullUrl.js             # Construye la URL completa de la request (usado en errores)
│   ├── generateToken.js          # Genera tokens de acceso y refresco
│   ├── manageRefreshToken.js     # Agrega o elimina refresh tokens de la lista de un usuario
│   └── validateJWTToken.js       # Valida que un JWT sea valido
│   ├── validateNotEmptyBody.js   # Valida que el body de la request no esté vacío
│   └── validateRequest.js        # Ejecuta las validaciones de express-validator y construye la respuesta de error
│
├── middlewares/
│   └── errorHandler.js        # Captura excepciones y enriquece las respuestas de error con la URL de la request
│
├── models/
│   └── userModel.js           # Define y mapea la estructura de la tabla `users`
│
├── repositories/
│   └── userRepository.js      # Ejecuta sentencias SQL: CRUD y búsquedas
│
├── requests/
│   ├── auth/
│   │   ├── loginRequest.js    # Reglas de validación para login (username, password, headers)
│   │   ├── logoutRequest.js    # Reglas de validación para login (cookie)
│   │   ├── refreshRequest.js # Reglas de validación para registro (cookie)
│   │   └── registerRequest.js # Reglas de validación para registro (header, name, username, email, password)
│   ├── me/
│   │   └── registerRequest.js # Reglas de validación para actualizacion de perfil (header, name, username, email, password)
│   └── user/
│       ├── getUserRequest.js  # Reglas de validación para la obtencion de un usuario (param request)
│       ├── createUserRequest.js  # Reglas de validación para creación de usuario
│       └── updateUserRequest.js  # Reglas de validación para actualización de usuario
│
├── routes/
│   └── v1/
│       ├── authRoutes.js      # Rutas bajo /auth: /login, /logout, /register, /refresh
│       ├── userRoutes.js      # Rutas bajo /user: GET, POST, PATCH
│       └── v1Router.js        # Router principal con prefijo /v1 (versionado de API)
│
├── services/
│   ├── authService.js         # Lógica de negocio de autenticación: creación/eliminación de tokens
│   └── userService.js         # Lógica de negocio de operaciones CRUD de usuarios
│
├── swagger/
│   ├── config.js              # Configuración de Swagger
│   └── definitions.js         # Schemas de Swagger
│
├── test/
│   ├── auth/
│   │   └── auth.test.js       # Pruebas de endpoints /api/v1/auth (login, register, logout, refresh)
│   └── users/
│       └── users.test.js      # Pruebas de endpoints /api/v1/users (GET, POST, PATCH)
│
└── utils/
    ├── apiResponse.js         # Clase APIResponse y subclases: SuccessResponse, CreatedResponse, NoContentResponse
    ├── errors.js              # Clase APIError y subclases: BadRequestError, UnauthorizedError, NotFoundError, etc.
    └── format/
        └── maskEmail.js       # Enmascara el email del usuario en las respuestas al cliente
```

---

## Requisitos previos

- Node.js >= 18.x
- PostgreSQL >= 14.x
- npm >= 9.x

---

## Instalación y configuración

```bash
# 1. Clonar el repositorio
git clone <url-del-repositorio>
cd <nombre-del-proyecto>

# 2. Instalar dependencias
npm install

# 3. Configurar las variables de entorno
cp .env.example .env
# Editar .env con los valores correspondientes

# 4. Crear la base de datos en PostgreSQL
# (ejecutar los scripts de migración si los hay)
```

---

## Variables de entorno

Crear un archivo `.env` en la raíz del proyecto con las siguientes variables:

```env
# Servidor
PORT=3000

# Base de datos
DB_HOST=localhost
DB_PORT=5432
DB_NAME=nombre_base_de_datos
DB_USER=usuario
DB_PASSWORD=contraseña

SERVER_URL="http://localhost:3000"

# JWT
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
SECRET_JWT_KEY=tu_secreto_de_acceso
SECRET_JWT_REFRESH_KEY=tu_secreto_de_refresco

ENCRYPT_SALT=tu_salt
```

> **Nunca commitear el archivo `.env` al repositorio.** Asegurarse de que esté incluido en `.gitignore`.

---

## Ejecución

```bash
# Modo desarrollo (con hot reload)
npm run dev

# Modo producción
npm start
```

La API estará disponible en: `http://localhost:{PORT}/api/v1`

---

## Documentación de la API

La documentación interactiva generada por Swagger está disponible en:

```
http://localhost:{PORT}/api-docs
```

### Endpoints principales

#### Autenticación — `/api/v1/auth`

| Método | Ruta | Descripción | Autenticación |
|---|---|---|---|
| POST | `/auth/register` | Registra un nuevo usuario | No |
| POST | `/auth/login` | Inicia sesión y retorna tokens | No |
| POST | `/auth/logout` | Cierra sesión e invalida el refresh token | Sí |
| POST | `/auth/refresh` | Genera un nuevo access token | Refresh token |

#### Usuarios — `/api/v1/users`

| Método | Ruta | Descripción | Autenticación |
|---|---|---|---|
| GET | `/users` | Lista todos los usuarios | Sí |
| GET | `/users/:id` | Obtiene un usuario por ID | Sí |
| POST | `/users` | Crea un nuevo usuario | Sí |
| PATCH | `/users/:id` | Actualiza parcialmente un usuario | Sí |
| DELETE | `/users/:id` | Elimina un usuario | Sí |

### Formato de respuesta

Todas las respuestas siguen una estructura consistente basada en `APIResponse`:

```json
// Respuesta exitosa
{
  "success": true,
  "statusCode": 200,
  "data": { ... }
}

// Respuesta de error
{
  "status": "error",
  "errors": [
      {
         "status" : "VALIDATION_ERROR",
         "code" : 422,
         "title": "Invalid request",
         "detail": "Username is required",
         "source": {
            "pointer": "body.username"
         },
         "links": {
            "about": "http://localhost:3000/api/v1/..."
         }
      }
  ],
}
```

---

## Pruebas

Las pruebas de integración cubren todos los endpoints de autenticación y usuarios.

```bash
# Ejecutar todas las pruebas
npm test

# Ejecutar pruebas con cobertura
npm run test:coverage

# Ejecutar un archivo específico
npm test -- auth.test.js
```

El archivo `app.js` es utilizado como punto de entrada en el entorno de pruebas en lugar de `index.js`, evitando levantar el servidor en un puerto real durante los tests.

---

## Decisiones de diseño

### DTOs (Data Transfer Objects)
Se utilizan DTOs en la capa de entrada (`userCreateDTO`, `userUpdateDTO`) y en la capa de salida (`userResponseDTO`) para garantizar que los datos que fluyen entre capas tengan la forma exacta esperada, evitando exposición accidental de campos sensibles.

### Validación en dos niveles
1. **Middlewares de request** (`[algo]Request.js`): validan la request incluye headers, cookies el formato y tipo de los datos usando `express-validator` antes de llegar al controlador.

### Manejo centralizado de errores
El middleware `errorHandler.js` captura todas las excepciones no manejadas. Las clases que extienden `APIError` incluyen automáticamente la URL de la request en la respuesta, facilitando el debugging desde el cliente.

### Versionado de API
Las rutas están bajo el prefijo `/api/v1`, gestionadas por `v1Router.js`. Esto permite introducir versiones futuras (`/api/v2`) sin romper la compatibilidad con clientes existentes.

### Enmascaramiento de datos sensibles
El email de los usuarios se enmascara (`maskEmail.js`) antes de incluirse en la respuesta al cliente, protegiendo información personal sin eliminarla del sistema.

---

## Convenciones

- **Nomenclatura de archivos**: `camelCase` para todos los archivos fuente.
- **Ramas**: `main` para producción, `develop` para integración, `feature/nombre` para nuevas funcionalidades.
- **Commits**: se recomienda seguir [Conventional Commits](https://www.conventionalcommits.org/es/v1.0.0/).
- **Variables de entorno**: definidas en `config.js`, nunca importadas directamente desde `process.env` en otros módulos.
