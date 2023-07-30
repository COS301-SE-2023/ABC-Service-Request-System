import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InternalAccountPage2Component } from './internal-account-page2.component';

describe('InternalAccountPage2Component', () => {
  let component: InternalAccountPage2Component;
  let fixture: ComponentFixture<InternalAccountPage2Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InternalAccountPage2Component]
    });
    fixture = TestBed.createComponent(InternalAccountPage2Component);
    component = fixture.componentInstance;
  
    // Set createdUser input
    component.createdUser = {
      id: 'test-id',
      name: 'test-name',
      surname: 'test-surname',
      profilePhoto: 'test-profilePhoto',
      headerPhoto: 'test-headerPhoto',
      emailAddress: 'test-emailAddress',
      emailVerified: false,
      password: 'test-password',
      roles: ['Technical'],
      groups: ['test-group'],
      inviteToken: 'test-inviteToken',
      bio: 'test-bio',
      github: 'test-github',
      linkedin: 'test-linkedin',
    };
    
    fixture.detectChanges();
    });
  

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
