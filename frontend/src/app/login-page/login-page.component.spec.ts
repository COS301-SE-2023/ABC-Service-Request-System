import { TestBed, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import { UserService } from 'src/services/user.service';
import { AuthService } from 'src/services/auth.service';
import { LoginPageComponent } from './login-page.component';
import { of, throwError } from 'rxjs';
import { FormsModule } from '@angular/forms';

describe('LoginPageComponent', () => {
  let component: LoginPageComponent;
  let fixture: ComponentFixture<LoginPageComponent>;
  let userService: Partial<UserService> | any;
  let authService: Partial<AuthService> | any;
  let router: Router;

  beforeEach(async () => {
    userService = {
      loginUser: () => of({ token: 'mockToken' })
    };

    authService = {
      setToken: jasmine.createSpy('set token spy'),
      getRole: () => 'user'
    };

    await TestBed.configureTestingModule({
      declarations: [LoginPageComponent],
      imports: [HttpClientTestingModule, RouterTestingModule, FormsModule, MatSlideToggleModule],
      providers: [
        { provide: UserService, useValue: userService },
        { provide: AuthService, useValue: authService }
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginPageComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should log in the user', fakeAsync(() => {
    spyOn(userService, 'loginUser').and.returnValue(of({ token: 'mockToken' }));
    spyOn(router, 'navigate');

    component.email = 'test@test.com';
    component.password = 'password';
    component.loginUser();

    tick();  // simulate passage of time for asynchronous operations

    expect(userService.loginUser).toHaveBeenCalledWith({ emailAddress: 'test@test.com', password: 'password' });
    expect(authService.setToken).toHaveBeenCalledWith('mockToken');
    expect(router.navigate).toHaveBeenCalledWith(['/dashboard']);
  }));


  it('should set error message when unauthorized', () => {
    const errorResponse = { status: 401 };
    spyOn(userService, 'loginUser').and.returnValue(throwError(errorResponse));

    component.email = 'test@test.com';
    component.password = 'password';
    component.loginUser();

    expect(component.errorMessage).toEqual('Invalid email or password');
  });

  it('should set error message when other error', () => {
    const errorResponse = { status: 500 };
    spyOn(userService, 'loginUser').and.returnValue(throwError(errorResponse));

    component.email = 'test@test.com';
    component.password = 'password';
    component.loginUser();

    expect(component.errorMessage).toEqual('User not found.');
  });

  it('should navigate to dashboard', () => {
    spyOn(router, 'navigate');

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    component.navigateToDashboard({ preventDefault: () => {} } as Event);

    expect(router.navigate).toHaveBeenCalledWith(['/dashboard']);
  });
  // More tests go here
});
