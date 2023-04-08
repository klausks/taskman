import { Request } from 'express';
import { User } from '../../users/entities/user.entity';

export interface TokenPayload {
    userId: number;
}

export interface ExpirationJwtCustom {
    expiresIn: string | number;
}

export interface RequestWithUser extends Request {
    user: User;
}
