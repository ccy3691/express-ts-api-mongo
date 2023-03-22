import express, { Express, NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import * as mongoDB from "mongodb";
import { MongoProductStore } from "./stores/mongo/productStore";
import { Handler, ProductHandler } from "./handlers/productHandler";
import { errorHandler } from "./middlewares/errorMiddleware";

function requestWrapper(
  func: (req: Request, res: Response) => void,
  ctx: Handler
) {
  return async function (req: Request, res: Response, next: NextFunction) {
    try {
      await func.apply(ctx, [req, res]);
    } catch (e) {
      next(e);
    }
  };
}

async function start() {
  dotenv.config();

  const app: Express = express();
  const router = express.Router();
  const port = process.env.PORT;

  const client: mongoDB.MongoClient = new mongoDB.MongoClient(
    process.env.DB_CONN_STRING!
  );

  await client.connect();
  const db: mongoDB.Db = client.db(process.env.DB_NAME);
  const storer = new MongoProductStore(db, "products");
  const productHandler = new ProductHandler(storer);

  router.get(
    "/products",
    requestWrapper(productHandler.handleGetAllReq, productHandler)
  );

  router.get(
    "/products/:productId",
    requestWrapper(productHandler.handleGetByID, productHandler)
  );

  router.post(
    "/products",
    requestWrapper(productHandler.handlePostProduct, productHandler)
  );

  router.delete(
    "/products/:productId",
    requestWrapper(productHandler.handleDeleteProduct, productHandler)
  );

  router.put(
    "/products/:productId",
    requestWrapper(productHandler.handlePatchProduct, productHandler)
  );

  app.use(express.json());
  app.use("/api", router);
  app.use(errorHandler);
  app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
  });
}
start();
