import RestaurantImageModel from "../../database/models/restaurant-images-model";
import RestaurantImageRegisterDto from "../../dtos/restaurant/restaurant-image-register-dto";
import { Mapper } from "../../mapper/mapper";
import { BaseRepository } from "../base-repositoty";

export default class RestaurantImagesRepository extends BaseRepository{
    private _restaurantImagesTable: string  = '[dbo].[luxury_restaurant_images]';

    public async insertImageAsync(imageModel: RestaurantImageModel){
        await this.insertAsync(imageModel ,this._restaurantImagesTable);
    }

    public async insertImagesAsync(imagesModels: Array<RestaurantImageRegisterDto>){
        await this.insertAsync(imagesModels, this._restaurantImagesTable);
    }

    public async getImagesByRestaurantId(restaurantId: string) : Promise<Array<RestaurantImageModel>>{
        const result = await this.instaceDataBaseContext.knexContext
            .select()
            .from(this._restaurantImagesTable)
            .where({RestaurantId: restaurantId});        

        return Mapper.mapperList<any, RestaurantImageModel>(result, RestaurantImageModel);
    }

    public async getImageById(imageId: number): Promise<RestaurantImageModel>{
        const result = await this.instaceDataBaseContext.knexContext
            .select()
            .from(this._restaurantImagesTable)
            .where({Id: imageId})
            .first();

        if(!result)
            return new RestaurantImageModel();
        
        return Mapper.mapper<any, RestaurantImageModel>(result, RestaurantImageModel);
    }

    public async deleteImageById(imageId: number): Promise<void>{
        await this.instaceDataBaseContext.knexContext(this._restaurantImagesTable)
            .where({Id: imageId})
            .del();
    }
}