import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Controller('account')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Post()
  @Get("/profile/:id")
  getProfile(@Param('id') id: string, @Req() req: Request) {
    //return this.profileService.findAll();
  }

  @Patch('/profile/:id/update')
  update(@Param('id') id: string, @Body() updateProfileDto: UpdateProfileDto) {
    //return this.profileService.update(+id, updateProfileDto);
  }

  @Delete('/profile/:id/delete')
  remove(@Param('id') id: string) {
    //return this.profileService.remove(+id);
  }
}
