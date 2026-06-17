import {
  Injectable,
  Logger,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  ILike,
  IsNull,
  Repository,
} from 'typeorm';

import { SalesProduct } from '../database/entities/product.entity';

export interface CreateProductDto {
  code?: string;
  name: string;
  group?: string;
  unitPrice: number;
  unit?: string;
  currency?: 'VND' | 'USD';
  defaultTaxPct?: number;
  description?: string;
  isActive?: boolean;
}

export interface UpdateProductDto {
  code?: string;
  name?: string;
  group?: string;
  unitPrice?: number;
  unit?: string;
  currency?: 'VND' | 'USD';
  defaultTaxPct?: number;
  description?: string;
  isActive?: boolean;
}

@Injectable()
export class ProductsService {
  private readonly logger =
    new Logger(ProductsService.name);

  constructor(
    @InjectRepository(SalesProduct)
    private readonly productRepo: Repository<SalesProduct>,
  ) {}

  async create(
    dto: CreateProductDto,
  ): Promise<any> {
    if (dto.code) {
      const existed =
        await this.productRepo.findOne({
          where: {
            code: dto.code,
            deleted_at: IsNull(),
          },
        });

      if (existed) {
        throw new ConflictException(
          'PRODUCT_CODE_EXISTS',
        );
      }
    }

    const product =
      this.productRepo.create({
        code: dto.code ?? null,
        name: dto.name,
        group: dto.group ?? null,
        unit_price: dto.unitPrice,
        unit: dto.unit ?? null,
        currency:
          dto.currency ?? 'VND',
        default_tax_pct:
          dto.defaultTaxPct ?? 0,
        description:
          dto.description ?? null,
        is_active:
          dto.isActive ?? true,
      });

    return this.productRepo.save(
      product,
    );
  }

  async list(query: any): Promise<any> {
    const page =
      Number(query.page ?? 1);

    const limit =
      Number(query.limit ?? 20);

    const where: any = {
      deleted_at: IsNull(),
    };

    if (query.search) {
      where.name = ILike(
        `%${query.search}%`,
      );
    }

    const [items, total] =
      await this.productRepo.findAndCount({
        where,
        skip: (page - 1) * limit,
        take: limit,
        order: {
          created_at: 'DESC',
        },
      });

    return {
      items,
      total,
      page,
      limit,
    };
  }

  async findById(
    id: number,
  ): Promise<any> {
    const product =
      await this.productRepo.findOne({
        where: {
          id,
          deleted_at: IsNull(),
        },
      });

    if (!product) {
      throw new NotFoundException(
        'PRODUCT_NOT_FOUND',
      );
    }

    return product;
  }

  async update(
    id: number,
    dto: UpdateProductDto,
  ): Promise<any> {
    const product =
      await this.findById(id);

    if (
      dto.code &&
      dto.code !== product.code
    ) {
      const existed =
        await this.productRepo.findOne({
          where: {
            code: dto.code,
            deleted_at: IsNull(),
          },
        });

      if (existed) {
        throw new ConflictException(
          'PRODUCT_CODE_EXISTS',
        );
      }
    }

    Object.assign(product, {
      code:
        dto.code ??
        product.code,
      name:
        dto.name ??
        product.name,
      group:
        dto.group ??
        product.group,
      unit_price:
        dto.unitPrice ??
        product.unit_price,
      unit:
        dto.unit ??
        product.unit,
      currency:
        dto.currency ??
        product.currency,
      default_tax_pct:
        dto.defaultTaxPct ??
        product.default_tax_pct,
      description:
        dto.description ??
        product.description,
      is_active:
        dto.isActive ??
        product.is_active,
    });

    return this.productRepo.save(
      product,
    );
  }

  async delete(
    id: number,
  ): Promise<any> {
    const product =
      await this.findById(id);

    product.is_active = false;
    product.deleted_at =
      new Date();

    await this.productRepo.save(
      product,
    );

    return {
      success: true,
    };
  }

  async searchForPicker(
    query: string,
    limit = 10,
  ): Promise<any> {
    const items =
      await this.productRepo.find({
        where: {
          name: ILike(
            `%${query}%`,
          ),
          deleted_at: IsNull(),
        },
        take: limit,
      });

    return items.map(p => ({
      id: p.id,
      code: p.code,
      name: p.name,
      unitPrice:
        p.unit_price,
    }));
  }

  async isActive(
    id: number,
  ): Promise<boolean> {
    const product =
      await this.productRepo.findOne({
        where: {
          id,
          deleted_at: IsNull(),
        },
      });

    return !!product?.is_active;
  }
}
