import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../providers/prisma.service';
import { encryptPassword } from '../util/encrypt-password.util';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}
  async create(createUserDto: CreateUserDto) {
    const encryptedPassword = await encryptPassword(createUserDto.password);

    return this.prisma.user
      .create({
        data: { ...createUserDto, password: encryptedPassword },
      })
      .catch(() => {
        throw new HttpException(
          'Já existe usuário com esse email',
          HttpStatus.BAD_REQUEST,
        );
      });
  }

  findAll() {
    return this.prisma.user.findMany();
  }

  findOne(id: number) {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return this.prisma.user.update({
      where: { id },
      data: updateUserDto,
    });
  }

  remove(id: number) {
    return this.prisma.user.delete({
      where: { id },
    });
  }

  findUserByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  emailExists(email: string): Promise<boolean> {
    return this.findUserByEmail(email).then((user) => !!user);
  }
}
