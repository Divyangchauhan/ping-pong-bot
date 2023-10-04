import { Test, TestingModule } from '@nestjs/testing';
import { EventReaderService } from './event-reader.service';

describe('EventReaderServiceService', () => {
  let service: EventReaderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EventReaderService],
    }).compile();

    service = module.get<EventReaderService>(EventReaderService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
