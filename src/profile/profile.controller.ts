import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { JwtAuthGuard } from 'src/shared/guards/jwt-auth.guard';
import { GetUser } from './decorators/user-data.decorator';

import { Rol } from 'src/constants/constants';
import { Roles } from 'src/shared/decorators/roles.decorator';
import { RolesGuard } from 'src/shared/guards/roles-auth.guard';

export interface User {
  userId: string;
  username: string;
  rol: Rol;
}

@Controller('profile')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get('/me')
  @Roles(Rol.ADMIN, Rol.ASISTENTE, Rol.MECANICO)
  async getProfile(@GetUser() user: User) {
    return await this.profileService.getProfile(user.userId);
  }

  @Patch('/me/update')
  @Roles(Rol.ADMIN, Rol.ASISTENTE, Rol.MECANICO)
  async updateProfile(@GetUser() user: User, @Body() updateProfileDto: any) {
    return await this.profileService.updateProfile(
      user.userId,
      updateProfileDto,
    );
  }

  @Delete('/me/delete')
  @Roles(Rol.ADMIN, Rol.ASISTENTE, Rol.MECANICO)
  deleteProfile(@GetUser() user: User) {
    return this.profileService.deleteAccount(user.userId);
  }
}
