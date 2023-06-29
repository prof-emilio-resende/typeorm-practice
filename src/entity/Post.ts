import { Entity, PrimaryGeneratedColumn, Column, Unique, ManyToOne, Index } from "typeorm"
import { User } from "./User"

@Entity()
@Unique(["title"])
export class Post {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    @Index({unique: true})
    title: string

    @Column()
    text: string

    @ManyToOne(() => User, (user) => user.posts, {
        onDelete: "CASCADE"
    })
    user: User

}