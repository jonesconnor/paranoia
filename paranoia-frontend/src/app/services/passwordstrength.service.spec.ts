import { TestBed } from '@angular/core/testing';

import { PasswordStrengthService } from './passwordstrength.service';

describe('PasswordstrengthService', () => {
  let service: PasswordStrengthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PasswordStrengthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
