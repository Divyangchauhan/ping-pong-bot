import { Test, TestingModule } from '@nestjs/testing';
import { EventDbService } from './event.db.service';

describe('EventSaverService', () => {
  let service: EventDbService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EventDbService],
    }).compile();

    service = module.get<EventDbService>(EventDbService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
