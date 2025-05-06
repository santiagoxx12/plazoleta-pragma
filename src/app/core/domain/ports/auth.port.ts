import { Observable } from 'rxjs';
import { AuthResult, ConfirmSignUpDto, RegisterUserDto, SignInUserDto, User } from '../models/user.model';

/**
 * Puerto de autenticación definido según la arquitectura hexagonal
 */
export interface IAuthPort {
  /**
   * Observable que indica si el usuario está autenticado
   */
  isAuthenticated$: Observable<boolean>;

  /**
   * Registra un nuevo usuario
   * @param data Datos para el registro
   */
  register(data: RegisterUserDto): Promise<AuthResult>;

  /**
   * Confirma el registro de un usuario con el código recibido
   * @param data Datos para la confirmación
   */
  confirmSignUp(data: ConfirmSignUpDto): Promise<AuthResult>;

  /**
   * Inicia sesión con credenciales
   * @param credentials Credenciales del usuario
   */
  login(credentials: SignInUserDto): Promise<AuthResult>;

  /**
   * Cierra la sesión del usuario actual
   */
  logout(): Promise<void>;

  /**
   * Verifica el estado de autenticación actual
   */
  checkAuthStatus(): Promise<boolean>;

  /**
   * Obtiene la información del usuario actual
   */
  getCurrentUser(): Promise<User | null>;
}
