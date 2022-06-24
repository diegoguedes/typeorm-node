import { Router } from "express";

import { AppDataSource } from "../data-source";
import express from "express";
import { User } from "../entity/User";
import { Photo } from "../entity/Photo";
import { PhotoMetadata } from "../entity/PhotoMetadata";
import { Album } from "../entity/Album";

const routes = Router();
routes.use(express.json());

/**
 * @swagger
 * /insert:
 *   get:
 *     summary: Insert a new user
 *     tags: [Users]
 *     requestBody:
 *      required: false
 *     responses:
 *       201:
 *         description: the user who was registred
 */
routes.get("/insert", async (request, response) => {
  console.log("Inserting a new user into the database...");
  const user = new User();
  user.firstName = "Timber";
  user.lastName = "Saw";
  user.age = 25;
  const userRepository = AppDataSource.getRepository(User);
  await userRepository.save(user);
  console.log("Saved a new user with id: " + user.id);

  const photo = new Photo();
  photo.name = "Photo";
  photo.description = "Description from the photo";
  photo.filename = "vacation.png";
  photo.views = 23;
  photo.isPublished = true;

  const photoRepository = AppDataSource.getRepository(Photo);
  await photoRepository.save(photo);
  console.log("Saved a new photo with id: " + photo.id);

  return response.json({ message: "Inserted" });
});
/**
 * @swagger
 * /find:
 *   get:
 *     summary: Find all users
 *     tags: [Users]
 *     requestBody:
 *      required: false
 *     responses:
 *       201:
 *         description: the user who was registred
 */
routes.get("/find", async (request, response) => {
  console.log("Loading users from the database...");
  const userRepository = AppDataSource.getRepository(User);

  const users = await userRepository.findOneBy({ id: 1 });
  console.log("Loaded users: ", users);

  const users2 = await userRepository.findBy({ lastName: "Saw" });
  console.log("Loaded users: ", users2);

  console.log("Loadinha photos from the database...");
  const photoRepository = AppDataSource.getRepository(Photo);
  const photos = await photoRepository.find();
  console.log("Loaded photos: ", photos);

  const [photos2, photosCount] = await photoRepository.findAndCount();

  console.log(
    "Here you can setup and run express / fastify / any other framework."
  );
  return response.json({
    users2: users2,
    photos2: photos2,
    photoCount: photosCount,
  });
});

/**
 * @swagger
 * /update:
 *   get:
 *     summary: Update a user
 *     tags: [Users]
 *     requestBody:
 *      required: false
 *     responses:
 *       201:
 *         description: the user who was registred
 */
routes.get("/update", async (request, response) => {
  console.log("Update users from the database...");
  const userRepository = AppDataSource.getRepository(User);

  const user = await userRepository.findOneBy({ id: 1 });

  user.firstName = "Diego";

  userRepository.save(user);
  return response.json({ users: user });
});

/**
 * @swagger
 * /remove:
 *   get:
 *     summary: Remove a user
 *     tags: [Users]
 *     requestBody:
 *      required: false
 *     responses:
 *       201:
 *         description: the user who was registred
 */
routes.get("/remove", async (request, response) => {
  console.log("Update users from the database...");
  const userRepository = AppDataSource.getRepository(User);

  const user = await userRepository.findOneBy({ id: 1 });

  userRepository.remove(user);
  return response.json({ users: user });
});

/**
 * @swagger
 * /photo:
 *   get:
 *     summary: Create a photo
 *     tags: [Users]
 *     requestBody:
 *      required: false
 *     responses:
 *       201:
 *         description: the user who was registred
 */
routes.get("/photo", async (request, response) => {
  const photo = new Photo();
  photo.name = "Diego";
  photo.description = "I am near polar bears";
  photo.filename = "photo-with-bears.jpg";
  photo.views = 1;
  photo.isPublished = true;

  // create a photo metadata
  const metadata = new PhotoMetadata();
  metadata.height = 640;
  metadata.width = 480;
  metadata.compressed = true;
  metadata.comment = "cybershoot";
  metadata.orientation = "portrait";
  //metadata.photo = photo; // this way we connect them

  photo.metadata = metadata;
  const photoRepository = AppDataSource.getRepository(Photo);
  //const metadataRepository = AppDataSource.getRepository(PhotoMetadata);

  // first we should save a photo
  await photoRepository.save(photo);

  // photo is saved. Now we need to save a photo metadata
  //await metadataRepository.save(metadata);
  return response.json({ photo: photo });
});

/**
 * @swagger
 * /find-photo:
 *   get:
 *     summary: Find a photo
 *     tags: [Users]
 *     requestBody:
 *      required: false
 *     responses:
 *       201:
 *         description: the user who was registred
 */
routes.get("/find-photo", async (request, response) => {
  const photoRepository = AppDataSource.getRepository(Photo);
  const photoMetadataRepository = AppDataSource.getRepository(PhotoMetadata);

  //const photoMetadata = await photoMetadataRepository.findOneBy({ id: 2 });
  const photoMetadata = await photoMetadataRepository.find({
    relations: {
      photo: true,
    },
  });

  // photo is saved. Now we need to save a photo metadata

  return response.json({
    photo: photoMetadata[0].photo,
    metadata: photoMetadata,
  });
});

/**
 * @swagger
 * /album:
 *   get:
 *     summary: Create a album
 *     tags: [Users]
 *     requestBody:
 *      required: false
 *     responses:
 *       201:
 *         description: the user who was registred
 */
routes.get("/album", async (request, response) => {
  // create a few albums
  const album1 = new Album();
  album1.name = "Bears";
  await AppDataSource.manager.save(album1);

  const album2 = new Album();
  album2.name = "Me";
  await AppDataSource.manager.save(album2);

  // create a few photos
  const photo = new Photo();
  photo.name = "Album Photo";
  photo.description = "I am near polar bears";
  photo.filename = "photo-with-bears.jpg";
  photo.views = 1;
  photo.isPublished = true;
  photo.albums = [album1, album2];
  await AppDataSource.manager.save(photo);

  // now our photo is saved and albums are attached to it
  // now lets load them:
  const loadedPhoto = await AppDataSource.getRepository(Photo).findOne({
    where: {
      name: "Album Photo",
    },
    relations: {
      albums: true,
    },
  });

  return response.json({ photo: loadedPhoto });
});

export { routes };
