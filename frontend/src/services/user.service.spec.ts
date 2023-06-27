import { TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';

 import { UserService } from './user.service';

describe('UserService', () => {
let service: UserService;

  beforeEach(() => {
  TestBed.configureTestingModule({
  imports: [HttpClientModule], // Add HttpClientModule to the imports array
  });
    service = TestBed.inject(UserService);
  });

  it('should be created', () => {
  expect(service).toBeTruthy();
  });
});
