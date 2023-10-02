import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  BadRequestException,
  UseGuards,
  UseInterceptors,
  Req,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/createUser.dto';
import { UpdateUserDto } from './dto/updateUser.dto';
import { AuthGuard } from './guard/auth.guard';
import { AccessInterceptor } from './guard/access.interceptor';
import { LoginUserDto } from './dto/login.dto';
import { AuthService } from './auth.service';
import { User } from './entities/user.entity';
import { RoleService } from './role.service';
import { Role } from './entities/role.entity';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly roleService: RoleService,
    private readonly authService: AuthService,
  ) {}

  @Post('/login')
  async login(@Body() requestLogin: LoginUserDto) {
    return await this.authService.login(
      requestLogin.email,
      requestLogin.password,
    );
  }

  @UseGuards(AuthGuard)
  @UseInterceptors(new AccessInterceptor('create_user'))
  @Post()
  async create(@Body() createUser: CreateUserDto) {
    await this.userService.create(createUser);
    return 'this action created new user';
  }

  @UseGuards(AuthGuard)
  @UseInterceptors(new AccessInterceptor('get_user'))
  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @UseGuards(AuthGuard)
  @UseInterceptors(new AccessInterceptor('get_permission_user'))
  @Get(':id/permission')
  async getUserRoleById(@Param('id') userId: number) {
    return await this.userService.getUser_Permission(userId);
  }
  @UseGuards(AuthGuard)
  @UseInterceptors(new AccessInterceptor('update_user'))
  @Patch(':id')
  async update(@Param('id') id: number, @Body() updateUser: UpdateUserDto) {
    await this.userService.update(id, updateUser);
    return 'Update complete!';
  }

  @UseGuards(AuthGuard)
  @UseInterceptors(new AccessInterceptor('add_role_user'))
  @Patch(':id/addRole')
  async addRole(@Param('id') id: number, @Body() updateUser: UpdateUserDto) {
    await this.userService.addRole(id, updateUser);
    return 'add Role complete!';
  }

  @UseGuards(AuthGuard)
  @UseInterceptors(new AccessInterceptor('remove_role_user'))
  @Patch(':id/removeRole')
  async removeRole(@Param('id') id: number) {
    await this.userService.removeRole(id);
    return 'Remove role from user complete';
  }

  @UseGuards(AuthGuard)
  @UseInterceptors(new AccessInterceptor('delete_user'))
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.userService.remove(id);
  }

  @UseGuards(AuthGuard)
  @Get('/check_permission')
  async getPermission(@Req() request: Request) {
    const permission: string[] = request['permissions'];
    return permission;
  }

  @UseGuards(AuthGuard)
  @Get('/check_profile')
  async check_profile(@Req() request: Request) {
    const info = await request['user'];
    const user = await this.userService.findByEmail(info.email);
    const role_name = await this.userService.getUser_Role(user.id);
    const permission: string[] = await request['permissions'];
    const listper = permission.join(', ');
    return { user: user, role_name: role_name, permission: listper };
  }
}
