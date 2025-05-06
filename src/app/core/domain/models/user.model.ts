
// src/app/core/domain/models/user.model.ts
export interface User {
  id?: string;
  username: string; // generalmente el email
  email: string;
  name: string;
  isAuthenticated?: boolean;
}

export interface RegisterUserDto {
  username: string;
  password: string;
  name: string;
}

export interface SignInUserDto {
  username: string;
  password: string;
}

export interface ConfirmSignUpDto {
  username: string;
  confirmationCode: string;
}

export interface AuthResult {
  isSuccess: boolean;
  user?: User;
  nextStep?: string;
  error?: Error;
}
