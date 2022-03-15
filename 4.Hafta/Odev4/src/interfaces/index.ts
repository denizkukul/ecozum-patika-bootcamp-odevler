export interface todo {
  id: number;
  title: string;
  createdAt: string;
  updatedAt: string;
  categoryId: number;
  statusId: number;
  userId: number;
}
export interface todoInput {
  title: string;
  categoryId: number;
  statusId: number;
}

export interface category {
  id: number;
  title: string;
  createdAt: string;
  updatedAt: string;
  userId: number;
  statusIDs: number[];
  allStatusesFetched: boolean;
}

export interface categoryInput {
  title: string;
  statuses: statusInput[];
}

export interface status {
  id: number;
  title: string;
  color: string;
  createdAt: string;
  updatedAt: string;
  categoryId: number;
}

export interface statusInput {
  title: string;
  color: string;
}

export interface loginData {
  username: string;
  password: string;
}

export interface registerData {
  username: string;
  password: string;
  passwordConfirm: string;
}