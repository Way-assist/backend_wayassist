import { ConflictException, Injectable, Logger } from '@nestjs/common';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
import { UpdateFavoriteDto } from './dto/update-favorite.dto';
import { User } from 'src/auth/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Favorite } from './entities/favorite.entity';
import { Repository } from 'typeorm';
import { isUUID } from 'class-validator';

@Injectable()
export class FavoriteService {

  constructor(
    @InjectRepository(Favorite)
    private readonly favoriteRepository: Repository<Favorite>,

  ) { }
  async create(createFavoriteDto: CreateFavoriteDto, user: User) {
    let isFavorite = await this.favoriteRepository.findOne({ where: { name: createFavoriteDto.name, user: { id: user.id } } });
    if (isFavorite) {
      throw new ConflictException('Ya existe un favorito con ese nombre');
    }
    const favorite = this.favoriteRepository.create({
      ...createFavoriteDto,
      user: user
    });
    return this.favoriteRepository.save(favorite);

  }

 async findAll(user: User) {
    let favorites : Favorite[]= await this.favoriteRepository.find({ where: { user: { id: user.id } } });
    favorites = favorites.map(favorite => {
      favorite.latitude = parseFloat(favorite.latitude.toString());
      favorite.longitude = parseFloat(favorite.longitude.toString());
      return favorite;
    });
    return favorites;
  }

  async findOne(term: string, user: User) {
    let isFavorite;
  
    if (isUUID(term)) {
      isFavorite = await this.favoriteRepository.findOne({
        where: { id: term, user: { id: user.id } },
      });
    } else {
      isFavorite = await this.favoriteRepository.findOne({
        where: { name: term, user: { id: user.id } },
      });
    }
  
    if (!isFavorite) {
      throw new ConflictException('No existe un favorito con ese identificador o nombre');
    }
    
    isFavorite.latitude = parseFloat(isFavorite.latitude);
    isFavorite.longitude = parseFloat(isFavorite.longitude);
    return isFavorite;
  }

  async update(id: string, updateFavoriteDto: UpdateFavoriteDto, user: User) {
    let isFavorite = await this.favoriteRepository.findOneBy({ id: id, user: { id: user.id } });
    if (!isFavorite) {
      throw new ConflictException('No existe un favorito con ese nombre');
    }    
    await this.favoriteRepository.update(id, {
      ...updateFavoriteDto,
      user: user
    });
    let favoriteNew = await this.favoriteRepository.findOneBy({id});
    favoriteNew.latitude = parseFloat(favoriteNew.latitude.toString());
    favoriteNew.longitude = parseFloat(favoriteNew.longitude.toString());
    return favoriteNew
  }

  async remove(id: string) {
    let isFavorite = await this.favoriteRepository.findOneBy({ id: id });
    if (!isFavorite) {
      throw new ConflictException('No existe un favorito');
    }  
    await this.favoriteRepository.delete(id);
    return isFavorite;
  }
}
