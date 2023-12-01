import { Projeto } from 'src/projetos/entities/projeto.entity';
import { Usuario } from 'src/usuario/entities/usuario.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
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

  @Column({ length: 15 })
  telefone: string;

  @Column({ length: 100 })
  rga?: string;

  @Column()
  foto?: string;

  @ManyToMany(() => Projeto, (projeto) => projeto.participantes)
  @JoinTable()
  projetos?: Projeto[];

  @OneToOne(() => Usuario, (usuario) => usuario)
  usuario?: Usuario;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;
}
