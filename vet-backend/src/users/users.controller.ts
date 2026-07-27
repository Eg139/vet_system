import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { ActiveUser } from '../auth/decorators/active-user.decorator';
import { UserRole } from './entities/user.entity';

@ApiTags('Usuarios') // Grupo principal en Swagger UI
@ApiBearerAuth('access-token') // Requiere el Token JWT en Swagger
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard) // Protege autenticación y roles
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Roles(UserRole.ADMIN) // Solo un administrador puede crear usuarios
  @ApiOperation({ summary: 'Crear un nuevo usuario en la organización' })
  @ApiResponse({ status: 201, description: 'Usuario creado exitosamente.' })
  @ApiResponse({ status: 400, description: 'Datos de entrada inválidos.' })
  @ApiResponse({ status: 401, description: 'No autorizado / Token inválido.' })
  @ApiResponse({ status: 403, description: 'Acceso denegado (Requiere rol ADMIN).' })
  @ApiResponse({ status: 409, description: 'El correo electrónico ya está registrado.' })
  create(
    @Body() createUserDto: CreateUserDto,
    @ActiveUser('orgId') orgId: string,
  ) {
    return this.usersService.create(createUserDto, orgId);
  }

  @Get()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Obtener todos los usuarios de la veterinaria activa' })
  @ApiResponse({ status: 200, description: 'Lista de usuarios devuelta correctamente.' })
  @ApiResponse({ status: 401, description: 'No autorizado.' })
  findAll(@ActiveUser('orgId') orgId: string) {
    return this.usersService.findAll(orgId);
  }

  @Get(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Obtener un usuario específico por su ID' })
  @ApiParam({ name: 'id', description: 'UUID del usuario a buscar', type: 'string' })
  @ApiResponse({ status: 200, description: 'Usuario encontrado.' })
  @ApiResponse({ status: 400, description: 'El ID provisto no es un UUID válido.' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado en esta organización.' })
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @ActiveUser('orgId') orgId: string,
  ) {
    return this.usersService.findOne(id, orgId);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Actualizar la información de un usuario' })
  @ApiParam({ name: 'id', description: 'UUID del usuario a actualizar' })
  @ApiResponse({ status: 200, description: 'Usuario actualizado exitosamente.' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado.' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
    @ActiveUser('orgId') orgId: string,
  ) {
    return this.usersService.update(id, updateUserDto, orgId);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Eliminar un usuario de la organización' })
  @ApiParam({ name: 'id', description: 'UUID del usuario a eliminar' })
  @ApiResponse({ status: 200, description: 'Usuario eliminado exitosamente.' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado.' })
  remove(
    @Param('id', ParseUUIDPipe) id: string,
    @ActiveUser('orgId') orgId: string,
  ) {
    return this.usersService.remove(id, orgId);
  }
}