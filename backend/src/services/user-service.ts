import { Mapper } from "../mapper/mapper";
import { UserModel } from "../database/models/user-model";
import { UserRolesModel } from "../database/models/user-roles-model";
import { UserRegisterDto } from "../dtos/user/user-register-dto";
import { NotFoundError } from "../errors/not-found-error";
import { UserRepository } from "../repository/user/user-repository";
import { UserRolesRepository } from "../repository/user_roles/user-roles-repository";
import { ConflictError } from "../errors/conflict-error";
import { UserUpdateDto } from "../dtos/user/user-update-dto";
import { UserDto } from "../dtos/user/user-dto";
import AppSettingsService from "../utils/app-settings/app-settings-service";
import AppSettingsModel from "../utils/app-settings/models/app-settings-model";
import { v4 as uuidv4 } from 'uuid';
import { RoleRepository } from "../repository/roles/role-repository";
import { RoleModel } from "../database/models/role-model";
import { RoleDto } from "../dtos/role/role-dto";
import { UserAuthenticatedDto } from "../dtos/user/user-authenticated-dto";
export class UserService{

    private _userRepository: UserRepository;
    private _userRoleRepository: UserRolesRepository;
    private _appSettings: AppSettingsModel;
    private _roleRepository: RoleRepository;

    constructor(){
        this._userRepository = new UserRepository();
        this._userRoleRepository = new UserRolesRepository();
        this._roleRepository = new RoleRepository();
        this._appSettings =  AppSettingsService.getInstace().getAppSettings();
    }

    public async registerUserAsync(userRegisterRoleDto: UserRegisterDto){
        const userModel = Mapper.mapper<UserDto, UserModel>(userRegisterRoleDto.User, UserModel);

        const userExist = await this._userRepository.getUserByEmailAsync(userModel.Email);

        if(userExist)
            throw new ConflictError('Já existe um usuário cadastrado com esse email');

        userModel.generateId();
        await userModel.hashPassword(this._appSettings.Bcrypt.PasswordSecret);

        await this._userRepository.insertUser(userModel);

        const userRolesModel = userRegisterRoleDto.Roles.map(role =>{
            return Mapper.mapper<any, UserRolesModel>({Id: uuidv4(),UserId: userModel.Id, RoleId: role.Id}, UserRolesModel);
        });
        
        await this._userRoleRepository.insertUserRoleAsync(userRolesModel);
    }

    public async updateUserAsync(userUpdateDto: UserUpdateDto){
        const userModel = Mapper.mapper<UserUpdateDto, UserModel>(userUpdateDto, UserModel);

        const userExist = await this._userRepository.getUserByIdAsync(userModel.Id);

        if(!userExist)
            throw new NotFoundError('User Not Found');

        await this._userRepository.updateUser(userModel);
    }

    public async deleteUserAsync(userId: string){
        const userExist = await this._userRepository.getUserByIdAsync(userId);

        if(!userExist)
            throw new NotFoundError('User Not Found');

        await this._userRepository.deleteUserAsync(userId);
    }

    public async getUsersAsync() {
        const users = await this._userRepository.getUsersAsync();

        let usersDto: Array<UserAuthenticatedDto> = new Array<UserAuthenticatedDto>();

        for await(const user of users){
            const rolesModel = await this._roleRepository.getUserRolesByUserId(user.Id);
            
            const userDto = Mapper.mapper<UserModel, UserAuthenticatedDto>(user, UserAuthenticatedDto);
            const rolesDto = Mapper.mapperList<RoleModel, RoleDto>(rolesModel, RoleDto);
            
            userDto.Roles = rolesDto;            

            usersDto.push(userDto);
        }
        
        return usersDto;
    }
}