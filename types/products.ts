import { ObjectId } from "mongodb";
import { ValidationErrorMessage, ValidationError } from "./validationError";

export type Product = {
  id: string;
  name: string;
};

export function validate(product: Product): boolean {
  let errors: ValidationErrorMessage[] = [];
  if (!product.name || product.name.length < 3) {
    errors.push({ message: "Name must be longer than 3 characters!" });
  }

  if (errors.length > 0) {
    throw new ValidationError(errors);
  }

  return true;
}
