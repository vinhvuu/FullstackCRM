// src/iam/users/entities/user-session.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('iam_user_sessions')
export class IamUserSession {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id' })
  userId: number;

  @Column({ name: 'refresh_token_hash' })
  refreshTokenHash: string;

  @Column({ name: 'expires_at' })
  expiresAt: Date;

  @Column({ name: 'user_agent', nullable: true })
  userAgent: string;

  @Column({ name: 'ip_address', nullable: true })
  ipAddress: string;

  @Column({ default: false })
  revoked: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}