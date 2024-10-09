import { TestBed } from '@angular/core/testing';

import { ColorService } from './color.service';

describe('ColorService', () => {
  let service: ColorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ColorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should generate random color', () => {
    const color = service.getRandomColor('#02c8f5');

    expect(color).not.toBe('#02c8f5');
  });
});
