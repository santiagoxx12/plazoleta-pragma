import { Injectable } from "@angular/core"
import { signUp, confirmSignUp, signIn, signOut, fetchAuthSession, getCurrentUser } from "aws-amplify/auth"
import { BehaviorSubject } from "rxjs"
import { CognitoHelper } from "../../infrastructure/adapters/cognito/cognito-helper"

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false)
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable()

  constructor() {
    this.checkAuthStatus()
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


  async register(email: string, password: string, name: string): Promise<any> {
    try {
      const secretHash = CognitoHelper.generateSecretHash(email)

      const signUpParams: any = {
        username: email,
        password: password,
        secretHash: secretHash,
        options: {
          userAttributes: {
            email,
            name,
          },
          autoSignIn: true,
        },
      }

      console.log("SignUp params:", JSON.stringify(signUpParams, null, 2))

      return signUp(signUpParams)
    } catch (error) {
      console.error("Error in register method:", error)
      throw error
    }
  }

  async confirmSignUp(username: string, code: string): Promise<any> {
    try {
      const secretHash = CognitoHelper.generateSecretHash(username)

      // Approach 1: Try passing SECRET_HASH at the top level
      const params: any = {
        username,
        confirmationCode: code,
        secretHash: secretHash, // Try at top level
        options: {},
      }

      console.log("ConfirmSignUp params:", JSON.stringify(params, null, 2))

      return confirmSignUp(params)
    } catch (error) {
      console.error("Error in confirmSignUp method:", error)
      throw error
    }
  }
  async getUserRole(): Promise<string[] | null> {
    try {
      const session = await fetchAuthSession();
      const idToken = session.tokens?.idToken?.toString();

      if (!idToken) return null;

      const payload = JSON.parse(atob(idToken.split('.')[1]));
      return payload["cognito:groups"] || [];
    } catch (error) {
      console.error("Error al obtener el rol del usuario:", error);
      return null;
    }
  }

  async login(username: string, password: string): Promise<any> {
    // Inicia sesión
    const user = await signIn({ username, password });

    // Obtiene el token de la sesión actual
    const session = await fetchAuthSession();
    const idToken = session.tokens?.idToken?.toString();

    let groups: string[] = [];

    if (idToken) {
      // Decodifica el ID token para leer los grupos
      const payload = JSON.parse(atob(idToken.split('.')[1]));
      groups = payload['cognito:groups'] || [];
    }

    return {
      user,
      groups
    };
  }
}
