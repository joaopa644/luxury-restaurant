import RestaurantImageModel from "../database/models/restaurant-images-model";
import { RestaurantModel } from "../database/models/restaurant-model";
import RestaurantImageDto from "../dtos/restaurant/restaurant-image-dto";
import RestaurantImageRegisterDto from "../dtos/restaurant/restaurant-image-register-dto";
import RestaurantRegisterDto from "../dtos/restaurant/restaurant-register-dto";
import UpdateRestaurantDto from "../dtos/restaurant/update-restaurant-dto";
import { BadRequestError } from "../errors/bad-request-error";
import { ConflictError } from "../errors/conflict-error";
import { NotFoundError } from "../errors/not-found-error";
import { Mapper } from "../mapper/mapper";
import RestaurantImagesRepository from "../repository/restaurant/restaurant-images-repository";
import RestaurantRepository from "../repository/restaurant/restaurant-repository";
import AppSettingsService from "../utils/app-settings/app-settings-service";
import AppSettingsModel from "../utils/app-settings/models/app-settings-model";

export default class RestaurantService{
    private _appSettings: AppSettingsModel;
    private _restaurantRepository: RestaurantRepository;
    private _restaurantImagesRepository: RestaurantImagesRepository;

    constructor(){
        this._appSettings = AppSettingsService.getInstace().getAppSettings();
        this._restaurantRepository = new RestaurantRepository();
        this._restaurantImagesRepository = new RestaurantImagesRepository();
    }

    public async registerRestaurantAsync(restaurantDto: RestaurantRegisterDto){
        const restaurantEntity = Mapper.mapper<RestaurantRegisterDto, RestaurantModel>(restaurantDto, RestaurantModel);

        if(!restaurantDto.Cnpj)
            throw new BadRequestError('O Cnpj é obrigatório.');
        
        const duplicateRestaurant = await this._restaurantRepository.getRestaurantByCnpj(restaurantEntity.Cnpj);

        if(duplicateRestaurant.length)
            throw new ConflictError('Restaurante já esta cadastrado.');

        restaurantEntity.generateId();
        
        await this._restaurantRepository.registerRestaurantAsync(restaurantEntity);
    }

    public async getRestaurantsAsync(): Promise<Array<RestaurantRegisterDto>> {
        const restaurants = await this._restaurantRepository.getRestaurantsAsync();        

        return Mapper.mapperList<RestaurantModel, RestaurantRegisterDto>(restaurants, RestaurantRegisterDto);
    }

    public async getRestaurantByIdAsync(idRestaurant: string): Promise<RestaurantRegisterDto>{
        const restaurant = await this._restaurantRepository.getRestaurantByIdAsync(idRestaurant);

        if(restaurant.Cnpj)
            throw new NotFoundError('Restaurante não encontrado');
        
        return Mapper.mapper<RestaurantModel, RestaurantRegisterDto>(restaurant, RestaurantRegisterDto);
    }

    public async updateRestaurantAsync(updateRestaurantDto: UpdateRestaurantDto): Promise<void>{
        const restaurantEntity = Mapper.mapper<UpdateRestaurantDto, RestaurantModel>(updateRestaurantDto, RestaurantModel);

        if(!restaurantEntity.validateRequiredProperty())
            throw new BadRequestError('Esta faltando algum parametro requerido.');

        await this._restaurantRepository.updateRestaurant(restaurantEntity);
    }

    public async getRestaurantImages(restaurantId: string){
        if(!restaurantId)
            throw new BadRequestError('Esta faltando algum parametro requerido.');

        const images = await this._restaurantImagesRepository.getImagesByRestaurantId(restaurantId);

        return Mapper.mapperList<RestaurantImageModel, RestaurantImageDto>(images, RestaurantImageDto);
    }

    public async getRestaurantImage(imageId: number){
        if(!imageId)
            throw new BadRequestError('Esta faltando algum parametro requerido.');

        const image = await this._restaurantImagesRepository.getImageById(imageId);

        if(!image.Id)
            throw new NotFoundError('Imagem não foi encontrada');

        return Mapper.mapper<RestaurantImageModel, RestaurantImageDto>(image, RestaurantImageDto);
    }

    public async resgisterRestaurantImagesAsync(restaurantImages: Array<RestaurantImageRegisterDto>){
        await this._restaurantImagesRepository.insertImagesAsync(restaurantImages);
    }

    public async deleteRestaurantImageAsync(imageId: number): Promise<void>{
        if(!imageId)
            throw new BadRequestError('Esta faltando algum parametro requerido.');

        await this._restaurantImagesRepository.deleteImageById(imageId);
    }
}