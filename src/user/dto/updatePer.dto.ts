import { PartialType } from '@nestjs/mapped-types';
import { CreatePerDto } from './createPer.dto';

export class UpdatePerDto extends PartialType(CreatePerDto) {}
