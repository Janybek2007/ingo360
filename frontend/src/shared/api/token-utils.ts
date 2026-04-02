import Cookies from 'js-cookie';

export class TokenUtils {
  private static tokenKey = 'access_token';
  static getToken(): string | null {
    return Cookies.get(this.tokenKey) || null;
  }
  static setToken(token: string): void {
    Cookies.set(this.tokenKey, token);
  }
  static clearToken(): void {
    Cookies.remove(this.tokenKey);
  }
}
