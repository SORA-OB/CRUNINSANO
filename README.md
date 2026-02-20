# API CRUD Registros

API REST desarrollada con NestJS para gestión simple de registros con protecciones contra ataques DDoS.

## 📚 Documentación

- **[API - Guía completa para Frontend](./README_API.md)** ← Para el equipo de frontend
- **Swagger Interactivo:** `http://localhost:3001/api` (cuando el servidor esté corriendo)

## 🚀 Inicio Rápido

```bash
# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env

# Ejecutar migraciones
npx prisma migrate deploy

# Iniciar en desarrollo
npm run start:dev
```

El servidor estará en `http://localhost:3001`

## 📋 Stack Tecnológico

- **Framework:** NestJS 11
- **BD:** PostgreSQL con Prisma ORM
- **Validación:** class-validator, class-transformer
- **Documentación:** Swagger/OpenAPI
- **Seguridad:** Rate limiting, validación input, headers HTTP

## 🔒 Características de Seguridad

✅ Validación automática de entrada  
✅ Rate limiting (3 req/seg, 50 req/min)  
✅ Límite de tamaño de request (1MB)  
✅ Paginación obligatoria  
✅ Headers de seguridad HTTP  
✅ Protección contra XSS  
✅ Eliminación de registros con token de confirmación  

## 📡 Endpoints Principales

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/registros?page=1&limit=20` | Obtener con paginación |
| `POST` | `/registros` | Crear |
| `GET` | `/registros/:id` | Obtener por ID |
| `PATCH` | `/registros/:id` | Actualizar |
| `DELETE` | `/registros/:id` | Eliminar |
| `DELETE` | `/registros?token=...` | Eliminar todos |

**→ Ver [README_API.md](./README_API.md) para detalles completos de cada endpoint**

## 🛠️ Scripts npm

```bash
npm run start         # Ejecutar en producción
npm run start:dev     # Ejecutar en desarrollo (watch mode)
npm run build         # Compilar para producción
npm run lint          # Ejecutar eslint
npm run format        # Formatear código
npm run test          # Ejecutar tests
npm run test:e2e      # Ejecutar tests e2e
```

## 📝 Variables de Entorno

|  Variable | Descripción | Default |
|-----------|-------------|---------|
| `PORT` | Puerto del servidor | 3001 |
| `DATABASE_URL` | URL de PostgreSQL | *(requerida)* |
| `CORS_ORIGIN` | Origen permitido para CORS | https://my-repository-seven-hazel.vercel.app |
| `DELETE_ALL_TOKEN` | Token para borrar todos los registros | CONFIRMAR_BORRAR_TODO |

Ver `.env.example` para más detalles.

## 🗄️ Base de Datos

### Modelo Registros

```prisma
model registros {
  id       Int     @default(autoincrement()) @id
  registro String  // 500 caracteres máx
}
```

### Migraciones

```bash
# Crear nueva migración
npx prisma migrate dev --name nombre_migracion

# Ejecutar migraciones pendientes
npx prisma migrate deploy

# Resetear BD (solo desarrollo)
npx prisma migrate reset
```

### Prisma Studio (UI Visual)

```bash
npx prisma studio
```

## 🧪 Testing

```bash
# Tests unitarios
npm run test

# Watch mode
npm run test:watch

# Coverage
npm run test:cov

# Tests e2e
npm run test:e2e
```

## 🐛 Debugging

### Ver logs del servidor
Ejecuta `npm run start:dev` para ver todos los logs en tiempo real.

### Swagger Interactivo
Abre `http://localhost:3001/api` para explorar y probar los endpoints gráficamente.

### Inspeccionar BD
```bash
npx prisma studio  # Abre UI visual de la BD
```

## 📦 Deployment

### Producción
```bash
npm run build
npm run start:prod
```

### Con Docker
```bash
docker build -t crudinsano .
docker run -p 3001:3001 crudinsano
```

## ⚙️ Configuración

### CORS
Edita en `.env`:
```
CORS_ORIGIN=http://localhost:3000
```

### Rate Limiting
Modificar en `src/app.module.ts`:
```typescript
ThrottlerModule.forRoot([
  { ttl: 1000, limit: 3 },    // 3 req/segundo
  { ttl: 60000, limit: 50 },  // 50 req/minuto
])
```

### Validación de Datos
Editar en `src/registros/dto/create-registro.dto.ts`

## 📖 Recursos

- [Documentación Frontend - Cómo usar los endpoints](./README_API.md)
- [NestJS Docs](https://docs.nestjs.com)
- [Prisma Docs](https://www.prisma.io/docs)
- [Swagger/OpenAPI](https://swagger.io)

## 👥 Equipo

- **Backend:** [Tu nombre]
- **Frontend:** [Nombre del compañero]

## 📝 Licencia

UNLICENSED

---

**¿Preguntas?** Consulta [README_API.md](./README_API.md) para documentación detallada de la API.
