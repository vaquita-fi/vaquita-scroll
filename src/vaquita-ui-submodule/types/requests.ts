export type ErrorType = {
  code: string;
  detail: string;
  message: string;
};

export type ErrorResponseType = {
  success: false;
  message: string;
  errors: ErrorType[];
};
export type ContentResponseType<T> = {
  success: true;
  message: string;
  content: T;
};

export type ContentsMetaType = {
  page: number;
  size: number;
  totalElements: number;
  sort: { [key: string]: number }[];
};

export type ContentsResponseType<T> = {
  success: true;
  message: string;
  contents: T[];
  meta: ContentsMetaType;
};
