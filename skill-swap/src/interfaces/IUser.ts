export interface IUser {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  picture_url: string;
  isLoaded: boolean;
  bio?: string; // Optional field for user bio
}
