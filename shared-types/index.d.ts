declare namespace sharedTypes {
  interface UserTokens {
    accessToken: string;
    refreshToken: string;
  }

  export interface IUser {
    _id?: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    birthdate: Date;
    imgUrl?: string;
    refreshTokens?: string[];
  }
  
  export type IUserDetails = Pick<IUser, '_id' | 'birthdate' | 'email' | 'firstName' | 'lastName' | 'imgUrl'>;
}

export = sharedTypes;
