import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { Public } from '../../../common/decorators/public.decorator';
import { JwtGuard } from '../../../common/guards/jwt.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { UsersService, CreateUserDto, AdminUpdateUserDto, ResetPasswordDto } from './users.service';

@Controller('users')
@UseGuards(JwtGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Roles('admin')
  list(@Query() query: any) {
    return this.usersService.list(query);
  }

  @Get(':id')
  findById(@Param('id') id: number, @CurrentUser() user: any) {
    return this.usersService.findById(id, user.id, user.role);
  }

  @Post()
  @Roles('admin')
  create(@Body() dto: CreateUserDto) {
    return this.usersService.create(dto);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() dto: AdminUpdateUserDto, @CurrentUser() user: any) {
    return this.usersService.update(id, dto, user.id, user.role);
  }

  @Delete(':id')
  @Roles('admin')
  delete(@Param('id') id: number) {
    return this.usersService.delete(id);
  }

  @Post(':id/reset-password')
  @Roles('admin')
  adminResetPassword(@Param('id') id: number, @Body() dto: ResetPasswordDto) {
    return this.usersService.adminResetPassword(id, dto);
  }

  @Post(':id/lock')
  @Roles('admin')
  lock(@Param('id') id: number) {
    return this.usersService.lock(id);
  }

  @Post(':id/unlock')
  @Roles('admin')
  unlock(@Param('id') id: number) {
    return this.usersService.unlock(id);
  }
}