import { TestBed, ComponentFixture } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent, Ticket } from './app.component';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { DashPanelComponent } from './dash-panel/dash-panel.component';
import { PageHeaderComponent } from './page-header/page-header.component';
import { MatIconModule } from '@angular/material/icon';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AppComponent, DashPanelComponent, PageHeaderComponent],
      imports: [HttpClientTestingModule, RouterTestingModule, MatIconModule],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;

    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);

    fixture.detectChanges();
  });

  it('should create the AppComponent', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch data from API', () => {
    const testData = {message: 'test data'};
    spyOn(window, 'alert');

    component.fetchData();

    const req = httpTestingController.expectOne('http://localhost:3000/api/data');
    expect(req.request.method).toEqual('GET');
    req.flush(testData);

    expect(window.alert).toHaveBeenCalledWith(testData.message);
  });

  it('should handle error on fetching data', () => {
    spyOn(window, 'alert');
  
    component.fetchData();
  
    const req = httpTestingController.expectOne('http://localhost:3000/api/data');
    req.flush('Error fetching data', {status: 500, statusText: 'Server Error'});
  
    expect(window.alert).toHaveBeenCalledWith('Error fetching data');
  });
  

  

  it('should search a ticket by id', () => {
    spyOn(router, 'navigate');
    component.searchTerm = '1';
    component.searchTicket();

    expect(router.navigate).toHaveBeenCalledWith(['/ticket', 1]);
  });

  it('should add new ticket', () => {
    const newTicket: Ticket = {
      id: 0,
      title: 'Test ticket',
      assignee: 'Assignee',
      reviewer: 'Reviewer',
      company: 'Test Company',
      priority: 'High',
      startDate: '2023-06-30',
      endDate: '2023-07-30',
      status: 'New',
      comments: ['Test comment']
    };

    component.addNewTicket(newTicket);

    expect(component.tickets[component.tickets.length - 1]).toEqual(newTicket);
    expect(component.showForm).toEqual(false);
  });

  afterEach(() => {
    httpTestingController.verify();
  });
});
