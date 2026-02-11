# Backend KSD Product Challenge

Backend desarrollado con **NestJS** siguiendo principios de **Clean Architecture**, **Hexagonal Architecture (Ports & Adapters)** y **Domain-Driven Design (DDD)**.

La solución está implementada como un **Monolito Modular orientado a features**, donde cada módulo encapsula completamente su dominio, casos de uso, infraestructura y capa de presentación.

---

## 📚 Documentación API

La documentación interactiva está disponible vía Swagger en:

👉 http://localhost:3000/docs

Incluye:

- Esquemas completos de request y response
- Modelado de errores tipados
- Autenticación BasicAuth documentada
- Contratos desacoplados del framework

---

## 🏗 Arquitectura

El sistema está organizado por módulos funcionales siguiendo separación estricta de responsabilidades.

### Estructura del módulo `orders`

```bash
modules/orders
├── application
│ ├── use-cases
│ ├── ports
│ └── contracts
├── domain
│ ├── entities
│ ├── value-objects
│ └── services
├── infrastructure
│ └── mongo
│ ├── repositories
│ ├── schemas
│ └── mappers
└── presentation
├── controllers
├── dtos
├── swagger
└── websocket
```

---

## 🔎 Capas y responsabilidades

### Domain

- Entidades
- Value Objects
- Servicios de dominio
- Reglas de negocio puras
- Sin dependencias de frameworks

### Application

- Casos de uso
- Orquestación de reglas
- Definición de puertos (interfaces)
- Independiente de infraestructura concreta

### Infrastructure

- Implementaciones técnicas
- MongoDB + Mongoose
- Adaptadores de repositorios
- Mapeo persistencia ↔ dominio

### Presentation

- Controllers HTTP
- DTOs
- Documentación Swagger
- Gateway WebSocket

---

## 🧠 Principios aplicados

- Separación estricta de dependencias
- Inversión de dependencias mediante puertos
- Encapsulamiento por módulo (bounded context)
- Mapeo explícito entre modelos de persistencia y dominio
- DTOs desacoplados del dominio
- Documentación OpenAPI desacoplada de controllers
- Preparado para migración a microservicios

---

## 🚀 Ejecución del proyecto

### 1️⃣ Clonar repositorio

```bash
git clone <repository-url>
cd backend-ksd-product-challenge
```

### 2️⃣ Instalar dependencias

```bash
pnpm install
```

### 3️⃣ Configurar variables de entorno

Crear archivo .env basado en .env.template:

```bash
NEST_MONGO_URL=mongodb://localhost:27017
```

### 4️⃣ Ejecutar en modo desarrollo

```bash
pnpm run start:dev
```

La aplicación estará disponible en:

```bash
http://localhost:3000
```

O el puerto de su eleccion

## Documentación Swagger:

```bash
http://localhost:3000/docs
```

## 🧪 Testing

```bash
npm run test
```

## 🗄 Base de datos

MongoDB

Mongoose como ODM

Las entidades de dominio no dependen del esquema Mongo.

El mapeo se realiza explícitamente en los repositorios.

Esto permite cambiar el motor de persistencia sin afectar el dominio.

## 🔌 WebSocket

El módulo orders expone eventos mediante un Gateway WebSocket desacoplado a través del puerto:

```bash
OrderEventsPort
```

Esto permite:

- Sustituir WebSocket por otro mecanismo

- Migrar a un broker (Kafka / RabbitMQ)

- Mantener el dominio independiente de la tecnología de comunicación

## 📌 Decisiones técnicas relevantes

### 1️⃣ Arquitectura modular por feature

Se priorizó la organización por módulo funcional en lugar de una estructura global por capas con el objetivo de:

- Reducir el acoplamiento transversal
- Mejorar la mantenibilidad
- Permitir escalabilidad de equipos
- Facilitar una futura extracción como microservicio


### 2️⃣ Clean Architecture + Hexagonal

Se implementaron puertos y adaptadores para:

- Aislar el dominio de la infraestructura
- Permitir reemplazar MongoDB sin impacto en los casos de uso
- Encapsular WebSocket como adaptador externo


### 3️⃣ Uso de Value Objects

Los estados y prioridades de las órdenes se modelan como Value Objects dentro del dominio para:

- Garantizar invariantes
- Centralizar validaciones
- Evitar lógica distribuida

## 4️⃣ Inyección mediante tokens simbólicos

Se utilizan tokens explícitos:

```bash
export const ORDERS_REPOSITORY = Symbol('ORDERS_REPOSITORY');
```
---

## 📈 Posibles mejoras

- Implementar CQRS formal (separación de Commands y Queries)
- Introducir Domain Events con un Event Bus interno
- Agregar pruebas de integración
- Incorporar Docker Compose para un entorno reproducible
- Implementar observabilidad (logs estructurados, tracing)
- Añadir rate limiting y métricas

---

## 📦 Escalabilidad futura

La arquitectura permite:

- Extraer el módulo `orders` como microservicio independiente
- Reemplazar MongoDB por otro motor de persistencia
- Migrar WebSocket a un broker de eventos
- Escalar horizontalmente sin modificar el dominio
