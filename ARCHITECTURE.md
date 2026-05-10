# Arquitectura del proyecto

## Visión general

Este documento describe las decisiones arquitectónicas del proyecto, el flujo de datos entre capas y las convenciones internas adoptadas.

---

## Patrón arquitectónico: MVC + Service + Repository

Se eligió este patrón como punto de equilibrio entre organización y simplicidad. Cada capa tiene una responsabilidad única y bien definida.

### Responsabilidades por capa

| Capa | Archivo(s) | Responsabilidad |
|---|---|---|
| **Router** | `routes/v1/*.js` | Define rutas, aplica middlewares de validación y delega al controlador |
| **Controller** | `controllers/*.js` | Recibe la request, llama al Service y construye la respuesta HTTP |
| **Service** | `services/*.js` | Contiene la lógica de negocio; no conoce Express ni SQL |
| **Repository** | `repositories/*.js` | Ejecuta sentencias SQL; es la única capa que conoce la base de datos |
| **Model** | `models/*.js` | Define y mapea la estructura de las tablas |

### Flujo de una request

```
Cliente
  │
  ▼
Express Router
  └── Middleware: validateRequest (construye error si hay fallos)
  │
  ▼
Controller
  ├── Construye DTO de entrada
  ├── Llama a Service
  └── Construye APIResponse y envía la respuesta
  │
  ▼
Service
  ├── Aplica reglas de negocio
  ├── Llama a Repository (o a otro Service si aplica)
  └── Retorna datos o lanza APIError
  │
  ▼
Repository
  ├── Ejecuta sentencia SQL
  └── Retorna datos mapeados o lanza error de base de datos
  │
  ▼
PostgreSQL
```

---

## Autenticación y sesiones

Se utiliza una estrategia de doble token:

- **Access Token** (vida corta, ej: 15 min): incluido en cada request autenticada.
- **Refresh Token** (vida larga, ej: 7 días): almacenado en la base de datos como lista por usuario. Permite renovar el access token sin requerir login.

### Flujo de autenticación

```
Login exitoso
  └── Se generan accessToken + refreshToken
  └── refreshToken se agrega a la lista del usuario (manageRefreshToken)

Request autenticada
  └── Se valida el accessToken en el header Authorization

Refresh de token
  └── Se valida que el refreshToken exista en la lista del usuario
  └── Se genera un nuevo accessToken

Logout
  └── Se elimina el refreshToken de la lista del usuario
```

---

## Manejo de errores

Todas las respuestas de error siguen la misma estructura gracias a la jerarquía de clases en `utils/errors.js`:

```
Error (nativo JS)
  └── APIError
        ├── BadRequestError        (400)
        ├── UnauthorizedError      (401)
        ├── ForbiddenError         (403)
        ├── NotFoundError          (404)
        ├── ValidationError        (422)
        ├── TimeoutError           (408)
        ├── InternalError          (500)
        └── ServiceUnavailableError (503)
```

El middleware `errorHandler.js` captura cualquier excepción no manejada, y si esta extiende `APIError`, enriquece la respuesta con la URL de la request utilizando `getFullUrl.js`.

---

## Validaciones

La validación opera en dos etapas independientes antes de llegar al controlador:

### 1. Validación estructural (Middlewares de request)
Archivos `[entidad]Request.js` definen reglas con `express-validator`. Estas reglas se aplican como middleware en el router antes de que la request llegue al controlador.

### 2. Ejecución y respuesta de errores
`validateRequest.js` ejecuta las validaciones acumuladas por `express-validator`. Si hay errores, construye y envía la respuesta de error inmediatamente, cortocircuitando el flujo sin llegar al controlador.

---

## DTOs

Los DTOs actúan como contratos explícitos entre capas:

| DTO | Dirección | Propósito |
|---|---|---|
| `userCreateDTO` | Cliente → Service | Garantiza que solo lleguen los campos esperados para creación |
| `userUpdateDTO` | Cliente → Service | Permite campos opcionales para actualización parcial |
| `userResponseDTO` | Service → Cliente | Controla qué datos se exponen en la respuesta (excluye contraseña, etc.) |

---

## Versionado de API

Las rutas están bajo el prefijo `/api/v1`. El archivo `v1Router.js` actúa como punto de entrada de la versión 1, componiendo los routers de cada dominio:

```
/api
  └── /v1                  ← v1Router.js
        ├── /auth          ← authRoutes.js
        └── /users         ← userRoutes.js
```

Agregar una versión futura implica crear un `v2Router.js` y registrarlo en `index.js` bajo `/api/v2`, sin tocar los endpoints existentes.

---

## Estructura de respuestas

Todas las respuestas del sistema extienden de `APIResponse` (`utils/apiResponse.js`):

```
APIResponse
  ├── SuccessResponse       (200)
  ├── CreatedResponse       (201)
  └── NoContentResponse     (204)
```

Esto garantiza un contrato de respuesta uniforme en toda la API, facilitando el consumo desde cualquier cliente.
