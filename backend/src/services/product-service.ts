import ProductImageModel from "../database/models/product-images-model";
import { ProductModel } from "../database/models/product-model";
import ProductFilterDto from "../dtos/product/product-filter-dto";
import ProductImageDto from "../dtos/product/product-image-dto";
import ProductImageRegisterDto from "../dtos/product/product-image-register-dto";
import { RegisterProductDto } from "../dtos/product/register-product";
import { BadRequestError } from "../errors/bad-request-error";
import { NotFoundError } from "../errors/not-found-error";
import { Mapper } from "../mapper/mapper";
import ProductImagesRepository from "../repository/product/product-images-repository";
import { ProductRepository } from "../repository/product/product-repository";
import AppSettingsService from "../utils/app-settings/app-settings-service";
import AppSettingsModel from "../utils/app-settings/models/app-settings-model";

export class ProductService{
    private _appSettings: AppSettingsModel;
    private _productRepository: ProductRepository;
    private _productImagesRepository: ProductImagesRepository;

    constructor(){
        this._appSettings =  AppSettingsService.getInstace().getAppSettings();
        this._productRepository = new ProductRepository();
        this._productImagesRepository = new ProductImagesRepository();
    }

    public async registerProductAsyn(product: RegisterProductDto) : Promise<void>{
        const productEntity = Mapper.mapper<RegisterProductDto, ProductModel>(product, ProductModel);
        
        productEntity.generateId();

        await this._productRepository.insertProductAsync(productEntity);
    }

    public async updateProductAsyn(){

    }

    public async deleteProductByIdAsyn(){

    }

    public async getProductByIdAsyn(productId: string){
        if(!productId)
            throw new BadRequestError('Parametro esta vazio.');

        const productEntity = await this._productRepository.getProductByIdAsync(productId);

        return Mapper.mapper<ProductModel, RegisterProductDto>(productEntity, RegisterProductDto);
    }

    public async getProductsByRestaurantIdAsync(restaurantId: string){
        if(!restaurantId)
            throw new BadRequestError('Parametro esta vazio.');

        const productEntity = await this._productRepository.getProductsByRestaurantIdAsync(restaurantId);

        return Mapper.mapperList<ProductModel, RegisterProductDto>(productEntity, RegisterProductDto);
    }

    public async getProductsByFilterAsync(filter: ProductFilterDto){
        const productEntity = await this._productRepository.getProductsByFilterAsync(filter);

        return Mapper.mapperList<ProductModel, RegisterProductDto>(productEntity, RegisterProductDto);
    }

    public async getProductImages(productId: string){
        if(!productId)
            throw new BadRequestError('Esta faltando algum parametro requerido.');

        const images = await this._productImagesRepository.getImagesByProductId(productId);

        return Mapper.mapperList<ProductImageModel, ProductImageDto>(images, ProductImageModel);
    }

    public async getProductImage(imageId: number){
        if(!imageId)
            throw new BadRequestError('Esta faltando algum parametro requerido.');

        const image = await this._productImagesRepository.getImageById(imageId);

        if(!image.Id)
            throw new NotFoundError('Imagem não foi encontrada');

        return Mapper.mapper<ProductImageModel, ProductImageDto>(image, ProductImageDto);
    }

    public async resgisterProductImagesAsync(productImages: Array<ProductImageRegisterDto>){
        await this._productImagesRepository.insertImagesAsync(productImages);
    }

    public async deleteProductImageAsync(imageId: number): Promise<void>{
        if(!imageId)
            throw new BadRequestError('Esta faltando algum parametro requerido.');

        await this._productImagesRepository.deleteImageById(imageId);
    }
}