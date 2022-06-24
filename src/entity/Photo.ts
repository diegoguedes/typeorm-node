import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  ManyToOne,
  ManyToMany,
} from "typeorm";
import { Album } from "./Album";
import { Author } from "./Author";
import { PhotoMetadata } from "./PhotoMetadata";

@Entity()
export class Photo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 100,
  })
  name: string;

  @Column("text")
  description: string;

  @Column()
  filename: string;

  @Column({ nullable: true })
  views: number;

  @Column({ nullable: true })
  isPublished: boolean;

  @OneToOne(() => PhotoMetadata, (photoMetadata) => photoMetadata.photo, {
    cascade: true,
  })
  metadata: PhotoMetadata;

  @ManyToOne(() => Author, (author) => author.photos)
  author: Author;

  @ManyToMany(() => Album, (album) => album.photos)
  albums: Album[];
}
