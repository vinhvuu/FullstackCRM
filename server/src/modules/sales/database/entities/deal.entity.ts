import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('sales_deals')
export class SalesDeal {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  @Column({ type: 'bigint', unsigned: true })
  owner_id: number;

  @Column({ type: 'bigint', unsigned: true, nullable: true })
  pipeline_id: number | null;

  @Column({ type: 'bigint', unsigned: true, nullable: true })
  lead_id: number | null;

  @Column({ type: 'bigint', unsigned: true, nullable: true })
  contact_id: number | null;

  @Column({ type: 'bigint', unsigned: true, nullable: true })
  company_id: number | null;

  @Column({ type: 'varchar', length: 200 })
  title: string;

  @Column({ type: 'decimal', precision: 18, scale: 2, default: 0 })
  value: number;

  @Column({ type: 'enum', enum: ['VND', 'USD'], default: 'VND' })
  currency: 'VND' | 'USD';

  @Column({ type: 'varchar', length: 50, default: 'lead' })
  stage: string;

  @Column({ type: 'int', default: 0 })
  probability: number;

  @Column({ type: 'enum', enum: ['open', 'won', 'lost'], default: 'open' })
  status: 'open' | 'won' | 'lost';

  @Column({ type: 'date', nullable: true })
  expected_close_date: Date | null;

  @Column({ type: 'datetime', nullable: true })
  won_at: Date | null;

  @Column({ type: 'datetime', nullable: true })
  lost_at: Date | null;

  @Column({ type: 'bigint', unsigned: true, nullable: true })
  loss_reason_id: number | null;

  @Column({ type: 'varchar', length: 200, nullable: true })
  competitor: string | null;

  @Column({ type: 'datetime', nullable: true })
  stage_entered_at: Date | null;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column({ type: 'datetime', nullable: true })
  deleted_at: Date | null;
}