import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { User } from './user.entity';
import { Permission } from './permission.entity';

@Entity()
export class Role {
  @PrimaryGeneratedColumn()
  role_id: number;
  @Column()
  role_name: string;
  @OneToMany(() => User, (user) => user.role)
  users: User[];
  @ManyToMany(() => Permission)
  @JoinTable()
  permissions: Permission[];
}
