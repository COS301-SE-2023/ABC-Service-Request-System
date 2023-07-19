import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http'; // Import HttpClientModule

import { ProfileOverlayComponent } from './profile-overlay.component';

describe('ProfileOverlayComponent', () => {
  let component: ProfileOverlayComponent;
  let fixture: ComponentFixture<ProfileOverlayComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule], // Add HttpClientModule to the imports
      declarations: [ProfileOverlayComponent]
    });
    fixture = TestBed.createComponent(ProfileOverlayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
