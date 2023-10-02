import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/createUser.dto';
import { UpdateUserDto } from './dto/updateUser.dto';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder, getManager } from 'typeorm';
import { RoleService } from './role.service';
import { Role } from './entities/role.entity';
import { Permission } from './entities/permission.entity';
import { PerService } from './per.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    private roleService: RoleService,
    private perService: PerService,
  ) {}
  async create(createUser: CreateUserDto): Promise<void> {
    const check_name = await this.findByUserName(createUser.username);
    if (check_name)
      throw new BadRequestException(`User ${check_name.username} exist`);
    const check_email = await this.findByEmail(createUser.email);
    if (check_email)
      throw new BadRequestException(`Email ${check_email.email} exist`);
    if (createUser.role_id == null) {
      const user = this.userRepo.create(createUser);
      this.userRepo.save(user);
    } else {
      const role = await this.roleService.findById(createUser.role_id);

      if (!role) {
        throw new BadRequestException('Role not found');
      }
      const user = this.userRepo.create(createUser);
      user.role = role;
      this.userRepo.save(user);
    }
  }

  findAll() {
    return this.userRepo.find();
  }

  findById(id: number): Promise<User | null> {
    const user = this.userRepo.findOneBy({ id });
    if (!user) return null;
    return user;
  }
  findByUserName(username: string): Promise<User | null> {
    const user = this.userRepo.findOneBy({ username });
    if (!user) return null;
    return user;
  }
  findByEmail(email: string): Promise<User | null> {
    const user = this.userRepo.findOneBy({ email });
    if (!user) return null;
    return user;
  }
  async getUser_Role(id_user: number): Promise<string | null> {
    const queryBuilder: SelectQueryBuilder<User> = this.userRepo
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.role', 'role')
      .where('user.id = :id', { id: id_user });
    const user = await queryBuilder.getOne();
    if (!user)
      throw new BadRequestException(`user with id ${id_user} not exist`);
    if (!user.role)
      throw new BadRequestException(`user with id ${id_user} have not role`);
    return user.role.role_name;
  }
  async getUser_Permission(id_user: number): Promise<string[] | null> {
    const queryBuilder: SelectQueryBuilder<User> = this.userRepo
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.role', 'role')
      .where('user.id = :id', { id: id_user });
    const user = await queryBuilder.getOne();
    if (!user)
      throw new BadRequestException(`user with id ${id_user} not exist`);
    if (!user.role)
      throw new BadRequestException(`user with id ${id_user} have not role`);
    const role_id = user.role.role_id;
    return await this.roleService.findPerName(role_id);
  }

  async update(id: number, updateUser: UpdateUserDto) {
    const user = await this.findById(id);
    if (!user)
      throw new BadRequestException(`User with id ${id} does not exist`);
    const check_name = await this.findByUserName(updateUser.username);
    if (check_name)
      throw new BadRequestException(`User ${check_name.username} exist`);
    const check_email = await this.findByEmail(updateUser.email);
    if (check_email)
      throw new BadRequestException(`Email ${check_email.email} exist`);
    Object.assign(user, updateUser);
    this.userRepo.save(user);
  }

  async addRole(id: number, updateUser: UpdateUserDto) {
    const user = await this.findById(id);
    if (!user)
      throw new BadRequestException(`User with id ${id} does not exist`);
    const role = await this.roleService.findById(updateUser.role_id);
    if (!role) {
      throw new BadRequestException('Role not found');
    }
    user.role = role;
    this.userRepo.save(user);
  }
  async removeRole(id: number) {
    const user = await this.findById(id);
    if (!user)
      throw new BadRequestException(`User with id ${id} does not exist`);
    user.role = null;
    this.userRepo.save(user);
  }
  async remove(id: number): Promise<void> {
    const user = await this.findById(id);
    if (!user)
      throw new BadRequestException(`User with id ${id} does not exist`);
    this.userRepo.remove(user);
  }
}
