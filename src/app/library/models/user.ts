export type User = {
  [key: string]: string | number | undefined;
  id: number;
  name: string;
  role: string;
  salt?: string;
  password?: string;
};
