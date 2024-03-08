import { UserTokens } from 'shared-types';

export const writeTokens = (tokens: UserTokens): void => {
  localStorage.setItem('token', tokens.accessToken);
  localStorage.setItem('refreshToken', tokens.refreshToken);
};
