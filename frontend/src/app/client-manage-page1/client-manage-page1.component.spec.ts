import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ClientManagePage1Component } from './client-manage-page1.component';

describe('ClientManagePage1Component', () => {
  let component: ClientManagePage1Component;
  let fixture: ComponentFixture<ClientManagePage1Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ClientManagePage1Component]
    });
    fixture = TestBed.createComponent(ClientManagePage1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
