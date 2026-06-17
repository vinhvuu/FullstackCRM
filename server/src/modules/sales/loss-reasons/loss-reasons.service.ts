import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';

export interface CreateLossReasonDto {
  label: string;
}

export interface UpdateLossReasonDto {
  label?: string;
}

@Injectable()
export class LossReasonsService {
  private readonly logger = new Logger(
    LossReasonsService.name,
  );

  private lossReasons: any[] = [
    {
      id: 1,
      label: 'Giá quá cao',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 2,
      label: 'Chọn đối thủ cạnh tranh',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 3,
      label: 'Không có ngân sách',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  /**
   * T3.32. GET /api/loss-reasons
   */
  async list(): Promise<any> {
    return this.lossReasons;
  }

  /**
   * T3.33. POST /api/loss-reasons
   */
  async create(
    dto: CreateLossReasonDto,
  ): Promise<any> {
    if (!dto.label?.trim()) {
      throw new BadRequestException(
        'LOSS_REASON_LABEL_REQUIRED',
      );
    }

    const exists =
      this.lossReasons.find(
        (x) =>
          x.label.toLowerCase() ===
          dto.label.toLowerCase(),
      );

    if (exists) {
      throw new BadRequestException(
        'LOSS_REASON_ALREADY_EXISTS',
      );
    }

    const lossReason = {
      id:
        this.lossReasons.length > 0
          ? Math.max(
              ...this.lossReasons.map(
                (x) => x.id,
              ),
            ) + 1
          : 1,
      label: dto.label,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.lossReasons.push(lossReason);

    this.logger.log(
      `Loss reason created: ${dto.label}`,
    );

    return lossReason;
  }

  /**
   * T3.34. PUT /api/loss-reasons/:id
   */
  async update(
    id: number,
    dto: UpdateLossReasonDto,
  ): Promise<any> {
    const lossReason =
      this.lossReasons.find(
        (x) => x.id === Number(id),
      );

    if (!lossReason) {
      throw new NotFoundException(
        'LOSS_REASON_NOT_FOUND',
      );
    }

    if (dto.label !== undefined) {
      lossReason.label = dto.label;
    }

    lossReason.updatedAt = new Date();

    return lossReason;
  }

  /**
   * T3.35. DELETE /api/loss-reasons/:id
   */
  async delete(
    id: number,
  ): Promise<any> {
    const index =
      this.lossReasons.findIndex(
        (x) => x.id === Number(id),
      );

    if (index === -1) {
      throw new NotFoundException(
        'LOSS_REASON_NOT_FOUND',
      );
    }

    this.lossReasons.splice(index, 1);

    return {
      success: true,
      message:
        'Loss reason deleted successfully',
    };
  }
}
