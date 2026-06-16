import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('iam_invitations')
export class IamInvitation {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  @Column({ type: 'varchar', length: 255 })
  email: string;

  @Column({ type: 'bigint', unsigned: true })
  invited_by: number;

  @Column({ type: 'enum', enum: ['admin', 'user'] })
  role: 'admin' | 'user';

  @Column({ type: 'varchar', length: 64 })
  token: string;

  @Column({ type: 'enum', enum: ['pending', 'accepted', 'expired', 'revoked'], default: 'pending' })
  status: 'pending' | 'accepted' | 'expired' | 'revoked';

  @Column({ type: 'datetime' })
  expires_at: Date;

  @Column({ type: 'datetime', nullable: true })
  accepted_at: Date | null;

  @CreateDateColumn()
  created_at: Date;
}