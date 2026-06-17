import { ProductsService, CreateProductDto, UpdateProductDto } from './products.service';
export declare class ProductsController {
    private readonly productsService;
    constructor(productsService: ProductsService);
    create(dto: CreateProductDto): Promise<any>;
    list(query: any): Promise<any>;
    findById(id: number): Promise<any>;
    update(id: number, dto: UpdateProductDto): Promise<any>;
    delete(id: number): Promise<any>;
    searchForPicker(query: string, limit?: number): Promise<any>;
}
