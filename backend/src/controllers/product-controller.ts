import ProductFilterDto from "../dtos/product/product-filter-dto";
import ProductImageRegisterDto from "../dtos/product/product-image-register-dto";
import { RegisterProductDto } from "../dtos/product/register-product";
import { BaseError } from "../errors/base-error";
import { ProductService } from "../services/product-service";

export class ProductContoller {

    private _productService: ProductService;

    constructor() {
        this._productService = new ProductService();
    }


    public async registerProductAsync(req: any, res: any) {
        const productDto = req.body as RegisterProductDto;
        
        try{
            await this._productService.registerProductAsyn(productDto);
            
            res.status(200).send({message:'Produto cadastrado com sucesso.'});
        }catch(err: any){
            if(err instanceof BaseError){
                res.status(err.status).json({message:err.message});
            }else{
                res.status(500).json({Error: err.message});
            }
        }
    }

    public async updateProductAsync(req: any, res: any) {
        res.status(200).json({ message: 'Rota encontrada' });
    }

    public async deleteProductAsync(req: any, res: any) {
        res.status(200).json({ message: 'Rota encontrada' });
    }

    public async getProductByIdAsync(req: any, res: any) {
        const productId = req.params.id;
        
        try{
            const product = await this._productService.getProductByIdAsyn(productId);
            
            res.status(200).send({product: product});
        }catch(err: any){
            if(err instanceof BaseError){
                res.status(err.status).json({message:err.message});
            }else{
                res.status(500).json({Error: err.message});
            }
        }
    }

    public async getProducstByRestaurantIdAsync(req: any, res: any) {
        const restaurantId = req.params.id;
        
        try{
            const products = await this._productService.getProductsByRestaurantIdAsync(restaurantId);
            
            res.status(200).send({products: products});
        }catch(err: any){
            if(err instanceof BaseError){
                res.status(err.status).json({message:err.message});
            }else{
                res.status(500).json({Error: err.message});
            }
        }
    }

    public async getProducstByFilterAsync(req: any, res: any) {
        const restaurantId = req.body as ProductFilterDto;
        
        try{
            const products = await this._productService.getProductsByFilterAsync(restaurantId);
            
            res.status(200).send({products: products});
        }catch(err: any){
            if(err instanceof BaseError){
                res.status(err.status).json({message:err.message});
            }else{
                res.status(500).json({Error: err.message});
            }
        }
    }

    public async getProductImagesAsync(req: any, res: any) {
        const restaurantId = req.params.id;        

        try{
            const restaurantImages = await this._productService.getProductImages(restaurantId);
            
            res.status(200).send({restaurantImages: restaurantImages});
        }catch(err: any){
            if(err instanceof BaseError){
                res.status(err.status).json({message:err.message});
            }else{
                res.status(500).json({Error: err.message});
            }
        }
        
    }

    public async getProductImageAsync(req: any, res: any) {
        const imageId = req.params.id;        

        try{
            const restaurantImage = await this._productService.getProductImage(imageId);
            
            res.status(200).send({restaurantImage: restaurantImage});
        }catch(err: any){
            if(err instanceof BaseError){
                res.status(err.status).json({message:err.message});
            }else{
                res.status(500).json({Error: err.message});
            }
        }
        
    }

    public async resgisterProductImagesAsync(req: any, res: any){
        const restaurantImagesDto = req.body as Array<ProductImageRegisterDto>;

        try{
            await this._productService.resgisterProductImagesAsync(restaurantImagesDto);
            
            res.status(200).send({message:'Imagens cadastradas com sucesso.'});
        }catch(err: any){
            if(err instanceof BaseError){
                res.status(err.status).json({message:err.message});
            }else{
                res.status(500).json({Error: err.message});
            }
        }
    }

    public async deleteProductImageAsync(req: any, res: any){
        const imageId = req.params.id;

        try{
            await this._productService.deleteProductImageAsync(imageId);
            
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