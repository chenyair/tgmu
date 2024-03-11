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

  export interface Movie {
    adult: boolean;
    backdrop_path: string;
    genre_ids: number[];
    id: number;
    original_language: string;
    original_title: string;
    overview: string;
    popularity: number;
    poster_path: string;
    realease_date: string;
    title: string;
    video: boolean;
    vote_average: number;
    vote_count: number;
  }
  export type IUserDetails = Pick<IUser, '_id' | 'birthdate' | 'email' | 'firstName' | 'lastName' | 'imgUrl'>;
}

export = sharedTypes;
