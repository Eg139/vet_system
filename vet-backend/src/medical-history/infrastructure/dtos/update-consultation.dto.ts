import { PartialType } from '@nestjs/swagger';
import { CreateConsultationHttpDto } from './create-consultation.dto';

export class UpdateConsultationHttpDto extends PartialType(CreateConsultationHttpDto) {}