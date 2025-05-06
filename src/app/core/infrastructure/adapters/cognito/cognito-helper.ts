import * as CryptoJS from "crypto-js"

export class CognitoHelper {
  // Este es el Client Secret que obtuviste de AWS Cognito
  private static readonly CLIENT_SECRET = "1l59oo6bpvg2cfjb9l2im7pifv1m6kh80kdaia74mnrg5pt74c6s"
  private static readonly CLIENT_ID = "1blgfi0jukt60450jin23dcm14"

  /**
   * Genera el SECRET_HASH requerido para las operaciones de Cognito
   * @param username El nombre de usuario (email) para el que generar el hash
   * @returns El SECRET_HASH generado
   */
  public static generateSecretHash(username: string): string {
    try {
      const message = username + this.CLIENT_ID
      const hash = CryptoJS.HmacSHA256(message, this.CLIENT_SECRET)
      const secretHash = hash.toString(CryptoJS.enc.Base64)

      // Log the generated hash for debugging
      console.log(`Generated SECRET_HASH for ${username}:`, secretHash)

      return secretHash
    } catch (error) {
      console.error("Error generating SECRET_HASH:", error)
      throw error
    }
  }
}
