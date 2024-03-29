import { Types } from 'mongoose';

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
    release_date: string;
    title: string;
    video: boolean;
    vote_average: number;
    vote_count: number;
  }

  export type IUserDetails = Pick<IUser, '_id' | 'birthdate' | 'email' | 'firstName' | 'lastName' | 'imgUrl'>;

  type MovieDetails = Pick<Movie, 'id' | 'title' | 'poster_path'>;

  interface IExperience {
    _id?: string;
    userId: Types.ObjectId;
    title: string;
    description: string;
    comments: IComment[];
    likedUsers: string[];
    imgUrl: string;
    createdAt: Date;
    updatedAt: Date;
    movieDetails: MovieDetails;
  }

  interface ExperienceGetAllResponse {
    experiences: IExperience[];
    currentPage: number;
    totalPages: number;
  }

  type NewExperience = Pick<IExperience, 'title' | 'description' | 'movieDetails'> & {
    experienceImage: File;
    userId: string;
  };

  interface IComment {
    userId: string;
    text: string;
    createdAt: Date;
    updatedAt: Date;
  }

  interface PopulatedComment extends Omit<IComment, 'userId'> {
    userId: Pick<IUserDetails, '_id' | 'firstName' | 'lastName' | 'imgUrl'>;
  }

  interface ExperienceGetByIdResponse extends Omit<IExperience, 'comments'> {
    comments: PopulatedComment[];
  }

  export interface IUserUpdatePayload extends Partial<Omit<IUserDetails, 'imgUrl' | '_id'>> {
    imageFile: File | null;
    currentPassword: string;
    newPassword: string;
  }
}

export = sharedTypes;
