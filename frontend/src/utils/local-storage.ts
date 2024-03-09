import { UserTokens } from 'shared-types';

export const writeTokens = (tokens: UserTokens, rememberMe: boolean = false): void => {
  localStorage.setItem('token', tokens.accessToken);

  if (rememberMe) {
    localStorage.setItem('refreshToken', tokens.refreshToken);
  }
};

export const clearTokens = (): void => {
  localStorage.removeItem('token');
  localStorage.removeItem('refreshToken');
};
