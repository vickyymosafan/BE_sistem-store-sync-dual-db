export type StoreType = 'CENTRAL' | 'BRANCH';

export interface Store {
  id: string;
  code: string;
  name: string;
  type: StoreType;
  city: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}
