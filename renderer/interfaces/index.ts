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

export interface Course {
  id: number;
  name: string;
  desc?: string;
  createdAt: string;
  updatedAt: string;
  teacher?: string;
}

export interface Demonstrate {
  id: number;
  createdAt: string;
  updatedAt: string;
  title: string;
  desc?: string;
  type?: string;
  subType?: string;
}
export interface Upload {
  id: number;
  createdAt: string;
  updatedAt: string;

  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  destination: string;
  filename: string;
  path: string;
  size: number;
}

export interface PagedResult<T> {
  items: [T];
  itemCount: number;
  totalItems: number;
  pageCount: number;
  next: string;
  previous: string;
}
