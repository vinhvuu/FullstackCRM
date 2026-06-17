// src/iam/audit/entities/audit-log.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('iam_audit_logs')
export class IamAuditLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id', nullable: true })
  userId: number | null;

  @Column({ name: 'user_name', nullable: true })
  userName: string | null;

  @Column()
  action: string;

  @Column({ name: 'entity_type' })
  entityType: string;

  @Column({ name: 'entity_id', nullable: true })
  entityId: number | null;

  @Column({ type: 'json', nullable: true })
  details: { before?: any; after?: any; meta?: any } | null;

  @Column({ name: 'ip_address', nullable: true })
  ipAddress: string | null;

  @Column({ name: 'user_agent', nullable: true })
  userAgent: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}