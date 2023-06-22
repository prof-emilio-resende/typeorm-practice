import { Entity, PrimaryGeneratedColumn, Column, Unique, ManyToOne, OneToMany } from "typeorm"
import { Post } from "./Post"

@Entity()
@Unique(["firstName"])
export class User {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    firstName: string

    @Column()
    lastName: string

    @Column()
    age: number

    @OneToMany(() => Post, (post) => post.user, { cascade: true })
    posts: Post[]
}
