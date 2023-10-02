import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Permission } from './entities/permission.entity';
import { CreatePerDto } from './dto/createPer.dto';
import { UpdatePerDto } from './dto/updatePer.dto';

@Injectable()
export class PerService {
  constructor(
    @InjectRepository(Permission) private perRepo: Repository<Permission>,
  ) {}

  //Create new permission
  async create(create: CreatePerDto) {
    const check = await this.findByName(create.permission_name);
    if (check)
      throw new BadRequestException(
        `Permission with name ${create.permission_name} is exist`,
      );
    const per = this.perRepo.create(create);
    this.perRepo.save(per);
  }

  //Find all permission
  findAll() {
    return this.perRepo.find();
  }

  //Find permission by id
  async findById(permission_id: number): Promise<Permission | null> {
    const per = await this.perRepo.findOneBy({ permission_id });
    if (!per) return null;
    return per;
  }

  //Find permission by name
  async findByName(permission_name: string): Promise<Permission | null> {
    const per = await this.perRepo.findOneBy({ permission_name });
    if (!per) {
      return null;
    }
    return per;
  }

  //Update permission
  async update(permission_id: number, updatePer: UpdatePerDto) {
    const per = await this.findById(permission_id);
    if (!per)
      throw new BadRequestException(
        `Permission with id ${permission_id} does not exist`,
      );
    const check = await this.findByName(updatePer.permission_name);
    if (check)
      throw new BadRequestException(
        `Permission with name ${updatePer.permission_name}  exist`,
      );
    Object.assign(per, updatePer);
    this.perRepo.save(per);
  }

  //Remove permission
  async remove(permission_id: number): Promise<void> {
    const per = await this.findById(permission_id);
    if (!per)
      throw new BadRequestException(
        `Permission with id ${permission_id} does not exist`,
      );
    this.perRepo.remove(per);
  }
}
