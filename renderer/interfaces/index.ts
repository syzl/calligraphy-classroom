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
  demonstrates?: Demonstrate[];
}

export interface Copybook {
  id: number;
  raw: Upload;
  demon_video: DemonstrateVideo;
}

export interface UploadThumb {
  id: number;
  raw: Upload;
  demon_video: DemonstrateVideo;
}
export interface UploadVideo {
  id: number;
  raw: Upload;
  demon_video: DemonstrateVideo;
}

export interface DemonstrateVideo {
  id: number;
  createdAt: string;
  updatedAt: string;
  thumb: UploadThumb;
  video: UploadVideo;
  copybooks?: Copybook[];
  startedAt: string;
  duration: number;
  char:string;
  remark:string;

  demonstrate?: Demonstrate;
}

export interface Demonstrate {
  id: number;
  createdAt: string;
  updatedAt: string;
  title: string;
  desc?: string;
  type?: string;
  subType?: string;
  videos?: DemonstrateVideo[];
  course?: Course;
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

  video?: DemonstrateVideo;
}

export interface PagedResult<T> {
  items: T[];
  itemCount: number;
  totalItems: number;
  pageCount: number;
  next: string;
  previous: string;
}

export interface CursorResult<T> {
  edges: {
    node: T;
    cursor: number;
  }[];
  pageInfo: {
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    startCursor?: number;
    endCursor?: number;
  };
  totalCount: number;
}

export interface Mutated<T> {
  type?: string;
  mutated: Partial<T>;
}

/**
 * 令 T 中的 possible 变为确定
 */
export type TmpNonPossible<T> = {
  [key in NonNullable<keyof T>]: Exclude<T[key], undefined>;
};

/**
 * 用于 取得 Entity 指定类型字段
 */
export type StringKey<Entity, Condition> = {
  [Key in keyof Entity]: Entity[Key] extends Condition ? Key : never;
}[Exclude<keyof Entity, 'createdAt' | 'updatedAt'>];

/**
 * 用于 详情页面字段
 */
export interface FieldMeta<T, Condition = string> {
  label: string;
  key: StringKey<TmpNonPossible<T>, Condition>;
}
