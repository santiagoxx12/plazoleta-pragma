import { Injectable } from "@angular/core"
import { BehaviorSubject } from "rxjs"
import {
  signUp,
  confirmSignUp,
  signIn,
  signOut,
  fetchAuthSession,
  getCurrentUser,
  type SignUpInput,
} from "aws-amplify/auth"
import { CognitoHelper } from "./cognito-helper"
import type {
  AuthResult,
  ConfirmSignUpDto,
  RegisterUserDto,
  SignInUserDto,
  User,
} from "../../../domain/models/user.model"
import type { IAuthPort } from "../../../domain/ports/auth.port"

@Injectable()
export class CognitoAuthAdapter implements IAuthPort {
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false)
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable()

  constructor() {
    // Verificar el estado de autenticación inicial
    this.checkAuthStatus().then((isAuthenticated) => {
      this.isAuthenticatedSubject.next(isAuthenticated)
    })
  }

  async register(data: RegisterUserDto): Promise<AuthResult> {
    try {
      // Generamos el SECRET_HASH para el username
      const secretHash = CognitoHelper.generateSecretHash(data.username)

      // Preparamos los parámetros de registro
      const signUpParams: SignUpInput = {
        username: data.username,
        password: data.password,
        options: {
          userAttributes: {
            email: data.username, // El email como username
            name: data.name,
          },
          autoSignIn: true,
          clientMetadata: {
            SECRET_HASH: secretHash,
          },
        },
      }

      // Realizamos el registro
      const result = await signUp(signUpParams)

      // Formateamos la respuesta según nuestro modelo de dominio
      return {
        isSuccess: true,
        nextStep: result.nextStep.signUpStep,
        user: {
          id: result.userId,
          username: data.username,
          email: data.username,
          name: data.name,
        },
      }
    } catch (error: any) {
      console.error("[CognitoAuthAdapter] Register error:", error)
      return {
        isSuccess: false,
        error: error,
      }
    }
  }

  async confirmSignUp(data: ConfirmSignUpDto): Promise<AuthResult> {
    try {
      // Generamos el SECRET_HASH para el username
      const secretHash = CognitoHelper.generateSecretHash(data.username)

      // Confirmamos el registro
      const result = await confirmSignUp({
        username: data.username,
        confirmationCode: data.confirmationCode,
        options: {
          clientMetadata: {
            SECRET_HASH: secretHash,
          },
        },
      })

      return {
        isSuccess: result.isSignUpComplete,
        nextStep: result.nextStep?.signUpStep,
      }
    } catch (error: any) {
      console.error("[CognitoAuthAdapter] ConfirmSignUp error:", error)
      return {
        isSuccess: false,
        error: error,
      }
    }
  }

  async login(credentials: SignInUserDto): Promise<AuthResult> {
    try {
      // Generamos el SECRET_HASH para el username
      const secretHash = CognitoHelper.generateSecretHash(credentials.username)

      // Iniciamos sesión
      const result = await signIn({
        username: credentials.username,
        password: credentials.password,
        options: {
          clientMetadata: {
            SECRET_HASH: secretHash,
          },
        },
      })

      // Actualizamos el estado de autenticación
      if (result.isSignedIn) {
        this.isAuthenticatedSubject.next(true)

        // Intentamos obtener el usuario actual
        const userInfo = await this.getCurrentUser()

        return {
          isSuccess: true,
          user: userInfo || {
            username: credentials.username,
            email: credentials.username,
            name: "", // No tenemos el nombre en este punto
            isAuthenticated: true,
          },
        }
      }

      return {
        isSuccess: false,
        nextStep: result.nextStep?.signInStep,
      }
    } catch (error: any) {
      console.error("[CognitoAuthAdapter] Login error:", error)
      return {
        isSuccess: false,
        error: error,
      }
    }
  }

  async logout(): Promise<void> {
    try {
      await signOut()
      this.isAuthenticatedSubject.next(false)
    } catch (error) {
      console.error("[CognitoAuthAdapter] Logout error:", error)
      throw error
    }
  }

  async checkAuthStatus(): Promise<boolean> {
    try {
      const session = await fetchAuthSession()
      const isAuthenticated = session && session.tokens !== undefined
      this.isAuthenticatedSubject.next(isAuthenticated)
      return isAuthenticated
    } catch (error) {
      this.isAuthenticatedSubject.next(false)
      return false
    }
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      const userInfo = await getCurrentUser()

      if (!userInfo) {
        return null
      }

      // Construimos nuestro modelo de usuario desde los datos de Cognito
      return {
        id: userInfo.userId,
        username: userInfo.username,
        email: userInfo.username, // Suponemos que el username es el email
        name: userInfo.signInDetails?.loginId || "",
        isAuthenticated: true,
      }
    } catch (error) {
      console.error("[CognitoAuthAdapter] GetCurrentUser error:", error)
      return null
    }
  }
}
