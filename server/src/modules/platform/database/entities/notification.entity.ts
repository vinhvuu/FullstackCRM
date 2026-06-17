import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('platform_notifications')
export class PlatformNotification {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  @Column({ type: 'bigint', unsigned: true })
  user_id: number;

  @Column({ type: 'enum', enum: ['mention', 'assignment', 'reminder', 'deal_stage', 'quote_accepted', 'system'] })
  type: 'mention' | 'assignment' | 'reminder' | 'deal_stage' | 'quote_accepted' | 'system';

  @Column({ type: 'varchar', length: 200 })
  title: string;

  @Column({ type: 'text', nullable: true })
  body: string | null;

  @Column({ type: 'varchar', length: 500, nullable: true })
  link: string | null;

  @Column({ type: 'boolean', default: false })
  is_read: boolean;

  @CreateDateColumn()
  created_at: Date;
}