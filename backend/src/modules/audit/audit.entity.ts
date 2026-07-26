import { Entity } from '../../common/repository/repository.interface';

export interface AuditEntity extends Entity {
  [key: string]: any;
}
