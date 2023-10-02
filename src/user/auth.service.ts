import { BadRequestException, Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
  ) {}
  async login(email: string, password: string): Promise<any> {
    const user = await this.userService.findByEmail(email);
    if (!user)
      throw new BadRequestException(`User with email ${email} does not exist`);
    if (user.password !== password)
      throw new BadRequestException(`You have entered the wrong password `);
    const payload = {
      id: user.id,
      username: user.username,
      email: user.email,
    };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
