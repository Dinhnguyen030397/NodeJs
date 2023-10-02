import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
@Entity()
export class Permission {
  @PrimaryGeneratedColumn()
  permission_id: number;
  @Column()
  permission_name: string;
}
