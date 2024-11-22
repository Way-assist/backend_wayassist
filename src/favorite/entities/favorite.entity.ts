import { User } from "src/auth/entities/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'favorites' })

export class Favorite {

    @PrimaryGeneratedColumn('uuid')
    id: string;
    @Column('text')
    name: string;
    @Column('decimal', )
    longitude: number;
    @Column('decimal',)
    latitude: number;
    @Column('text',{nullable:true})
    description: string;
    @Column('text')
    address: string;
    @ManyToOne( () => User, user => user.favorites)
    user: User;
}
