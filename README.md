# 🧾 KDS Orders Service – Backend

## 📌 Descripción de la solución

Este proyecto es un servicio backend para la gestión de órdenes (Orders Service), diseñado bajo principios de **Clean Architecture** y desacoplado del framework.

El sistema permite:

- Ingestar órdenes externas (webhook protegido con Basic Auth)
- Listar órdenes con filtros por estado
- Obtener detalle de una orden (proyección optimizada)
- Actualizar el estado de una orden con control de transiciones válidas

El servicio implementa:

- Arquitectura hexagonal (Ports & Adapters)
- Casos de uso desacoplados de NestJS
- Validación con Zod
- Sistema de errores centralizado
- Swagger documentado manualmente con DTOs explícitos
- Guards desacoplados del dominio
- Filtro global de errores con mapeo por reglas

---

# 🏗 Arquitectura

El proyecto sigue una estructura basada en capas:
```bash
src/
├── application/ → Casos de uso
├── domain/ → Entidades y lógica de negocio
├── infrastructure/ → HTTP, repositorios, adaptadores
├── common/ → Builders, schemas, errores, guards
├── config/ → Configuración (env, swagger)
```
## Principios aplicados

- El dominio no conoce NestJS.
- La aplicación no lanza excepciones HTTP.
- Los errores se transforman en el filtro global.
- Los controladores solo orquestan.
- Swagger no contamina la lógica de negocio.
- Las respuestas siguen un contrato uniforme (`IResponse<T>`).

---

# 🚀 Instrucciones para ejecutar el proyecto

## 1️⃣ Instalar dependencias
```bash
pnpm install
```
## 2️⃣ Variables de entorno

Crear un archivo .env:
```bash
PORT=3000
NEST_NODE_ENV=DEVELOPMENT
NEST_MONGO_URL=UrlDeBD
NEST_USER_NAME_GLOVO=your_user
NEST_PASSWORD_GLOVO=your_password
```
## 3️⃣ Ejecutar en desarrollo
```bash
pnpm run start:dev
```

## 5️⃣ Swagger

Disponible en:
```bash
http://localhost:3000/docs
```

## 🔐 Seguridad

El endpoint de ingesta de órdenes está protegido mediante:

Basic Authentication
Comparación segura con timingSafeEqual
Guard independiente del dominio
Manejo centralizado de errores de autenticación

## 📦 Endpoints

🔹 Ingest Order
POST /orders
Protegido con Basic Auth
Valida DTO con Zod
Retorna IResponse<OrderDto>

🔹 List Orders
GET /orders
Filtro opcional por status
Retorna IResponse<OrderListDTO[]>

🔹 Get Order Detail
GET /orders/:id
Retorna proyección optimizada
Error 404 si no existe

🔹 Update Order Status
PATCH /orders/:id
Valida transición de estado
409 si transición inválida
404 si no existe
400 si DTO inválido

## 📐 Contrato de Respuesta

Todas las respuestas exitosas siguen el formato:
```bash
{
  "status": number,
  "code": "string",
  "message": "string",
  "data": {}
}
```

En el caso de actualizaciones sin contenido:
```bash
{
  "status": 200,
  "code": "KDS-ORD-R0004",
  "message": "Order status updated successfully"
}
```

❌ Contrato de Error

Todos los errores siguen el formato:
```bash
{
  "status": number,
  "code": "string",
  "message": "string",
  "details": {},
  "timestamp": "ISO date"
}
```

Ejemplo (409):
```bash
{
  "status": 409,
  "code": "KDS-ORDER-E0002",
  "message": "Invalid order status transition",
  "details": {
    "displayMessage": {
      "ref": "140219-020103-050002",
      "en": "Invalid order status transition",
      "es": "Transición de estado de pedido no válida"
    },
    "reason": "Invalid transition from CONFIRMED to PICKED_UP"
  },
  "timestamp": "2026-02-07T21:15:37.014Z"
}
```

# ⚙️ Decisiones técnicas relevantes

## 1️⃣ Clean Architecture/Arquitectura Hexagonal
- El dominio y los casos de uso están desacoplados de:
 - NestJS
 - Swagger
 - Infraestructura HTTP

Permite:
- Testear lógica sin framework
- Reemplazar adaptadores
- Mantener el dominio puro

## 2️⃣ Validación con Zod

#### Se eligió Zod porque:
- Mejor inferencia de tipos
- Validación declarativa
- Control explícito de errores
- Integración limpia con pipes personalizados

## 3️⃣ Sistema propio de respuestas y errores

#### Se implementó:
- buildResponse
- buildError
- Diccionarios centralizados
- Resolución por reglas en el filtro global

#### Ventajas:
- Uniformidad en respuestas
- Independencia del framework
- Preparado para internacionalización
- Códigos estandarizados

## 4️⃣ Swagger desacoplado

#### La documentación:
- Usa DTOs exclusivos para Swagger
- No contamina DTOs de negocio
- Refleja exactamente el contrato runtime

## 5️⃣ Control de transiciones de estado

- Las reglas de transición están en el dominio.
- Si una transición es inválida:
  - Se lanza error de dominio
  - El filtro global lo transforma en 409

# 🔍 Posibles mejoras

## 1️⃣ Tests automatizados

- Unit tests para casos de uso
- Integration tests para endpoints

## 2️⃣ Wrapper Swagger genérico

Reducir repetición creando un wrapper reutilizable para IResponse<T>.

## 3️⃣ Logging estructurado

#### Agregar:

- Correlation ID
- Logs por capa
- Logger centralizado

## 4️⃣ Observabilidad

#### Integración futura con:
- OpenTelemetry
- Health checks
- Métricas

# 🧠 Conclusión

#### Este backend está diseñado para:

- Escalar
- Ser mantenible
- Estar desacoplado
- Ser testeable
- Tener contratos claros
- Mantener independencia del framework

No es un CRUD simple.
Es una implementación con arquitectura formal y estándares definidos.