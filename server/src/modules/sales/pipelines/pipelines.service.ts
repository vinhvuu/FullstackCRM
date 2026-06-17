import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';

export interface CreatePipelineDto {
  name: string;
  stages: {
    id: string;
    label: string;
    color: string;
    probability: number;
  }[];
}

export interface UpdatePipelineDto {
  name?: string;
  stages?: {
    id: string;
    label: string;
    color: string;
    probability: number;
  }[];
}

@Injectable()
export class PipelinesService {
  private readonly logger =
    new Logger(PipelinesService.name);

  private pipelines: any[] = [
    {
      id: 1,
      name: 'Default Pipeline',
      stages: [
        {
          id: 'lead',
          label: 'Lead',
          color: '#6c757d',
          probability: 10,
        },
        {
          id: 'qualified',
          label: 'Qualified',
          color: '#0d6efd',
          probability: 30,
        },
        {
          id: 'proposal',
          label: 'Proposal',
          color: '#fd7e14',
          probability: 60,
        },
        {
          id: 'negotiation',
          label: 'Negotiation',
          color: '#198754',
          probability: 80,
        },
        {
          id: 'won',
          label: 'Won',
          color: '#20c997',
          probability: 100,
        },
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  /**
   * T3.1. GET /api/pipelines
   */
  async list(): Promise<any> {
    return this.pipelines;
  }

  /**
   * T3.2. POST /api/pipelines
   */
  async create(
    dto: CreatePipelineDto,
  ): Promise<any> {
    if (!dto.name?.trim()) {
      throw new BadRequestException(
        'PIPELINE_NAME_REQUIRED',
      );
    }

    const pipeline = {
      id:
        this.pipelines.length > 0
          ? Math.max(
              ...this.pipelines.map(
                (p) => p.id,
              ),
            ) + 1
          : 1,
      name: dto.name,
      stages: dto.stages || [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.pipelines.push(pipeline);

    this.logger.log(
      `Pipeline created: ${pipeline.name}`,
    );

    return pipeline;
  }

  /**
   * T3.3. PUT /api/pipelines/:id
   */
  async update(
    id: number,
    dto: UpdatePipelineDto,
  ): Promise<any> {
    const pipeline =
      this.pipelines.find(
        (p) => p.id === Number(id),
      );

    if (!pipeline) {
      throw new NotFoundException(
        'PIPELINE_NOT_FOUND',
      );
    }

    if (dto.name !== undefined) {
      pipeline.name = dto.name;
    }

    if (dto.stages !== undefined) {
      pipeline.stages = dto.stages;
    }

    pipeline.updatedAt = new Date();

    return pipeline;
  }

  /**
   * T3.4. DELETE /api/pipelines/:id
   */
  async delete(
    id: number,
  ): Promise<any> {
    const index =
      this.pipelines.findIndex(
        (p) => p.id === Number(id),
      );

    if (index === -1) {
      throw new NotFoundException(
        'PIPELINE_NOT_FOUND',
      );
    }

    this.pipelines.splice(index, 1);

    return {
      success: true,
      message:
        'Pipeline deleted successfully',
    };
  }
}
