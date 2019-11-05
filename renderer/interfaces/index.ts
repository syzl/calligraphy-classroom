export interface SignInReturn {
  accessToken: string;
  expiresIn: number;
}
export interface WhoAmI {
  username: string;
  id: number;
  email: string;
  isActive: string;
}
