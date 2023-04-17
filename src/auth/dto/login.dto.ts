import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsEmail(
    { allow_display_name: false },
    { message: 'Você precisa inserir uma email no formato correto!' },
  )
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  password: string;
}
