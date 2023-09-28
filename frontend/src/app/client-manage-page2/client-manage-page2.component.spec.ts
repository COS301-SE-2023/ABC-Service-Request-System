import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ClientManagePage2Component } from './client-manage-page2.component';

describe('ClientManagePage2Component', () => {
  let component: ClientManagePage2Component;
  let fixture: ComponentFixture<ClientManagePage2Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ClientManagePage2Component],
    });
    fixture = TestBed.createComponent(ClientManagePage2Component);
    component = fixture.componentInstance;

    // Initialize selectedClient with a valid client object
    component.selectedClient = {
      id: '1',
      name: 'John',
      surname: 'Doe',
      organisation: 'Test Organisation',
      profilePhoto:'',
      email: 'john.doe@example.com',
      emailVerified: true,
      password: 'password123',
      industry: 'Test Industry',
      projects: [],
      requests:[],
    };

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
