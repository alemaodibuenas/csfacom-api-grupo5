import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Noticia {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 500 })
  image: string;

  @Column({ length: 500, nullable: false })
  title: string;

  @Column({ length: 500 })
  text: string;

  @Column({ unique: true })
  url: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;
}

///url não vai receber
