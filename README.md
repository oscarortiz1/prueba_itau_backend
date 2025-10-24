# Prueba Itaú – Backend

Documento breve (README) explicando las decisiones técnicas tomadas para el servicio API.

API NestJS para autenticación, operaciones con transacciones y notificaciones en tiempo real consumida por el cliente Flutter.

## Novedades recientes

- Prefijo global `/api` + versionado URI: todas las rutas expuestas quedan como `/api/v1/...`, alineadas con el frontend.
- Documentación vía Swagger en `http://localhost:3000/api/docs`, con soporte para autenticación Bearer y esquemas detallados de request/response.
- Suite end-to-end (`test/app.e2e-spec.ts`) usando `mongodb-memory-server` para validar login y CRUD de transacciones sin depender de infraestructura externa.
- DTOs de autenticación y transacciones reestructurados para reutilizar respuestas tipadas y mensajes de error consistentes.
- `TransactionsGateway` mantiene sincronización en tiempo real con Socket.IO; los eventos se emiten al crear/actualizar/eliminar transacciones.
- Configuración validada al arranque mediante `config/validation.ts`, evitando que la app se levante con variables incompletas.

## Arquitectura en breve

- **Módulos**: `AuthModule`, `TransactionsModule` y `DatabaseModule` se agrupan en `AppModule` para mantener responsabilidades separadas.
- **Capas**: `application/` contiene servicios orquestadores; `domain/` modela entidades puras; `infrastructure/` aporta repositorios Mongoose.
- **Seguridad**: estrategias `local` y `jwt` respaldan `JwtAuthGuard` y protegen controladores/rest + gateway.

## Swagger y rutas

- Visita `http://localhost:3000/api/docs` con el servidor en marcha.
- Usa el botón **Authorize** y pega un JWT (`Bearer <token>`) para probar los endpoints protegidos.
- El JSON de la documentación está disponible en `http://localhost:3000/api/docs/json`.

## Puesta en marcha

```bash
npm install
npm run start:dev
```

El servidor escucha en el puerto configurado en `APP_PORT` (3000 por defecto).

## Pruebas

- Unit/integration: `npm run test`
- End-to-end: `npm run test:e2e`

Consulta `../prueba_itau/README.md` para revisar las decisiones técnicas del frontend.
