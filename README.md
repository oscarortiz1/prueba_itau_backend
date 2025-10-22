# Prueba Itaú – Backend

API construida con NestJS para autenticación, persistencia y sincronización en tiempo real de transacciones financieras.

## Decisiones técnicas clave

- **Arquitectura modular**: `AppModule` agrupa `AuthModule`, `TransactionsModule` y `DatabaseModule`, lo que mantiene separadas las responsabilidades y permite escalar sin romper otras capas.
- **Configuración tipada**: `ConfigModule.forRoot` carga variables desde `.env` y aplica el `validationSchema` para fallar temprano ante configuraciones inválidas.
- **Persistencia en MongoDB**: `TransactionsModule` integra `MongooseModule` con un `TransactionSchema` que define restricciones de dominio (tipos válidos, longitudes máximas y timestamps automáticos).
- **Autenticación con JWT**: las estrategias `local` y `jwt` encapsulan la lógica de login y verificación de token. Los guards se reutilizan tanto en controladores HTTP como en `TransactionsGateway`.
- **Capas inspiradas en Clean Architecture**: los servicios en `application/` orquestan la lógica de negocio usando repositorios en `infrastructure/`, mientras las entidades en `domain/` se mantienen libres de dependencias de Nest o Mongoose.
- **Sincronización en tiempo real**: `TransactionsGateway` emite eventos vía WebSocket cuando hay cambios, permitiendo que el frontend se actualice sin polling.
- **DTOs con validación**: los controladores reciben DTOs (`create-transaction.dto.ts`, `update-transaction.dto.ts`) con `class-validator` para asegurar estructuras coherentes antes de llegar al servicio.

## Ejecutar el proyecto

```bash
npm install
npm run start:dev
```

## Ejecutar pruebas

```bash
npm run test
```

Consulta `../prueba_itau/README.md` para revisar las decisiones técnicas del frontend.
