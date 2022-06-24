import { AppDataSource } from "./data-source";
import { Photo } from "./entity/Photo";
import { User } from "./entity/User";
import express from "express";
import { PhotoMetadata } from "./entity/PhotoMetadata";
import { request } from "http";
import { Album } from "./entity/Album";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

import { routes } from "./routes";

const app = express();

AppDataSource.initialize()
  .then(async () => {
    console.log("Database is running");
  })
  .catch((error) => console.log(error));

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "NodeJS - SOLID principles",
      description: "Practicing SOLID principle in a NodeJS project",
      version: "1.0.0",
    },
    servers: [
      {
        url: "http://localhost:3333",
        description: "SOLID principles Documentation",
      },
    ],
  },
  apis: ["./src/routes/*.ts"],
};
const openapiSpecification = swaggerJsdoc(options);

app.use("/", routes);
app.use("/doc", swaggerUi.serve, swaggerUi.setup(openapiSpecification));

app.listen(3333, () => console.log("Server is running"));
