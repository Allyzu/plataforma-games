import { Injectable, Logger } from '@nestjs/common';
import OpenAI from 'openai';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class OpenaiService {
  private openai: OpenAI;
  private readonly logger = new Logger(OpenaiService.name);

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('OPENAI_API_KEY');
    if (!apiKey) {
      throw new Error('OPENAI_API_KEY environment variable is required');
    }
    this.openai = new OpenAI({ apiKey });
  }

  private async callOpenAI(
    prompt: string,
    maxTokens = 50,
    retries = 2,
  ): Promise<string> {
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const response = await this.openai.chat.completions.create({
          model: 'gpt-3.5-mini',
          messages: [{ role: 'user', content: prompt }],
          max_tokens: maxTokens,
        });

        const content = response.choices[0].message?.content?.trim();
        if (!content) throw new Error('Empty response from OpenAI');

        return this.cleanResponse(content);
      } catch (error: unknown) {
        const errMsg = error as Error;

        this.logger.warn(`Attempt ${attempt} failed: ${errMsg.message}`);

        if (attempt === retries) {
          this.logger.error('All retry attempts failed.', errMsg.stack);
          throw new Error(
            'Failed to get response from OpenAI after multiple attempts.',
          );
        }
      }
    }
    return '';
  }

  async generateQuestion(
    previousAnswers: Record<string, any>,
  ): Promise<string> {
    const prompt = `
Você é o Akinator. Gere uma pergunta de SIM ou NÃO para adivinhar a pessoa que estou pensando.
Aqui estão as respostas anteriores: ${JSON.stringify(previousAnswers)}
Responda apenas com a pergunta, nada mais.
`;
    return this.callOpenAI(prompt, 60);
  }

  async makeGuess(previousAnswers: Record<string, any>): Promise<string> {
    const prompt = `
Você é o Akinator. Com base nas respostas anteriores (sim/não), tente adivinhar quem é a pessoa.
Responda apenas com o nome da pessoa.
Respostas anteriores: ${JSON.stringify(previousAnswers)}
`;
    return this.callOpenAI(prompt, 40);
  }

  private cleanResponse(text: string): string {
    return text
      .replace(/^Pergunta:\s*/i, '')
      .replace(/^Resposta:\s*/i, '')
      .replace(/^Acho que é\s*/i, '')
      .replace(/["“”]/g, '')
      .trim();
  }
}
