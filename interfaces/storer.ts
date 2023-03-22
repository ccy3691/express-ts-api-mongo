export interface Storer<T> {
  getAll(): Promise<T[]>;
  getByID(id: string): Promise<T | null>;
  insert(item: T): Promise<T>;
  delete(id: string): void;
  update(id: string, body: T): Promise<T>;
}
