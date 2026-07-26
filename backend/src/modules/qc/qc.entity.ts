import { Entity } from '../../common/repository/repository.interface';

export interface QcEntity extends Entity {
  [key: string]: any;
}
