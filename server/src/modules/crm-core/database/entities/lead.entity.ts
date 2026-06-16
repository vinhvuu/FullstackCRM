import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('crm_leads')
export class CrmLead {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  @Column({ type: 'bigint', unsigned: true })
  owner_id: number;

  @Column({ type: 'varchar', length: 150 })
  name: string;

  @Column({ type: 'varchar', length: 200, nullable: true })
  company: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  email: string | null;

  @Column({ type: 'varchar', length: 20, nullable: true })
  phone: string | null;

  @Column({ type: 'varchar', length: 50, nullable: true })
  source: string | null;

  @Column({ type: 'enum', enum: ['new', 'contacted', 'qualified', 'lost'], default: 'new' })
  status: 'new' | 'contacted' | 'qualified' | 'lost';

  @Column({ type: 'int', default: 0 })
  score: number;

  @Column({ type: 'boolean', default: false })
  in_pool: boolean;

  @Column({ type: 'int', default: 0 })
  order: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column({ type: 'bigint', unsigned: true, nullable: true })
  created_by: number | null;

  @Column({ type: 'bigint', unsigned: true, nullable: true })
  updated_by: number | null;

  @Column({ type: 'datetime', nullable: true })
  deleted_at: Date | null;
}