import { ValidationError } from "yup";
import { IUserCreateErrors } from "src/interfaces/user";
import { ErrorOption } from "react-hook-form";

export const generateErrors = (inner: ValidationError[]): IUserCreateErrors => {
  if (inner && inner.length) {
    return inner.reduce((obj, e) => {
      obj[e.path] = e.errors[0];
      return obj;
    }, {});
  }
};

export const setFormErrors = (
  errors: IUserCreateErrors,
  setError: (prop: keyof IUserCreateErrors, error: ErrorOption) => void
): void => {
  Object.keys(errors).forEach((prop: keyof IUserCreateErrors) => {
    setError(prop, {
      type: "required",
      message: errors[prop],
    });
  });
  return;
};
