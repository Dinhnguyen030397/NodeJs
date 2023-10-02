import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Role } from './entities/role.entity';
import { RoleService } from './role.service';
import { RoleController } from './role.controller';
import { Permission } from './entities/permission.entity';
import { PerController } from './per.controller';
import { PerService } from './per.service';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from 'src/constants';
import { AuthService } from './auth.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Role, Permission]),
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [UserController, RoleController, PerController],
  providers: [UserService, RoleService, PerService, AuthService],
  exports: [UserService],
})
export class UserModule {}
