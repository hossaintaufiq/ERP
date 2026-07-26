import { Entity } from '../../common/repository/repository.interface';

export interface InventoryEntity extends Entity {
  [key: string]: any;
}
