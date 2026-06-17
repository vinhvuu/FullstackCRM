import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('crm_activities')
export class CrmActivity {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  @Column({ type: 'bigint', unsigned: true })
  owner_id: number;

  @Column({ type: 'enum', enum: ['call', 'email', 'meeting', 'task'] })
  type: 'call' | 'email' | 'meeting' | 'task';

  @Column({ type: 'varchar', length: 200 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ type: 'bigint', unsigned: true, nullable: true })
  lead_id: number | null;

  @Column({ type: 'bigint', unsigned: true, nullable: true })
  contact_id: number | null;

  @Column({ type: 'bigint', unsigned: true, nullable: true })
  company_id: number | null;

  @Column({ type: 'bigint', unsigned: true, nullable: true })
  deal_id: number | null;

  @Column({ type: 'enum', enum: ['lead', 'contact', 'company', 'deal', 'quote'], nullable: true })
  related_type: 'lead' | 'contact' | 'company' | 'deal' | 'quote' | null;

  @Column({ type: 'bigint', unsigned: true, nullable: true })
  related_id: number | null;

  @Column({ type: 'datetime', nullable: true })
  due_date: Date | null;

  @Column({ type: 'datetime', nullable: true })
  remind_at: Date | null;

  @Column({ type: 'enum', enum: ['pending', 'completed', 'overdue'], default: 'pending' })
  status: 'pending' | 'completed' | 'overdue';

  @Column({ type: 'enum', enum: ['high', 'medium', 'low'], nullable: true })
  priority: 'high' | 'medium' | 'low' | null;

  @Column({ type: 'datetime', nullable: true })
  completed_at: Date | null;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column({ type: 'datetime', nullable: true })
  deleted_at: Date | null;
}