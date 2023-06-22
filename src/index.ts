import { Not } from "typeorm";
import { AppDataSource } from "./data-source";
import { User } from "./entity/User";
import { Post } from "./entity/Post";

AppDataSource.initialize()
  .then(async () => {
    console.log("Deleting an existing user from the database...");
    const usrToDelete = await AppDataSource.manager.findOneBy(User, {
      firstName: "Timber",
    });
    const usrDeleted = await AppDataSource.manager.delete(User, usrToDelete.id);
    console.log("User deleted!");
    console.log(usrDeleted);

    console.log("Inserting a new user into the database...");
    const user = new User();
    user.firstName = "Timber";
    user.lastName = "Saw";
    user.age = 25;
    await AppDataSource.manager.save(user);
    console.log("Saved a new user with id: " + user.id);

    console.log("Loading users from the database...");
    const users = await AppDataSource.manager.find(User);
    console.log("Loaded users: ", users);

    console.log("======================");
    console.log("queries...");
    console.log("======================");
    console.log("left join...");
    const usrAndPostLeft = await AppDataSource.manager.findOne(User, {
      where: {
        firstName: "Timber",
      },
      relations: {
        posts: true,
      },
    });
    console.log(usrAndPostLeft);

    console.log("selects join...");
    const usrAndPostSelects = await AppDataSource.manager.findOne(User, {
      where: {
        firstName: "Timber",
      },
      relations: {
        posts: true,
      },
      relationLoadStrategy: "query",
    });
    console.log(usrAndPostSelects);

    console.log("inner join, no data...");
    const usrAndPostInner = await AppDataSource.manager.findOne(User, {
      where: {
        firstName: "Timber",
        posts: {
          id: Not(0),
        },
      },
      relations: {
        posts: true,
      },
    });
    console.log(usrAndPostInner);
    const p = new Post();
    p.text = "Timber Post";
    p.title = "Timber Post Title";
    p.user = await AppDataSource.manager.findOne(User, {
      where: { id: Not(0) },
    });
    await AppDataSource.manager.save(p);

    console.log("inner join, with data...");
    const usrAndPostInnerWithData = await AppDataSource.manager.findOne(User, {
      where: {
        firstName: "Timber",
        posts: {
          id: Not(0),
        },
      },
      relations: {
        posts: true,
      },
    });
    console.log(usrAndPostInnerWithData);

    console.log("query builder...");
    const firstUser = await AppDataSource.createQueryBuilder(User, "user")
      .where("user.firstName = :name", { name: "Timber" })
      .getOne();
    console.log(firstUser);


    const firstUserLeftPost = await AppDataSource.createQueryBuilder(User, "user")
      .leftJoinAndSelect('user.posts', 'p')
      .where("user.firstName = :name", { name: "Timber" })
      .getOne();
    console.log(firstUserLeftPost);

    const firstUserInnerPost = await AppDataSource.createQueryBuilder(User, "user")
      .innerJoinAndSelect('user.posts', 'p')
      .where("user.firstName = :name", { name: "Timber" })
      .getOne();
    console.log(firstUserInnerPost);
    
    console.log("repository...");
    const PostRepository = AppDataSource.getRepository(Post).extend({
        findByTitleAndText(title: string, text: string) {
            return this.createQueryBuilder("post")
                .where("post.title = :title", { title })
                .andWhere("post.text like :text", { text: `%${text}%` })
                .getMany();
        },
    });
    const timberPost = await PostRepository.findByTitleAndText('Timber Post Title', 'Timber');
    console.log(timberPost);

    console.log("native queries...");
    const rawData = await AppDataSource.manager.query('SELECT * FROM USER');
    console.log(rawData);
  })
  .catch((error) => console.log(error));
