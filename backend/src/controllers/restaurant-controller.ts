import RestaurantImageModel from "../database/models/restaurant-images-model";
import RestaurantImageDto from "../dtos/restaurant/restaurant-image-dto";
import RestaurantImageRegisterDto from "../dtos/restaurant/restaurant-image-register-dto";
import RestaurantRegisterDto from "../dtos/restaurant/restaurant-register-dto";
import UpdateRestaurantDto from "../dtos/restaurant/update-restaurant-dto";
import { BaseError } from "../errors/base-error";
import RestaurantService from "../services/restaurant-service";

export default class RestaurantController{
    private _restaurantService: RestaurantService;

    constructor(){
        this._restaurantService = new RestaurantService();
    }

    public async registerRestaurantAsync(req: any, res: any) {
        const productDto = req.body as RestaurantRegisterDto;

        try{
            await this._restaurantService.registerRestaurantAsync(productDto);
            
            res.status(200).send({message:'Restaurante cadastrado com sucesso.'});
        }catch(err: any){
            if(err instanceof BaseError){
                res.status(err.status).json({message:err.message});
            }else{
                res.status(500).json({Error: err.message});
            }
        }
        
    }

    public async getRestaurantsAsync(req: any, res: any) {
        try{
            const restaurant = await this._restaurantService.getRestaurantsAsync();
            
            res.status(200).send({restaurants: restaurant});
        }catch(err: any){
            if(err instanceof BaseError){
                res.status(err.status).json({message:err.message});
            }else{
                res.status(500).json({Error: err.message});
            }
        }
        
    }

    public async updateRestaurantAsync(req: any, res: any) {
        const updateRestaurantDto = req.body as UpdateRestaurantDto;

        try{
            await this._restaurantService.updateRestaurantAsync(updateRestaurantDto);
            
            res.status(200).send({message:'Restaurante atualizado com sucesso.'});
        }catch(err: any){
            if(err instanceof BaseError){
                res.status(err.status).json({message:err.message});
            }else{
                res.status(500).json({Error: err.message});
            }
        }
        
    }

    public async getRestaurantImagesAsync(req: any, res: any) {
        const restaurantId = req.params.id;        

        try{
            const restaurantImages = await this._restaurantService.getRestaurantImages(restaurantId);
            
            res.status(200).send({restaurantImages: restaurantImages});
        }catch(err: any){
            if(err instanceof BaseError){
                res.status(err.status).json({message:err.message});
            }else{
                res.status(500).json({Error: err.message});
            }
        }
        
    }

    public async getRestaurantImageAsync(req: any, res: any) {
        const imageId = req.params.id;        

        try{
            const restaurantImage = await this._restaurantService.getRestaurantImage(imageId);
            
            res.status(200).send({restaurantImage: restaurantImage});
        }catch(err: any){
            if(err instanceof BaseError){
                res.status(err.status).json({message:err.message});
            }else{
                res.status(500).json({Error: err.message});
            }
        }
        
    }

    public async resgisterRestaurantImagesAsync(req: any, res: any){
        const restaurantImagesDto = req.body as Array<RestaurantImageRegisterDto>;

        try{
            await this._restaurantService.resgisterRestaurantImagesAsync(restaurantImagesDto);
            
            res.status(200).send({message:'Imagens cadastradas com sucesso.'});
        }catch(err: any){
            if(err instanceof BaseError){
                res.status(err.status).json({message:err.message});
            }else{
                res.status(500).json({Error: err.message});
            }
        }
    }

    public async deleteRestaurantImageAsync(req: any, res: any){
        const imageId = req.params.id;

        try{
            await this._restaurantService.deleteRestaurantImageAsync(imageId);
            
            res.status(200).send({message:'Imagem deletada com sucesso.'});
        }catch(err: any){
            if(err instanceof BaseError){
                res.status(err.status).json({message:err.message});
            }else{
                res.status(500).json({Error: err.message});
            }
        }
    }
}