import { Module, Global } from '@nestjs/common';
import { JsonFileStore } from './storage/json-file.store';

@Global()
@Module({
  providers: [JsonFileStore],
  exports: [JsonFileStore],
})
export class CommonModule {}
