import { Storer } from "../interfaces/storer";
import { Product, validate } from "../types/products";
import { Request, Response } from "express";

export class ProductHandler implements Handler {
  private productStorer: Storer<Product>;

  constructor(s: Storer<Product>) {
    this.productStorer = s;
  }

  public async handleGetAllReq(req: Request, res: Response) {
    const products = await this.productStorer.getAll();

    res.json(products);
  }

  public async handleGetByID(req: Request, res: Response) {
    const id = req.params["productId"];
    const product = await this.productStorer.getByID(id);

    if (!product) {
      res.status(404).json();
    } else {
      res.json(product);
    }
  }

  public async handlePostProduct(req: Request, res: Response) {
    const body = req.body as Product;

    validate(body);

    const product = await this.productStorer.insert(body);
    res.json(product);
  }

  public async handleDeleteProduct(req: Request, res: Response) {
    const id = req.params["productId"];

    await this.productStorer.delete(id);
    res.json({});
  }

  public async handlePatchProduct(req: Request, res: Response) {
    const id = req.params["productId"];

    const body = req.body;
    validate(body);
    const product = await this.productStorer.update(id, body);
    res.json(product);
  }
}

export interface Handler {}
