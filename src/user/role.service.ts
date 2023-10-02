import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/createRole.dto';
import { UpdateRoleDto } from './dto/updateRole.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder, getManager } from 'typeorm';
import { Role } from './entities/role.entity';
import { PerService } from './per.service';
import { Permission } from './entities/permission.entity';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role) private roleRepo: Repository<Role>,
    @InjectRepository(Permission) private perRepo: Repository<Permission>,
    private readonly perService: PerService,
  ) {}

  //Create new role
  async create(createRole: CreateRoleDto): Promise<void> {
    const check = await this.findByName(createRole.role_name);
    if (check)
      throw new BadRequestException(`Role ${createRole.role_name} is exist`);
    if (createRole.permission_id == null) {
      const role = this.roleRepo.create(createRole);
      await this.roleRepo.save(role);
    } else {
      const permission_id = createRole.permission_id;
      const per = await this.perRepo.findOneBy({ permission_id });
      if (!per) {
        throw new BadRequestException('Permission not found');
      }
      const role = this.roleRepo.create(createRole);
      role.permissions = [per];
      await this.roleRepo.save(role);
    }
  }
  //Find all role
  findAll() {
    return this.roleRepo.find();
  }

  //Find role by id
  findById(role_id: number): Promise<Role | null> {
    const role = this.roleRepo.findOneBy({ role_id });
    if (!role) return null;
    return role;
  }

  //Find role by name
  findByName(role_name: string): Promise<Role | null> {
    const role = this.roleRepo.findOneBy({ role_name });
    if (!role) return null;
    return role;
  }

  //Find Per_id of role
  async findPerId(role_id: number): Promise<number[] | null> {
    const role = await this.roleRepo.findOne({
      where: { role_id: role_id },
      relations: ['permissions'],
    });
    if (!role) {
      throw new BadRequestException(`Role with name ${role_id} not found.`);
    }
    if (!role.permissions)
      throw new BadRequestException(
        `role with id ${role_id} have not permission`,
      );
    const permissions = role.permissions.map(
      (permission) => permission.permission_id,
    );
    return permissions;
  }

  //Find Per_name of role
  async findPerName(role_id: number): Promise<string[] | null> {
    const role = await this.roleRepo.findOne({
      where: { role_id: role_id },
      relations: ['permissions'],
    });
    if (!role)
      throw new BadRequestException(`role with id ${role_id} not exist`);
    if (!role.permissions)
      throw new BadRequestException(
        `role with id ${role_id} have not permission`,
      );
    const permissions = role.permissions.map(
      (permission) => permission.permission_name,
    );
    return permissions;
  }

  //Update role
  async update(
    role_id: number,
    updateRole: UpdateRoleDto,
  ): Promise<Role | any> {
    const role = await this.findById(role_id);
    if (!role)
      throw new BadRequestException(`Role with id ${role_id} does not exist`);
    if (role.role_name === updateRole.role_name)
      throw new BadRequestException(`No change role name?`);
    const check = await this.findByName(updateRole.role_name);
    if (check)
      throw new BadRequestException(
        `Role with name ${updateRole.role_name} exist`,
      );
    Object.assign(role, updateRole);
    this.roleRepo.save(role);
  }

  //Add new Permission for Role
  async addPer(role_id: number, updateRole: UpdateRoleDto) {
    const role = await this.findById(role_id);
    if (!role)
      throw new BadRequestException(`Role with id ${role_id} does not exist`);
    const permission_id = updateRole.permission_id;
    const per = await this.perRepo.findOneBy({ permission_id });
    if (!per) {
      throw new BadRequestException('Permission not found');
    }
    const permissions = await this.findPerId(role.role_id);
    for (const i of permissions) {
      if (i == updateRole.permission_id)
        throw new BadRequestException('Permission exist');
    }
    await this.roleRepo
      .createQueryBuilder()
      .relation(Role, 'permissions')
      .of(role)
      .add(per);
  }

  // Remove Permission from Role
  async removePer(role_id: number, updateRole: UpdateRoleDto) {
    const role = await this.findById(role_id);
    if (!role)
      throw new BadRequestException(`Role with id ${role_id} does not exist`);
    const permission_id = updateRole.permission_id;
    const per = await this.perRepo.findOneBy({ permission_id });
    if (!per) {
      throw new BadRequestException('Permission not found');
    }
    const permissions = await this.findPerId(role.role_id);
    for (const i of permissions) {
      if (i != updateRole.permission_id)
        throw new BadRequestException('Permission is not exist');
    }
    await this.roleRepo
      .createQueryBuilder()
      .relation(Role, 'permissions')
      .of(role)
      .remove(per);
  }

  async removeAllPer(role_id: number) {
    const role = await this.findById(role_id);
    if (!role)
      throw new BadRequestException(`Role with id ${role_id} does not exist`);
    role.permissions = [];
    await this.roleRepo.save(role);
  }

  async remove(role_id: number): Promise<void> {
    const role = await this.findById(role_id);
    if (!role)
      throw new BadRequestException(`Role with id ${role_id} does not exist`);
    role.permissions = [];
    await this.roleRepo.save(role);
    role.users = [];
    await this.roleRepo.save(role);
    this.roleRepo.remove(role);
  }
}
