import ProductImageModel from "../../database/models/product-images-model";
import ProductImageRegisterDto from "../../dtos/product/product-image-register-dto";
import { Mapper } from "../../mapper/mapper";
import { BaseRepository } from "../base-repositoty";

export default class ProductImagesRepository extends BaseRepository{
    private _productImagesTable: string  = '[dbo].[luxury_product_images]';

    public async insertImageAsync(imageModel: ProductImageModel){
        await this.insertAsync(imageModel ,this._productImagesTable);
    }

    public async insertImagesAsync(imagesModels: Array<ProductImageRegisterDto>){
        await this.insertAsync(imagesModels, this._productImagesTable);
    }

    public async getImagesByProductId(productId: string) : Promise<Array<ProductImageModel>>{
        const result = await this.instaceDataBaseContext.knexContext
            .select()
            .from(this._productImagesTable)
            .where({ProductId: productId});        

        return Mapper.mapperList<any, ProductImageModel>(result, ProductImageModel);
    }

    public async getImageById(imageId: number): Promise<ProductImageModel>{
        const result = await this.instaceDataBaseContext.knexContext
            .select()
            .from(this._productImagesTable)
            .where({Id: imageId})
            .first();

        if(!result)
            return new ProductImageModel();
        
        return Mapper.mapper<any, ProductImageModel>(result, ProductImageModel);
    }

    public async deleteImageById(imageId: number): Promise<void>{
        await this.instaceDataBaseContext.knexContext(this._productImagesTable)
            .where({Id: imageId})
            .del();
    }
}