import { ApiProperty } from '@nestjs/swagger';
import { UserDto } from '../../users/dto/user.dto';


export class LoginResponse {
    @ApiProperty()
    user: UserDto;
}
