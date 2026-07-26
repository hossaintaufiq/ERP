import { Body, Controller, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';
import { AiService } from './ai.service';

class AskDto {
  @IsString()
  @MinLength(2)
  prompt: string;
}

@ApiTags('ai')
@ApiBearerAuth()
@Controller('ai')
export class AiController {
  constructor(private readonly ai: AiService) {}

  @Post('ask')
  ask(@Body() dto: AskDto) {
    return this.ai.ask(dto.prompt);
  }
}
