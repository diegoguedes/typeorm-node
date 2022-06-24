import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./entity/User";
import { Photo } from "./entity/Photo";
import { PhotoMetadata } from "./entity/PhotoMetadata";
import { Author } from "./entity/Author";
import { Album } from "./entity/Album";
import { Post } from "./entity/Post";
import { PostRefactoring1655831916117 } from "./migration/1655831916117-PostRefactoring";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "typeorm_db",
  port: 5432,
  username: "postgres",
  password: "diego",
  database: "typeorm",
  synchronize: true,
  logging: true,
  entities: [User, Photo, PhotoMetadata, Author, Album, Post],
  migrations: [PostRefactoring1655831916117],
  subscribers: [],
});
