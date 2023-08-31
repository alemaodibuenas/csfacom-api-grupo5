import { Usuario } from 'src/usuario/entities/usuario.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Pessoa {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 500, nullable: false })
  nome: string;

  @Column({ length: 255 })
  endereco: string;

  @Column({ length: 11 })
  telefone: string;

  @Column({ length: 255 })
  documento: string;

  @Column({ length: 255 })
  tipoDocumentoo: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;

  @OneToOne(() => Usuario, (usuario: Usuario) => usuario)
  usuario?: Usuario;
}
