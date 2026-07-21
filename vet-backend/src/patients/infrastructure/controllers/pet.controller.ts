// src/patients/infrastructure/controllers/pet.controller.ts
import { 
  Controller, 
  Post, 
  Patch, 
  Get, 
  Param, 
  Query, 
  Body, 
  UseGuards, 
  Req, 
  BadRequestException 
} from '@nestjs/common';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiBearerAuth, 
  ApiQuery, 
  ApiParam 
} from '@nestjs/swagger';

// Casos de Uso (Capa de Aplicación)
import { CreatePetUseCase } from '../../application/use-cases/create-pet.use-case';
import { UpdatePetUseCase } from '../../application/use-cases/update-pet.use-case';
import { NeuterPetUseCase } from '../../application/use-cases/neuter-pet.use-case';
import { TransferPetOwnershipUseCase } from '../../application/use-cases/transfer-pet-ownership.use-case';
import { GetPetsByOwnerUseCase } from '../../application/use-cases/get-pets-by-owner.use-case';
import { GetPetByIdUseCase } from '../../application/use-cases/get-pet-by-id.use-case';

// DTOs de Infraestructura
import { CreatePetHttpDto } from './dtos/create-pet.dto';
import { UpdatePetHttpDto } from './dtos/update-pet.dto';
import { TransferOwnershipHttpDto } from './dtos/transfer-ownership.dto';

// Guardián de Seguridad (Descomentá la ruta correcta de tu JwtAuthGuard)
// import { JwtAuthGuard } from 'src/auth/infrastructure/guards/jwt-auth.guard'; 

@ApiTags('Patients') // Agrupa este controlador bajo la sección "Patients" en la UI de Swagger
@ApiBearerAuth()     // Le avisa a Swagger que todos estos endpoints requieren el Token JWT en la cabecera
// @UseGuards(JwtAuthGuard) // <-- Descomentalo cuando quieras activar el candado global de Passport
@Controller('patients')
export class PetController {
  constructor(
    private readonly createPetUseCase: CreatePetUseCase,
    private readonly updatePetUseCase: UpdatePetUseCase,
    private readonly neuterPetUseCase: NeuterPetUseCase,
    private readonly transferPetOwnershipUseCase: TransferPetOwnershipUseCase,
    private readonly getPetsByOwnerUseCase: GetPetsByOwnerUseCase,
    private readonly getPetByIdUseCase: GetPetByIdUseCase,
  ) {}

  // =========================================================================
  // 1. REGISTRAR MASCOTA (POST /patients)
  // =========================================================================
  @Post()
  @ApiOperation({ 
    summary: 'Registrar un nuevo paciente (Mascota)', 
    description: 'Registra una mascota vinculada a un dueño inicial. El orgId se asocia automáticamente desde el token JWT para garantizar el aislamiento multi-tenant.' 
  })
  @ApiResponse({ status: 201, description: 'Mascota creada exitosamente en la organización.' })
  @ApiResponse({ status: 400, description: 'Datos de entrada inválidos o invariants de negocio rotos.' })
  @ApiResponse({ status: 401, description: 'No autorizado. Token faltante o inválido.' })
  async create(@Body() dto: CreatePetHttpDto, @Req() req: any) {
    const orgId = req.user?.orgId || 'org-test-id';

    return await this.createPetUseCase.execute({
      name: dto.name,
      species: dto.species,
      breed: dto.breed,
      birthDate: new Date(dto.birthDate),
      ownerId: dto.ownerId,
      orgId: orgId,
      bloodType: dto.bloodType,
      isNeutered: dto.isNeutered,
      chronicAllergies: dto.chronicAllergies,
    });
  }

  // =========================================================================
  // 2. OBTENER MASCOTAS POR DUEÑO (GET /patients?ownerId=UUID)
  // =========================================================================
  @Get()
  @ApiOperation({ 
    summary: 'Obtener todas las mascotas de un propietario específico',
    description: 'Retorna la lista de pacientes que pertenecen al cliente indicado, filtrando estrictamente por la organización del usuario autenticado.'
  })
  @ApiQuery({ name: 'ownerId', type: String, description: 'ID único del propietario (Cliente)', example: 'a9b8c7d6-e5f4-3c2b-1a09-fedcba987654' })
  @ApiResponse({ status: 200, description: 'Lista de mascotas retornada exitosamente (mapeada a entidades ricas).' })
  @ApiResponse({ status: 400, description: 'El parámetro ownerId es obligatorio en la consulta.' })
  async getByOwner(@Query('ownerId') ownerId: string, @Req() req: any) {
    if (!ownerId) {
      throw new BadRequestException('El parámetro ownerId es obligatorio.');
    }

    const orgId = req.user?.orgId || 'org-test-id';

    return await this.getPetsByOwnerUseCase.execute({
      ownerId,
      orgId,
    });
  }

  // =========================================================================
  // 3. ACTUALIZAR PERFIL GENERAL (PATCH /patients/:id)
  // =========================================================================
  @Patch(':id')
  @ApiOperation({ 
    summary: 'Actualizar datos generales del perfil de la mascota',
    description: 'Modifica propiedades descriptivas y el perfil biológico básico (alergias, tipo de sangre). No permite alterar el estado de castración ni cambiar de dueño directamente.'
  })
  @ApiParam({ name: 'id', type: String, description: 'ID de la mascota a editar', example: '550e8400-e29b-41d4-a716-446655440000' })
  @ApiResponse({ status: 200, description: 'Perfil de la mascota actualizado y persistido con éxito.' })
  @ApiResponse({ status: 404, description: 'La mascota no existe o no pertenece a esta clínica.' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdatePetHttpDto,
    @Req() req: any
  ) {
    const orgId = req.user?.orgId || 'org-test-id';

    return await this.updatePetUseCase.execute({
      id,
      orgId,
      name: dto.name,
      species: dto.species,
      breed: dto.breed,
      birthDate: dto.birthDate ? new Date(dto.birthDate) : undefined,
      bloodType: dto.bloodType,
      newAllergy: dto.newAllergy,
    });
  }

  // =========================================================================
  // 4. REGISTRAR CASTRACIÓN QUIRÚRGICA (POST /patients/:id/neuter)
  // =========================================================================
  @Post(':id/neuter')
  @ApiOperation({ 
    summary: 'Registrar la castración de la mascota',
    description: 'Acción clínica dedicada que invoca el método semántico de la entidad. Dispara un error de negocio si la mascota ya se encuentra castrada.'
  })
  @ApiParam({ name: 'id', type: String, description: 'ID de la mascota intervenida', example: '550e8400-e29b-41d4-a716-446655440000' })
  @ApiResponse({ status: 200, description: 'Mascota marcada como castrada quirúrgicamente de manera permanente.' })
  @ApiResponse({ status: 400, description: 'Violación de regla de negocio: La mascota ya estaba castrada.' })
  @ApiResponse({ status: 404, description: 'Mascota no encontrada en la organización.' })
  async neuter(@Param('id') id: string, @Req() req: any) {
    const orgId = req.user?.orgId || 'org-test-id';

    return await this.neuterPetUseCase.execute({
      petId: id,
      orgId,
    });
  }

  // =========================================================================
  // 5. TRANSFERENCIA DE TITULARIDAD (PATCH /patients/:id/transfer-ownership)
  // =========================================================================
  @Patch(':id/transfer-ownership')
  @ApiOperation({ 
    summary: 'Transferir la titularidad de la mascota a otro cliente',
    description: 'Acción administrativa controlada que modifica el dueño de la mascota. Valida que el nuevo dueño no sea idéntico al actual.'
  })
  @ApiParam({ name: 'id', type: String, description: 'ID de la mascota a transferir', example: '550e8400-e29b-41d4-a716-446655440000' })
  @ApiResponse({ status: 200, description: 'Titularidad transferida con éxito al nuevo propietario.' })
  @ApiResponse({ status: 400, description: 'La mascota ya pertenece al ID de dueño provisto.' })
  @ApiResponse({ status: 404, description: 'Mascota no encontrada.' })
  async transferOwnership(
    @Param('id') id: string,
    @Body() dto: TransferOwnershipHttpDto,
    @Req() req: any
  ) {
    const orgId = req.user?.orgId || 'org-test-id';

    return await this.transferPetOwnershipUseCase.execute({
      petId: id,
      newOwnerId: dto.newOwnerId,
      orgId,
    });
  }

  // =========================================================================
  // 6. OBTENER MASCOTA POR ID (GET /patients/:id)
  // =========================================================================
  @Get(':id')
  @ApiOperation({ 
    summary: 'Obtener los detalles completos de un paciente por su ID',
    description: 'Retorna toda la información biológica y administrativa de una mascota específica, validando el aislamiento multi-tenant.'
  })
  @ApiParam({ name: 'id', type: String, description: 'ID único de la mascota (UUID)', example: '550e8400-e29b-41d4-a716-446655440000' })
  @ApiResponse({ status: 200, description: 'Datos del paciente obtenidos exitosamente.' })
  @ApiResponse({ status: 404, description: 'El paciente no existe o no pertenece a esta organización.' })
  async getById(@Param('id') id: string, @Req() req: any) {
    const orgId = req.user?.orgId || 'org-test-id';

    // Acá invocarías un caso de uso específico, por ejemplo: GetPetByIdUseCase
    return await this.getPetByIdUseCase.execute({
      id,
      orgId,
    });
  }
}