import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/createRole.dto';
import { UpdateRoleDto } from './dto/updateRole.dto';
import { AuthGuard } from './guard/auth.guard';
import { AccessInterceptor } from './guard/access.interceptor';

@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @UseGuards(AuthGuard)
  @UseInterceptors(new AccessInterceptor('create_role'))
  @Post()
  async create(@Body() createRole: CreateRoleDto) {
    await this.roleService.create(createRole);
    return 'this action created new role';
  }
  @UseGuards(AuthGuard)
  @UseInterceptors(new AccessInterceptor('find_all_role'))
  @Get()
  findAll() {
    return this.roleService.findAll();
  }
  @UseGuards(AuthGuard)
  @UseInterceptors(new AccessInterceptor('find_role'))
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.roleService.findById(id);
  }
  @UseGuards(AuthGuard)
  @UseInterceptors(new AccessInterceptor('find_per_role'))
  @Get(':id/findPer')
  async findPer(@Param('id') id: number) {
    const role = await this.roleService.findById(id);
    return this.roleService.findPerId(role.role_id);
  }

  //Update role
  @UseGuards(AuthGuard)
  @UseInterceptors(new AccessInterceptor('update_role'))
  @Patch(':id')
  async update(@Param('id') id: number, @Body() updateRole: UpdateRoleDto) {
    await this.roleService.update(id, updateRole);
    return 'update complete';
  }

  //Add new permission to role
  @UseGuards(AuthGuard)
  @UseInterceptors(new AccessInterceptor('add_per_role'))
  @Patch(':id/addPer')
  async addPer(@Param('id') id: number, @Body() updateRole: UpdateRoleDto) {
    await this.roleService.addPer(id, updateRole);
    return `this action add new Permission for role `;
  }

  //Remove role
  @UseGuards(AuthGuard)
  @UseInterceptors(new AccessInterceptor('remove_role'))
  @Delete(':id')
  async remove(@Param('id') id: number) {
    await this.roleService.remove(id);
    return `this action remove  role`;
  }

  //Remove one Permission from Role
  @UseGuards(AuthGuard)
  @UseInterceptors(new AccessInterceptor('remove_1_per_role'))
  @Patch(':id/removePer')
  async removePer(@Param('id') id: number, @Body() updateRole: UpdateRoleDto) {
    await this.roleService.removePer(id, updateRole);
    return `this action remove Permission from role ${updateRole.role_name}`;
  }
  //Remove all Permission from Role
  @UseGuards(AuthGuard)
  @UseInterceptors(new AccessInterceptor('remove_pers_role'))
  @Patch(':id/removeAllPer')
  async removeAllPer(@Param('id') id: number) {
    await this.roleService.removeAllPer(id);
    return `this action remove All Permission from role`;
  }
}
