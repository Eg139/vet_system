import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsNotEmpty } from 'class-validator';

export class TransferOwnershipHttpDto {
  @ApiProperty({ description: 'ID del nuevo propietario (Cliente)', example: 'b2c3d4e5-f6a7-4b3c-2d1e-0987654321ba' })
  @IsUUID()
  @IsNotEmpty()
  newOwnerId!: string;
}