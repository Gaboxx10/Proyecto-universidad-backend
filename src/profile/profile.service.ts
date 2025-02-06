import { Injectable } from '@nestjs/common';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class ProfileService {

  findAll() {
    return `This action returns all profile`;
  }

  async findMyPerfilById(id: string) {
    return `This action returns a #${id} profile`;
  }

  async updateUser(id: number, updateProfileDto: UpdateProfileDto) {
    return `This action updates a #${id} profile`;
  }

  deleteUser(id: number) {
    return `This action removes a #${id} profile`;
  }
}
