export class ValidationError extends Error {
  constructor(errors: ValidationErrorMessage[]) {
    super();
    this.errors = errors;
  }

  type = "ValidationError";
  errors: ValidationErrorMessage[] = [];
}

export type ValidationErrorMessage = {
  message: string;
};

export function isValidationError(
  toBeDetermined: Error
): toBeDetermined is ValidationError {
  if (toBeDetermined as ValidationError) {
    return true;
  }
  return false;
}
