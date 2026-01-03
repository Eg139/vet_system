---

# 📘 Manual de Estilo y Arquitectura: Vet-Backend

Este documento establece los estándares técnicos para garantizar que el sistema sea escalable, mantenible y profesional.

---

## 🏛️ 1. Estructura de Software y Clean Code

Para mantener la separación de responsabilidades, cada módulo debe seguir estrictamente esta organización de archivos:

* **`nombre.module.ts`**: Corazón del módulo. Define inyecciones, controladores y proveedores.
* **`nombre.controller.ts`**: Capa de entrada. Solo gestiona rutas, decoradores de Swagger y recibe DTOs. **No contiene lógica de negocio.**
* **`nombre.service.ts`**: Capa de lógica. Aquí reside la "inteligencia" del sistema, validaciones complejas y llamadas a la base de datos.
* **`dto/`**: Directorio para objetos de transferencia de datos (validación de entrada).
* **`entities/`**: Modelos de TypeORM que representan las tablas en la base de datos.

---

## 🛠️ 2. Estándar Maestro de DTOs (Data Transfer Objects)

El DTO es el contrato entre el cliente (Frontend) y el servidor. En NestJS, su función es triple: **Validar, Tipar y Documentar.**

### A. Reglas de Oro de un DTO Profesional

1. **Inmutabilidad Total**: Usa siempre `readonly`. Esto asegura que los datos no sufran efectos secundarios durante el ciclo de vida del request.
2. **Single Responsibility (SRP)**: Un DTO para cada acción. No mezcles `CreateUserDto` con `UpdateUserDto` si el segundo permite campos opcionales que el primero no.
3. **Naming Semántico**:
* **Contextos Genéricos**: Usa nombres simples como `email` o `password` (ej. en Login).
* **Contextos Compuestos**: Usa nombres específicos si hay riesgo de ambigüedad (ej. `adminEmail` y `vetEmail` en un proceso de registro masivo).



### B. Anatomía de un Decorador (Orden Sugerido)

Para mantener la legibilidad, organiza los decoradores de cada propiedad de la siguiente forma:

1. **Swagger (`@ApiProperty`)**: Documentación visual para el equipo.
2. **Validación (`@Is...`)**: Reglas de negocio (ej. `@IsEmail`, `@IsUUID`).
3. **Transformación (`@Type`, `@Trim`)**: Limpieza y casteo de datos.

### C. Implementación Maestra: `CreatePetDto`

Este ejemplo sirve de plantilla para cualquier entidad del sistema:

```typescript
import { 
  IsString, IsInt, IsEnum, IsUUID, IsOptional, 
  MinLength, MaxLength, Min, Max 
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum PetSpecies {
  DOG = 'Canino',
  CAT = 'Felino',
  BIRD = 'Ave',
  OTHER = 'Otro'
}

export class CreatePetDto {
  @ApiProperty({ description: 'Nombre de la mascota', example: 'Firulais' })
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @MinLength(2, { message: 'El nombre es demasiado corto' })
  readonly name: string;

  @ApiProperty({ enum: PetSpecies, example: PetSpecies.DOG })
  @IsEnum(PetSpecies, { message: 'La especie seleccionada no es válida' })
  readonly species: PetSpecies;

  @ApiProperty({ description: 'Edad en años', required: false })
  @IsInt({ message: 'La edad debe ser un número entero' })
  @Min(0)
  @IsOptional() // Campo opcional en el JSON, pero validado si existe
  readonly age?: number;

  @ApiProperty({ description: 'ID del dueño (UUID)' })
  @IsUUID('4', { message: 'El ID del dueño debe ser un UUID válido' })
  readonly ownerId: string;
}

```

### D. Tabla de Validación Rápida

| Tipo de Dato | Decoradores Sugeridos | Propósito |
| --- | --- | --- |
| **Textos** | `@IsString()`, `@MinLength()`, `@MaxLength()` | Seguridad en longitud de cadenas. |
| **Números** | `@IsNumber()`, `@IsInt()`, `@Min()`, `@Max()` | Evitar valores negativos o fuera de rango. |
| **Opcionales** | `@IsOptional()` | Evita errores 400 cuando el campo no es requerido. |
| **Relaciones** | `@IsUUID()` | Garantiza que los IDs extranjeros sean válidos. |
| **Listas** | `@IsArray()`, `@ArrayMinSize()` | Validación de colecciones de datos. |

---

## 💾 3. Gestión de Base de Datos y Migraciones

Queda estrictamente prohibido el uso de `synchronize: true` en entornos de desarrollo compartido o producción.

* **Atomicidad**: Cada migración debe realizar **un solo cambio lógico**. Si necesitas crear una tabla y modificar otra, considera hacer dos migraciones separadas.
* **Flujo de Trabajo**:
1. Actualizar la Entidad (`.entity.ts`).
2. Generar: `npm run migration:generate -- src/db/migrations/NombreDelCambio`.
3. **Auditoría**: Abrir el archivo generado y verificar que los métodos `up` y `down` sean coherentes.
4. Aplicar: `npm run migration:run`.



---

## 🔐 4. Autenticación y Multi-Tenancy (JWT)

El sistema está diseñado para albergar múltiples organizaciones (Veterinarias) de forma aislada.

* **JWT Payload**: El token no es solo para login; es el motor del Multi-Tenancy. Debe incluir obligatoriamente:
* `sub`: ID único del usuario.
* `orgId`: ID de la organización a la que pertenece (indispensable para filtrar queries SQL).


* **Seguridad de Credenciales**:
* Nunca almacenar contraseñas en texto plano.
* Uso de `bcrypt` con un **Salt de 10 rondas**.
* Uso de `@BeforeInsert()` en la entidad `User` para automatizar el hasheo.


* **Estrategia de Login**: Al autenticar, usar siempre `relations: ['organization']` para inyectar el ID de la empresa en el payload del token.

---

## ✅ Checklist de Revisión de Pull Requests

* [ ] ¿Todos los campos del DTO tienen `readonly`?
* [ ] ¿Se incluyó la propiedad `orgId` en el payload del JWT?
* [ ] ¿Las migraciones tienen nombres descriptivos en CamelCase?
* [ ] ¿Los decoradores de Swagger coinciden con las validaciones de `class-validator`?

---

Este documento es la base de **Vet-Backend**. Cualquier cambio en la arquitectura debe ser reflejado aquí.