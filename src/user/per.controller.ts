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
import { PerService } from './per.service';
import { CreatePerDto } from './dto/createPer.dto';
import { UpdatePerDto } from './dto/updatePer.dto';
import { AuthGuard } from './guard/auth.guard';
import { AccessInterceptor } from './guard/access.interceptor';

@Controller('permission')
export class PerController {
  constructor(private readonly perService: PerService) {}
  //Create permission
  @UseGuards(AuthGuard)
  @UseInterceptors(new AccessInterceptor('create_permission'))
  @Post()
  async create(@Body() createPer: CreatePerDto) {
    await this.perService.create(createPer);
    return 'this action created new permission';
  }

  //Find all permission
  @UseGuards(AuthGuard)
  @UseInterceptors(new AccessInterceptor('find_1_permission'))
  @Get()
  findAll() {
    return this.perService.findAll();
  }

  //Find permission by id
  @UseGuards(AuthGuard)
  @UseInterceptors(new AccessInterceptor('find_permissions'))
  @Get(':id')
  findById(@Param('id') id: number) {
    return this.perService.findById(id);
  }

  //update permission
  @UseGuards(AuthGuard)
  @UseInterceptors(new AccessInterceptor('update_permission'))
  @Patch(':id')
  async update(@Param('id') id: number, @Body() updatePer: UpdatePerDto) {
    await this.perService.update(id, updatePer);
    return 'this action update permission complete'
  }

  //remove permission by id
  @UseGuards(AuthGuard)
  @UseInterceptors(new AccessInterceptor('delete_permission'))
  @Delete(':id')
  async remove(@Param('id') id: number) {
    await this.perService.remove(id);
    return 'this action delete permission complete'
  }
}
