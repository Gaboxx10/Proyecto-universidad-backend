import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { JwtAuthGuard } from 'src/shared/guards/jwt-auth.guard';
import { GetUser } from './decorators/user-data.decorator';
import { Rol } from 'src/constants/constants';

export interface User {
  userId: string;  
  username: string; 
  rol: Rol;
}


@Controller('profile')
@UseGuards(JwtAuthGuard)
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get("/me")
  async getProfile(@GetUser() user: User) {
    return await this.profileService.getProfile(user.userId);
  }

  @Patch('/me/update')
  async updateProfile(@GetUser() user: User, @Body() updateProfileDto: UpdateProfileDto) {
    return await this.profileService.updateProfile(user.userId, updateProfileDto);
  }

  @Delete('/profile/:id/delete')
  deleteProfile(@Param('id') id: string) {
    return this.profileService.deleteUser(+id);
  }


  
}
