import { Request } from 'express';
import { Usuario } from 'src/usuario/entities/usuario.entity';

interface RequestWithUser extends Request {
  user: Usuario;
}

export default RequestWithUser;
