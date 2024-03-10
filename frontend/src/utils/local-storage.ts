import { UserTokens } from 'shared-types';

export const writeTokens = (tokens: UserTokens, rememberMe: boolean = false): void => {
  // Clear any existing tokens
  clearTokens();

  sessionStorage.setItem('token', tokens.accessToken);
  sessionStorage.setItem('refreshToken', tokens.refreshToken);

  if (rememberMe) {
    localStorage.setItem('token', tokens.accessToken);
    localStorage.setItem('refreshToken', tokens.refreshToken);
  }
};

export const clearTokens = (): void => {
  localStorage.removeItem('token');
  localStorage.removeItem('refreshToken');

  sessionStorage.removeItem('token');
  sessionStorage.removeItem('refreshToken');
};
