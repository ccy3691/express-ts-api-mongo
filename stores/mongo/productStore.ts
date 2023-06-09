import { Storer } from "../../interfaces/storer";
import { Product } from "../../types/products";
import * as mongoDB from "mongodb";
import { MongoRecord } from "../../types/mongo/mongoRecord";
import { ValidationError } from "../../types/validationError";

export class MongoProductStore implements Storer<Product> {
  db: mongoDB.Db;
  coll: mongoDB.Collection<MongoRecord<Product>>;

  constructor(db: mongoDB.Db, collName: string) {
    this.db = db;
    this.coll = this.db.collection<MongoRecord<Product>>(collName);
  }

  async delete(filterId: string): Promise<void> {
    await this.coll.deleteOne({
      _id: this.createObjectId(filterId),
    });
  }

  async update(filterId: string, body: Product): Promise<Product> {
    await this.coll.updateOne(
      {
        _id: this.createObjectId(filterId),
      },
      {
        $set: body,
      },
      { upsert: true }
    );

    return { ...body, id: filterId };
  }

  async getAll(): Promise<Product[]> {
    const resp = await this.coll.find({}).toArray();
    return resp.map((val) => this.mapRespToProduct(val));
  }

  async getByID(filterId: string): Promise<Product | null> {
    const item = await this.coll.findOne({
      _id: this.createObjectId(filterId),
    });

    if (!item) return null;

    return this.mapRespToProduct(item);
  }

  async insert(item: Product): Promise<Product> {
    const inserted = {
      ...item,
      _id: new mongoDB.ObjectId(),
    };

    await this.coll.insertOne(inserted);

    return this.mapRespToProduct(inserted);
  }

  // hacky because of mongo
  private mapRespToProduct(value: MongoRecord<Product>): Product {
    const { _id, ...rest } = value;

    return {
      ...rest,
      id: _id.toString(),
    };
  }

  private createObjectId(value: string): mongoDB.ObjectId {
    try {
      return new mongoDB.ObjectId(value);
    } catch {
      throw new ValidationError([{ message: "invalid product ID" }]);
    }
  }
}
