import { IsNotEmpty, IsString } from "class-validator";

export class loginUserDto {
    @IsString()   
    @IsNotEmpty()
    user_name: string;

    @IsString()   
    @IsNotEmpty()
    password: string;
}
