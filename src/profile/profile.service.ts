import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UsuarioService } from 'src/usuario/usuario.service';
import { Errors } from 'src/shared/errors.service';
import { Modules } from 'src/constants/constants';

@Injectable()
export class ProfileService {
  constructor(
    private readonly userService: UsuarioService,
    private readonly errors: Errors,
  ) {}

  private entity = Modules.profile;

  async getProfile(id: string) {
    try {
      const user = await this.userService.findUserById(id);

      if (!user || user instanceof Error) {
        throw new NotFoundException('No se ha encontrado el usuario');
      }

      return user.data;
    } catch (error) {
      const errorData = this.errors.handleError(error, this.entity);
      return new HttpException(errorData, errorData.status);
    }
  }

  async updateProfile(id: string, updateProfileDto: any) {
    try {
      const profile = await this.getProfile(id);

      if (!profile || profile instanceof Error) {
        throw new NotFoundException('No se ha encontrado el usuario');
      }

      const updatedProfile = await this.userService.updateUser(id, updateProfileDto);
      return updatedProfile;
    } catch (error) {
      const errorData = this.errors.handleError(error, this.entity);
      return new HttpException(errorData, errorData.status);
    }
  }

  async deleteAccount(id: string) {
    try {
      const user = await this.userService.findUserById(id);
      if (!user || user instanceof Error) {
        throw new NotFoundException('No se ha encontrado el usuario');
      }

      const deletedUser = await this.userService.deleteUser(id);
      return deletedUser;
      
    } catch (error) {
      const errorData = this.errors.handleError(error, this.entity);
      return new HttpException(errorData, errorData.status);
    }
  }
}
