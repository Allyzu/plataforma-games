import { OpenaiService } from 'src/openai/openai.service';
import { BadRequestException, Body, Controller, Post } from '@nestjs/common';

interface AkinatorBody {
  step: number;
  previousAnswers: unknown[];
}
@Controller('akinator')
export class AkinatorController {
  constructor(private readonly OpenaiService: OpenaiService) {}

  @Post('question')
  async getQuestion(@Body() body: AkinatorBody) {
    const { step, previousAnswers } = body;

    if (typeof step !== 'number' || !Array.isArray(previousAnswers))
      throw new BadRequestException('Invalid input data');

    const initialQuestion = [
      'A pessoa é real?',
      'A pessoa é homem?',
      'A pessoa é conhecida mundialmente?',
    ];

    if (step < initialQuestion.length) {
      return { question: initialQuestion[step] };
    }

    const question = await this.OpenaiService.generateQuestion(previousAnswers);
    return { question };
  }

  @Post('guess')
  async makeGuess(@Body() body: AkinatorBody) {
    if (!Array.isArray(body.previousAnswers))
      throw new BadRequestException('Invalid input data');

    const guess = await this.OpenaiService.makeGuess(body.previousAnswers);
    return { guess };
  }
}
