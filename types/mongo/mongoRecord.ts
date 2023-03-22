import { ObjectId } from "mongodb";

export type MongoRecord<T> = {
  _id: ObjectId;
} & T;
