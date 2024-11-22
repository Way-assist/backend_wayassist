import { Favorite } from "src/favorite/entities/favorite.entity";
import { BeforeInsert, BeforeUpdate, Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'users' })
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;
    @Column('text')
    name: string;
    @Column('text')
    lastname: string;
    @Column('text', { unique: true })
    email: string;
    @Column('text', { unique: true,nullable:true })
    phone: string;
    @Column('text', { unique: true,nullable:true })
    dni: string;
    @Column('text', { select: false })
    password: string;
    @Column({ type: 'bool', default: true })
    isActive: boolean;
    @Column({ type: 'bool', default: false })
    verify: boolean;
    @Column('text', { array: true, default: ['user'] })
    roles: string[];
    @Column('date', { nullable: true })
    birthday: Date;
    @CreateDateColumn()
    createdAt: Date;
    @OneToMany(() => Favorite, favorite => favorite.user)
    favorites: Favorite[];    
    @BeforeInsert()
    @BeforeUpdate()
    checkfielemail() {
        this.email = this.email.toLowerCase().trim();
    }

}
