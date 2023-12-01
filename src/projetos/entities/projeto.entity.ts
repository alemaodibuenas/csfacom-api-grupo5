import { Pessoa } from 'src/pessoa/entities/pessoa.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Projeto {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  imagem: string;

  @Column({ length: 1000, nullable: false })
  title: string;

  @Column('text')
  description: string;

  @Column('text')
  texto: string;

  @ManyToMany(() => Pessoa, (pessoa) => pessoa.projetos)
  participantes: Pessoa[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;
}
