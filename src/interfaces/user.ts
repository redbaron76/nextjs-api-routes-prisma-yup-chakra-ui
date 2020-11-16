import { Profile, Role } from "@prisma/client";

// USER

export interface IMeUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: Role;
  profile?: Profile;
}

export interface IAuthContext {
  userId?: number | null;
  userData?: IMeUser | null;
  userLogged: boolean;
}

// LOGIN

export interface IUserLogin {
  email: string;
  password: string;
}

export interface IUserLoginError {
  message: string;
}

export interface IUserLoginResponse {
  user?: IMeUser;
  error?: IUserLoginError;
}

// CREATE

export interface IUserCreate {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface IUserCreateErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

export interface IUserCreateResponse {
  user?: IUserCreate;
  value?: IUserCreate;
  errors?: IUserCreateErrors;
}
