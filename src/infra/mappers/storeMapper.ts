import { Store } from '../../domain/entities/Store';

export interface StoreDTO {
  id: string;
  code: string;
  name: string;
  type: string;
  city: string;
  active: boolean;
}

export function toStoreDTO(store: Store): StoreDTO {
  return {
    id: store.id,
    code: store.code,
    name: store.name,
    type: store.type,
    city: store.city,
    active: store.active,
  };
}
