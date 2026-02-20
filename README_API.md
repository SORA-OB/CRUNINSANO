# API CRUD Registros - Documentación para Frontend

Documentación completa de la API REST para gestión de registros. Esta guía es para el equipo de desarrollo frontend.

## 🚀 Tabla de Contenidos

- [Información General](#información-general)
- [Instalación y Ejecución](#instalación-y-ejecución)
- [Seguridad](#seguridad)
- [Endpoints](#endpoints)
- [Ejemplos de Uso](#ejemplos-de-uso)
- [Manejo de Errores](#manejo-de-errores)
- [Rate Limiting](#rate-limiting)

---

## 📋 Información General

**Base URL:** `http://localhost:3001` (desarrollo) o tu URL de producción

**API Prefix:** `/registros`

**Documentación Interactiva:** `http://localhost:3001/api` (Swagger)

### Características
- ✅ CRUD completo (Create, Read, Update, Delete)
- ✅ Paginación automática
- ✅ Validación de datos
- ✅ Rate limiting contra ataques DoS
- ✅ Headers de seguridad HTTP
- ✅ Protección contra XSS y caracteres maliciosos

---

## 🔧 Instalación y Ejecución

### Requisitos
- Node.js 16+
- npm o yarn
- PostgreSQL 12+ (para la base de datos)

### Pasos de instalación

```bash
# 1. Clonar el repositorio
git clone <url-del-repo>
cd crudinsano

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env
# Editar .env con tus configuraciones

# 4. Ejecutar migraciones de base de datos
npx prisma migrate deploy

# 5. Iniciar el servidor en desarrollo
npm run start:dev
```

El servidor estará disponible en `http://localhost:3001`

---

## 🔒 Seguridad

### Validación de Datos

Todos los campos son validados automáticamente:

- **Campo `registro`:**
  - Mínimo: 3 caracteres
  - Máximo: 500 caracteres
  - Solo permite caracteres alfanuméricos, espacios y puntuación básica
  - Rechaza caracteres de control y secuencias potencialmente maliciosas

### Rate Limiting

Se aplica limitación de peticiones por IP:

| Límite | Tiempo | Descripción |
|--------|--------|-------------|
| **3 peticiones** | 1 segundo | Protección contra ataques muy veloz |
| **50 peticiones** | 1 minuto | Límite razonable por minuto |

Si excedes estos límites, recibirás un error `429 Too Many Requests`.

### Headers de Seguridad

La API incluye headers de seguridad estándar:
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `Content-Security-Policy: default-src 'self'`
- Cache-Control: no-store

### CORS

La API acepta peticiones desde:
- Desarrollo: `http://localhost:3000` (configurar en `.env`)
- Producción: `https://my-repository-seven-hazel.vercel.app` (por defecto)

---

## 📡 Endpoints

### 1. Obtener todos los registros (con paginación)

```
GET /registros?page=1&limit=20
```

#### Parámetros de Query

| Parámetro | Tipo | Default | Descripción |
|-----------|------|---------|-------------|
| `page` | number | 1 | Número de página |
| `limit` | number | 20 | Registros por página (máx. 100) |

#### Respuesta exitosa (200)

```json
{
  "data": [
    {
      "id": 1,
      "registro": "Mi primer registro"
    },
    {
      "id": 2,
      "registro": "Segundo registro"
    }
  ],
  "pagination": {
    "total": 50,
    "page": 1,
    "limit": 20,
    "pages": 3
  }
}
```

---

### 2. Obtener un registro por ID

```
GET /registros/:id
```

#### Parámetros

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `id` | number | ID del registro |

#### Respuesta exitosa (200)

```json
{
  "id": 1,
  "registro": "Mi primer registro"
}
```

#### Respuesta error (404)

```json
{
  "message": "Registro con ID 999 no encontrado",
  "statusCode": 404
}
```

---

### 3. Crear un nuevo registro

```
POST /registros
Content-Type: application/json
```

#### Body

```json
{
  "registro": "Contenido del nuevo registro"
}
```

#### Validación de entrada

- El campo es **obligatorio**
- Mínimo 3 caracteres
- Máximo 500 caracteres
- No puede contener caracteres peligrosos

#### Respuesta exitosa (201)

```json
{
  "id": 3,
  "registro": "Contenido del nuevo registro"
}
```

#### Respuesta error (400)

```json
{
  "message": [
    "El campo no puede estar vacío",
    "El campo debe tener al menos 3 caracteres",
    "El campo contiene caracteres no permitidos"
  ],
  "statusCode": 400
}
```

---

### 4. Actualizar un registro

```
PATCH /registros/:id
Content-Type: application/json
```

#### Parámetros

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `id` | number | ID del registro a actualizar |

#### Body

```json
{
  "registro": "Contenido actualizado"
}
```

#### Respuesta exitosa (200)

```json
{
  "id": 1,
  "registro": "Contenido actualizado"
}
```

#### Respuesta error (404)

```json
{
  "message": "Registro con ID 999 no encontrado",
  "statusCode": 404
}
```

---

### 5. Eliminar un registro

```
DELETE /registros/:id
```

#### Parámetros

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `id` | number | ID del registro a eliminar |

#### Respuesta exitosa (200)

```json
{
  "id": 1,
  "registro": "Contenido del registro"
}
```

#### Respuesta error (404)

```json
{
  "message": "Registro con ID 999 no encontrado",
  "statusCode": 404
}
```

---

### 6. Eliminar todos los registros

```
DELETE /registros?token=CONFIRMAR_BORRAR_TODO
```

#### Parámetros de Query

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `token` | string | Token de confirmación (requerido) |

⚠️ **IMPORTANTE:** Este endpoint requiere un token de confirmación para evitar borrados accidentales.

El token por defecto es: `CONFIRMAR_BORRAR_TODO`

(Puede ser configurado en la variable de entorno `DELETE_ALL_TOKEN`)

#### Respuesta exitosa (200)

```json
{
  "message": "Se han eliminado 5 registros.",
  "deletedCount": 5
}
```

#### Respuesta error (400) - Token inválido

```json
{
  "message": "Token de confirmación inválido. No se pueden borrar los registros.",
  "statusCode": 400
}
```

---

## 💻 Ejemplos de Uso

### Con Fetch API (JavaScript)

#### Obtener registros

```javascript
fetch('http://localhost:3001/registros?page=1&limit=20')
  .then(res => res.json())
  .then(data => console.log(data))
  .catch(err => console.error('Error:', err));
```

#### Crear registro

```javascript
fetch('http://localhost:3001/registros', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    registro: 'Mi nuevo registro'
  })
})
  .then(res => res.json())
  .then(data => console.log('Creado:', data))
  .catch(err => console.error('Error:', err));
```

#### Actualizar registro

```javascript
fetch('http://localhost:3001/registros/1', {
  method: 'PATCH',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    registro: 'Contenido actualizado'
  })
})
  .then(res => res.json())
  .then(data => console.log('Actualizado:', data))
  .catch(err => console.error('Error:', err));
```

#### Eliminar registro

```javascript
fetch('http://localhost:3001/registros/1', {
  method: 'DELETE'
})
  .then(res => res.json())
  .then(data => console.log('Eliminado:', data))
  .catch(err => console.error('Error:', err));
```

#### Eliminar todos los registros

```javascript
fetch('http://localhost:3001/registros?token=CONFIRMAR_BORRAR_TODO', {
  method: 'DELETE'
})
  .then(res => res.json())
  .then(data => console.log('Todos eliminados:', data))
  .catch(err => console.error('Error:', err));
```

### Con Axios

#### Obtener registros

```javascript
import axios from 'axios';

axios.get('http://localhost:3001/registros', {
  params: { page: 1, limit: 20 }
})
  .then(res => console.log(res.data))
  .catch(err => console.error(err));
```

#### Crear registro

```javascript
axios.post('http://localhost:3001/registros', {
  registro: 'Mi nuevo registro'
})
  .then(res => console.log('Creado:', res.data))
  .catch(err => console.error(err));
```

### Con cURL

#### Obtener registros

```bash
curl -X GET "http://localhost:3001/registros?page=1&limit=20"
```

#### Crear registro

```bash
curl -X POST "http://localhost:3001/registros" \
  -H "Content-Type: application/json" \
  -d '{"registro":"Mi nuevo registro"}'
```

#### Eliminar todos

```bash
curl -X DELETE "http://localhost:3001/registros?token=CONFIRMAR_BORRAR_TODO"
```

---

## ❌ Manejo de Errores

### Códigos de Estado HTTP

| Código | Descripción |
|--------|-------------|
| `200` | OK - Operación exitosa |
| `201` | Created - Recurso creado |
| `400` | Bad Request - Datos inválidos |
| `404` | Not Found - Recurso no encontrado |
| `413` | Payload Too Large - Request muy grande (>1MB) |
| `429` | Too Many Requests - Límite de peticiones excedido |
| `500` | Internal Server Error - Error del servidor |

### Ejemplo de respuesta de error

```json
{
  "statusCode": 400,
  "message": [
    "El campo no puede estar vacío",
    "El campo contiene caracteres no permitidos"
  ],
  "error": "Bad Request"
}
```

---

## ⏱️ Rate Limiting

Si haces más peticiones del límite permitido, recibirás:

```json
{
  "statusCode": 429,
  "message": "Too Many Requests"
}
```

### Cómo evitarlo

- No hagas más de **3 peticiones por segundo**
- O más de **50 peticiones por minuto**
- Implementa esperas entre peticiones si es necesario

---

## 🔧 Variables de Entorno (.env)

```env
# Puerto de la aplicación
PORT=3001

# URL de conexión a PostgreSQL
DATABASE_URL=postgresql://user:password@localhost:5432/crudinsano

# Origen permitido para CORS
CORS_ORIGIN=http://localhost:3000

# Token para borrar todos los registros
DELETE_ALL_TOKEN=CONFIRMAR_BORRAR_TODO
```

---

## 📚 Endpoints Resumen

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/registros` | Obtener todos con paginación |
| `POST` | `/registros` | Crear nuevo |
| `GET` | `/registros/:id` | Obtener por ID |
| `PATCH` | `/registros/:id` | Actualizar por ID |
| `DELETE` | `/registros/:id` | Eliminar por ID |
| `DELETE` | `/registros?token=...` | Eliminar todos (seguro) |

---

## 🐛 Soporte y Debugging

### Ver la API en Swagger UI

Abre en tu navegador:
```
http://localhost:3001/api
```

Aquí puedes ver documentación interactiva y probar los endpoints directamente.

### Logs del servidor

Cuando ejecutas `npm run start:dev`, verás logs del servidor que te ayudarán a debuggear:
- Peticiones recibidas
- Validaciones fallidas
- Errores de base de datos

---

¿Preguntas? Consulta la documentación en Swagger o contacta al equipo de backend.
