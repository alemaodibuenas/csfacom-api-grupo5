import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Projeto {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  imagem: string;

  @Column({ length: 500, nullable: false })
  title: string;

  @Column({ length: 500, nullable: false })
  description: string;

  @Column({ length: 10000 })
  texto: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;
}
