// src/iam/invitations/entities/invitation.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('iam_invitations')
export class IamInvitation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  role: 'admin' | 'user';

  @Column({ name: 'token_hash' })
  tokenHash: string;

  @Column({ name: 'expires_at' })
  expiresAt: Date;

  @Column({ default: 'pending' })
  status: 'pending' | 'accepted' | 'expired' | 'revoked';

  @Column({ name: 'invited_by' })
  invitedBy: number;

  @Column({ name: 'accepted_at', nullable: true })
  acceptedAt: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}