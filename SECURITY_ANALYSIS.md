# 🛡️ Protección contra el Script de Ataque

## 📌 Análisis del Script Malicioso

```javascript
// El atacante intentaba enviar 500 peticiones POST en 25 segundos
for (let i = 1; i <= 500; i++) {
    fetch(URL_OBJETIVO, {
        method: 'POST',
        body: JSON.stringify({ 
            registro: `ESTAS SIENDO ATACADO CON PETICION #${i}` 
        })
    })
    await new Promise(r => setTimeout(r, 50));  // 50ms entre peticiones
}
```

**Vulnerabilidades que explotaba:**
1. ✅ Rate limiting insuficiente (3 req/seg permitía ~540 req en 3 minutos)
2. ✅ Sin detección de contenido repetitivo
3. ✅ Sin detección de patrones sospechosos
4. ✅ CORS permitía ejecución desde consola del navegador

---

## 🔒 Protecciones Implementadas

### 1. **Rate Limiting Reforzado**

**ANTES:**
- 3 req/segundo = 180 req/minuto
- Un atacante podía enviar muchas peticiones

**AHORA:**
| Límite | Resultado del Script |
|--------|---------------------|
| **2 req/segundo** | Solo 2 de las 20 peticiones/segundo pasan |
| **10 req/10 segundos** | Solo 10 peticiones cada 10 segundos |
| **30 req/minuto** | Máximo 30 peticiones por minuto |

**Resultado:** De las 500 peticiones intentadas, solo ~30 llegarían antes del bloqueo completo.

---

### 2. **Sistema Anti-Spam con Detección de Patrones**

El servicio `AntiSpamService` detecta automáticamente:

#### ❌ Contenido con palabras sospechosas
```javascript
registro: "ESTAS SIENDO ATACADO CON PETICION #1"
```
**Bloqueado por:** Patrón `ATACA(NDO|DO|R)` y `PETICIÓN #\d+`

**Error:** 
```json
{
  "message": "Contenido sospechoso detectado. Tu registro ha sido bloqueado por seguridad.",
  "statusCode": 400
}
```

#### ❌ Contenido duplicado
Si el atacante envía el mismo texto más de 2 veces en 1 minuto:

**Error:**
```json
{
  "message": "Contenido duplicado detectado. Has enviado este mismo texto 2 veces en el último minuto.",
  "statusCode": 400
}
```

#### ❌ Contenido muy similar
Si intenta variar ligeramente el texto:
```javascript
"ATAQUE 1", "ATAQUE 2", "ATAQUE 3"...
```

Si la similitud entre textos es >85%, será bloqueado:

**Error:**
```json
{
  "message": "El contenido es muy similar a un registro reciente. Por favor varía tu entrada.",
  "statusCode": 400
}
```

---

### 3. **CORS Estricto con Verificación de Origen**

**ANTES:**
- Cualquier origen podía hacer peticiones
- Scripts desde la consola funcionaban

**AHORA:**
Solo se permiten peticiones desde:
- `https://my-repository-seven-hazel.vercel.app` (producción)
- `http://localhost:3000` (desarrollo)
- `http://localhost:5173` (Vite local)

**Resultado:** 
- ❌ Scripts desde la consola de Chrome en sitios aleatorios → **BLOQUEADOS**
- ❌ Peticiones desde dominios no autorizados → **BLOQUEADAS**
- ✅ Solo tu frontend legítimo → **PERMITIDO**

Si intentan ejecutar el script desde la consola del navegador:

```
🚫 Origen bloqueado: https://ejemplo-malicioso.com
Error: No permitido por CORS
```

---

### 4. **Validación de Caracteres**

El DTO ya rechazaba algunos caracteres, pero ahora el anti-spam también detecta:
- Caracteres repetidos más de 10 veces: `aaaaaaaaaa`
- Secuencias de control
- Scripts HTML/JavaScript: `<script>alert('xss')</script>`

---

## 🧪 Prueba: ¿Qué pasaría si ejecutan el script ahora?

### Escenario: 500 peticiones en 25 segundos

```javascript
for (let i = 1; i <= 500; i++) {
    fetch(URL_OBJETIVO, {
        method: 'POST',
        body: JSON.stringify({ 
            registro: `ESTAS SIENDO ATACADO CON PETICION #${i}` 
        })
    })
    await new Promise(r => setTimeout(r, 50));
}
```

### Resultado esperado:

| Petición | Resultado | Razón |
|----------|-----------|-------|
| **#1** | ❌ Rechazada | Contenido sospechoso detectado: "ATACADO" |
| **#2-500** | ❌ Rechazadas | Mismo error + rate limiting |
| **Total exitosas** | **0 de 500** | 🎉 |

### Si intentan con texto "normal":

```javascript
registro: `Registro número ${i}`
```

| Petición | Resultado | Razón |
|----------|-----------|-------|
| **#1** | ✅ Éxito | Primera petición válida |
| **#2** | ✅ Éxito | Dentro del límite (2/segundo) |
| **#3** | ❌ Bloqueada | Rate limit: 2 req/segundo excedido |
| **#4-10** | ❌ Bloqueadas | Rate limit |
| **#11** | ✅ Posiblemente éxito | Si esperó 10 segundos |
| **#12-30** | ⚠️ Algunas pasan | Depende del timing |
| **#31+** | ❌ Bloqueadas | Límite de 30 req/minuto alcanzado |
| **Total exitosas** | **~30 de 500** | 94% bloqueado |

### Y si varían el texto cada vez:

```javascript
registro: `Texto aleatorio ${Math.random()}`
```

Aún así:
- Solo ~30 peticiones por minuto pasarán (rate limiting)
- Las demás serán rechazadas con error 429

---

## 📊 Comparación: Antes vs Ahora

| Métrica | ANTES | AHORA |
|---------|-------|-------|
| **Peticiones exitosas en 1 min** | ~180 | **30** |
| **Detección de spam** | ❌ No | ✅ Sí |
| **Detección de duplicados** | ❌ No | ✅ Sí |
| **Bloqueo por patrón sospechoso** | ❌ No | ✅ Sí |
| **CORS estricto** | ⚠️ Parcial | ✅ Completo |
| **Protección desde consola** | ❌ No | ✅ Sí |

---

## 🎯 Conclusión

El script de ataque que funcionaba antes ahora es **completamente inefectivo**:

1. **Rate limiting:** Solo 30 peticiones/minuto en lugar de 500
2. **Anti-spam:** Detecta "ATACADO", "PETICIÓN #X" y otros patrones
3. **CORS:** Bloquea ejecución desde consola o sitios no autorizados
4. **Detección de similitud:** Bloquea contenido repetitivo

### ¿Puede alguien aún atacar?

Técnicamente podrían:
- Usar un proxy para cambiar de IP
- Enviar desde el frontend legítimo (si tienen acceso)
- Enviar 30 registros válidos por minuto

Pero ya no pueden:
- ❌ Inundar con cientos de peticiones
- ❌ Ejecutar scripts desde la consola
- ❌ Enviar contenido sospechoso o duplicado
- ❌ Sobrecargar el servidor fácilmente

---

## 🚀 Para Implementar en Producción

1. Actualizar variables de entorno:
```env
CORS_ORIGIN=https://tu-frontend-produccion.vercel.app
NODE_ENV=production
```

2. Reiniciar el servidor:
```bash
npm run build
npm run start:prod
```

3. Verificar logs para detectar intentos de ataque:
```
🚫 Origen bloqueado: https://sitio-malicioso.com
```

---

## 🔍 Monitoreo

El `AntiSpamService` incluye estadísticas:

```typescript
antiSpamService.getStats()
```

Retorna:
```json
{
  "totalIPs": 5,
  "totalSubmissions": 45
}
```

Puedes agregar un endpoint admin para monitorear intentos de spam.

---

**¿Tienes más preguntas sobre las protecciones implementadas?**
