import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { InternalAccountPage1Component } from './internal-account-page1.component';
import { AuthService } from 'src/services/auth.service';
import { GroupService } from 'src/services/group.service';
import { MatCheckboxModule } from '@angular/material/checkbox';

describe('InternalAccountPage1Component', () => {
  let component: InternalAccountPage1Component;
  let fixture: ComponentFixture<InternalAccountPage1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InternalAccountPage1Component],
      imports: [FormsModule, ReactiveFormsModule, HttpClientTestingModule, RouterTestingModule, MatCheckboxModule],
      providers: [AuthService, GroupService]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InternalAccountPage1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
