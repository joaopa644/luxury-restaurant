import { ProductModel } from "../../database/models/product-model";
import ProductFilterDto from "../../dtos/product/product-filter-dto";
import { Mapper } from "../../mapper/mapper";
import { BaseRepository } from "../base-repositoty";

export class ProductRepository extends BaseRepository{
    private _productTableName: string  = '[dbo].[luxury_product]';

    public async insertProductAsync(product: ProductModel): Promise<void>{
        await this.insertAsync(product, this._productTableName);
    }

    public async getProductByIdAsync(productId: string){
        const result = await this.instaceDataBaseContext.knexContext
            .select()
            .from(this._productTableName)
            .where({Id: productId})
            .first();
        
        return Mapper.mapper<any, ProductModel>(result, ProductModel);
    }

    public async getProductsByRestaurantIdAsync(restaurantId: string){
        const result = await this.instaceDataBaseContext.knexContext
            .select()
            .from(this._productTableName)
            .where({RestaurantId: restaurantId});
        
        return Mapper.mapperList<any, ProductModel>(result, ProductModel);
    }

    public async getProductsByFilterAsync(filter: ProductFilterDto){
        const result = await this.instaceDataBaseContext.knexContext
            .select()
            .from(this._productTableName)
            .where(this.buildProductFilter(filter));
        
        return Mapper.mapperList<any, ProductModel>(result, ProductModel);
    }

    public buildProductFilter(productFilter: ProductFilterDto): any{
        const filter = {};
        if(productFilter.BrandId)
            filter["BrandId"] = productFilter.BrandId;
        
        if(productFilter.CategoryId)
            filter["CategoryId"] = productFilter.CategoryId;

        if(productFilter.RestaurantId)
            filter["RestaurantId"] = productFilter.RestaurantId;

        return filter;
    }
}