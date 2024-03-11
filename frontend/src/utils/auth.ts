import { JwtPayload, jwtDecode } from 'jwt-decode';

export const isTokenExpired = (token: string): boolean => {
  const payload = jwtDecode<JwtPayload>(token);
  return payload.exp !== undefined && Date.now() >= payload.exp * 1000;
};
