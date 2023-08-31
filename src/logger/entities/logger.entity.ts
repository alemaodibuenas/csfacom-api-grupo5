import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('log')
export class Logger {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  public context: string;

  @Column('text')
  public message: string;

  @Column()
  public level: string;

  @CreateDateColumn()
  created_at: Date;
}
