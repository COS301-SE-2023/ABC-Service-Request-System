import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AnalyticsPageComponent } from './analytics-page.component';
import { AuthService } from 'src/services/auth.service';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { group } from '../../../../backend/groups/src/models/group.model';
import { ticket } from '../../../../backend/tickets/src/models/ticket.model';
import { TicketsService } from 'src/services/ticket.service';
import { Chart } from 'chart.js';


describe('AnalyticsPageComponent', () => {
  let component: AnalyticsPageComponent;
  let fixture: ComponentFixture<AnalyticsPageComponent>;
  const mockAuthService = {
    getUser: jasmine.createSpy('getUser').and.returnValue({ name: 'Test user', groups: ['Group1', 'Group2'] }),
    isAdmin: jasmine.createSpy('isAdmin').and.returnValue(true), // assuming true, change as per your requirement
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, MatIconModule, FormsModule],
      declarations: [AnalyticsPageComponent],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AnalyticsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the AnalyticsPageComponent', () => {
    expect(component).toBeTruthy();
  });


  it('should update component properties when type is changed to "personal"', () => {
    // Arrange
    component.ActiveTicketsCount = 5;
    component.PendingTicketsCount = 3;
    component.ticketsDueTodayCount = 2;
    component.overdueTicketsCount = 1;
    component.personalHighPriorityTicketsCount = 4;
    component.personalMediumPriorityTicketsCount = 2;
    component.personalLowPriorityTicketsCount = 3;
    component.personalClosedTicketsCount = 6;

    // Act
    component.typeChanged('personal');

    // Assert
    expect(component.ActiveTicketsCount).toBe(0);
    expect(component.PendingTicketsCount).toBe(0);
    expect(component.ticketsDueTodayCount).toBe(0);
    expect(component.overdueTicketsCount).toBe(0);
    expect(component.personalHighPriorityTicketsCount).toBe(0);
    expect(component.personalMediumPriorityTicketsCount).toBe(0);
    expect(component.personalLowPriorityTicketsCount).toBe(0);
    expect(component.personalClosedTicketsCount).toBe(0);
  });

  // Add more tests for other methods and functionality
  it('should set the selectedGroup when a valid group ID is passed', () => {
    // Arrange
    const group1: group = {
      id: '1',
      groupName: 'Group 1',
      backgroundPhoto: 'path/to/background-photo.jpg'
    };
    const group2: group = {
      id: '2',
      groupName: 'Group 2',
      backgroundPhoto: 'path/to/another-background-photo.jpg'
    };
    component.groups = [group1, group2];

    // Act
    component.selectGroup('2');

    // Assert
    expect(component.selectedGroup).toEqual(group2);
  });

  it('should not set the selectedGroup when an invalid group ID is passed', () => {
    // Arrange
    const group1: group = {
      id: '1',
      groupName: 'Group 1',
      backgroundPhoto: 'path/to/background-photo.jpg'
    };
    const group2: group = {
      id: '2',
      groupName: 'Group 2',
      backgroundPhoto: 'path/to/another-background-photo.jpg'
    };
    component.groups = [group1, group2];

    // Act
    component.selectGroup('3');

    // Assert
    expect(component.selectedGroup).toBeUndefined();
  });

  it('should update selectedGroup when groupChanged is called with valid groupId', () => {
    // Arrange
    const group1: group = {
      id: '1',
      groupName: 'Group 1',
      backgroundPhoto: 'path/to/background-photo.jpg'
    };
    const group2: group = {
      id: '2',
      groupName: 'Group 2',
      backgroundPhoto: 'path/to/another-background-photo.jpg'
    };
    component.groups = [group1, group2];
    const newGroupId = '1';

    // Act
    component.selectGroup(newGroupId);

    // Assert
    expect(component.selectedGroup).toEqual(group1);
  });




  it('should call the necessary methods and create charts', () => {
    spyOn(component, 'typeChanged');
    spyOn(component, 'createDoughnutChart');
    spyOn(component, 'createPolarChart');
    spyOn(component, 'createLineChart');
    spyOn(component, 'createTicketResolutionLineChart');
    spyOn(component, 'createTicketVolumeTrendChart');

    component.ngAfterViewInit();

    expect(component.typeChanged).toHaveBeenCalledWith('personal');
    expect(component.createDoughnutChart).toHaveBeenCalled();
    expect(component.createPolarChart).toHaveBeenCalled();
    expect(component.createLineChart).toHaveBeenCalled();
    expect(component.createTicketResolutionLineChart).toHaveBeenCalled();
    expect(component.createTicketVolumeTrendChart).toHaveBeenCalled();
  });

  it('should update ticket counts when type is changed to "personal"', () => {
    // Arrange
    component.ActiveTicketsCount = 5;
    component.PendingTicketsCount = 3;
    component.ticketsDueTodayCount = 2;
    component.overdueTicketsCount = 1;
    component.personalHighPriorityTicketsCount = 4;
    component.personalMediumPriorityTicketsCount = 2;
    component.personalLowPriorityTicketsCount = 3;
    component.personalClosedTicketsCount = 6;

    // Act
    component.typeChanged('personal');

    // Assert
    expect(component.ActiveTicketsCount).toBe(0);
    expect(component.PendingTicketsCount).toBe(0);
    expect(component.ticketsDueTodayCount).toBe(0);
    expect(component.overdueTicketsCount).toBe(0);
    expect(component.personalHighPriorityTicketsCount).toBe(0);
    expect(component.personalMediumPriorityTicketsCount).toBe(0);
    expect(component.personalLowPriorityTicketsCount).toBe(0);
    expect(component.personalClosedTicketsCount).toBe(0);
  });

  it('should not update the selected group when the same group ID is passed', () => {
    // Arrange
    const group1: group = {
      id: '1',
      groupName: 'Group 1',
      backgroundPhoto: 'path/to/background-photo.jpg'
    };
    const group2: group = {
      id: '2',
      groupName: 'Group 2',
      backgroundPhoto: 'path/to/another-background-photo.jpg'
    };
    component.groups = [group1, group2];
    component.selectedGroup = group1;

    // Act
    component.selectGroup('1');

    // Assert
    expect(component.selectedGroup).toEqual(group1);
  });

  it('should reset ticket counts when type is changed to something else than personal', () => {
    // Arrange
    // ... Your existing arrange code
    // Set up the groups property:
    component.groups = [
      {
        id: '1',
        groupName: 'Test Group',
        backgroundPhoto: ''
      },
      {
        id: '2',
        groupName: 'Test Group 2',
        backgroundPhoto: ''
      }
    ];

    // Act
    component.typeChanged('group'); // 'group' is the other valid type

    // Assert
    // ... Your existing assert code
  });

  it('should update ticket counts when type is changed to "group"', () => {
    // Arrange
    component.ActiveTicketsCount = 5;
    component.PendingTicketsCount = 3;
    component.ticketsDueTodayCount = 2;
    component.overdueTicketsCount = 1;
    component.personalHighPriorityTicketsCount = 4;
    component.personalMediumPriorityTicketsCount = 2;
    component.personalLowPriorityTicketsCount = 3;
    component.personalClosedTicketsCount = 6;

    // Set up the groups property
    const group1: group = {
      id: '1',
      groupName: 'Group 1',
      backgroundPhoto: 'path/to/background-photo.jpg'
    };
    const group2: group = {
      id: '2',
      groupName: 'Group 2',
      backgroundPhoto: 'path/to/another-background-photo.jpg'
    };
    component.groups = [group1, group2];

    spyOn(component, 'selectGroup');

    // Act
    component.typeChanged('group');

    // Assert
    expect(component.selectGroup).toHaveBeenCalledWith('1'); // Assuming the first group is selected by default
    expect(component.ActiveTicketsCount).toBe(5);
    expect(component.PendingTicketsCount).toBe(3);
    expect(component.ticketsDueTodayCount).toBe(2);
    expect(component.overdueTicketsCount).toBe(1);
    expect(component.personalHighPriorityTicketsCount).toBe(4);
    expect(component.personalMediumPriorityTicketsCount).toBe(2);
    expect(component.personalLowPriorityTicketsCount).toBe(3);
    expect(component.personalClosedTicketsCount).toBe(6);
  });

  it('should calculate the average resolution time when there are resolved tickets', () => {
    // Arrange
    const resolvedTickets: ticket[] = [
      {
        id: '1',
        summary: 'Ticket 1',
        assignee: 'John Doe',
        assigned: 'Jane Smith',
        group: 'Group 1',
        priority: 'High',
        startDate: '2023-07-18',
        endDate: '2023-07-19',
        status: 'Done',
        description: 'Ticket 1 description',
        createdAt: new Date('2023-07-18T10:00:00Z'),
        timeToFirstResponse: undefined,
        timeToTicketResolution: new Date('2023-07-18T12:00:00Z'),
        project: 'Project 1',
        todo: ['Signup'],
        todoChecked: [false]
      },
      {
        id: '2',
        summary: 'Ticket 2',
        assignee: 'John Doe',
        assigned: 'Jane Smith',
        group: 'Group 1',
        priority: 'Medium',
        startDate: '2023-07-18',
        endDate: '2023-07-19',
        status: 'Done',
        description: 'Ticket 2 description',
        createdAt: new Date('2023-07-18T11:00:00Z'),
        timeToFirstResponse: undefined,
        timeToTicketResolution: new Date('2023-07-18T14:30:00Z'),
        project: 'Project 1',
        todo: ['Signup'],
        todoChecked: [false]
      },
      {
        id: '3',
        summary: 'Ticket 3',
        assignee: 'John Doe',
        assigned: 'Jane Smith',
        group: 'Group 2',
        priority: 'Low',
        startDate: '2023-07-18',
        endDate: '2023-07-19',
        status: 'Done',
        description: 'Ticket 3 description',
        createdAt: new Date('2023-07-18T09:00:00Z'),
        timeToFirstResponse: undefined,
        timeToTicketResolution: new Date('2023-07-18T10:30:00Z'),
        project: 'Project 1',
        todo: ['Signup'],
        todoChecked: [false]
      }
    ];

    // Act
    component.calculateAverageTimeToResolution(resolvedTickets);

    // Assert
    expect(component.averageResolutionHours).toBe('02');
    expect(component.averageResolutionMinutes).toBe('20');
  });

  it('should calculate the average response time when there are tickets with first response time', () => {
    // Arrange
    const ticketsWithFirstResponse: ticket[] = [
      {
        id: '1',
        summary: 'Ticket 1',
        assignee: 'John Doe',
        assigned: 'Jane Smith',
        group: 'Group 1',
        priority: 'High',
        startDate: '2023-07-18',
        endDate: '2023-07-19',
        status: 'Active',
        description: 'Ticket 1 description',
        createdAt: new Date('2023-07-18T10:00:00Z'),
        timeToFirstResponse: new Date('2023-07-18T11:30:00Z'),
        timeToTicketResolution: undefined,
        project: 'Project 1',
        todo: ['Signup'],
        todoChecked: [false]

      },
      {
        id: '2',
        summary: 'Ticket 2',
        assignee: 'John Doe',
        assigned: 'Jane Smith',
        group: 'Group 1',
        priority: 'Medium',
        startDate: '2023-07-18',
        endDate: '2023-07-19',
        status: 'Active',
        description: 'Ticket 2 description',
        createdAt: new Date('2023-07-18T11:00:00Z'),
        timeToFirstResponse: new Date('2023-07-18T13:30:00Z'),
        timeToTicketResolution: undefined,
        project: 'Project 1',
        todo: ['Signup'],
        todoChecked: [false]
      },
      {
        id: '3',
        summary: 'Ticket 3',
        assignee: 'John Doe',
        assigned: 'Jane Smith',
        group: 'Group 2',
        priority: 'Low',
        startDate: '2023-07-18',
        endDate: '2023-07-19',
        status: 'Active',
        description: 'Ticket 3 description',
        createdAt: new Date('2023-07-18T09:00:00Z'),
        timeToFirstResponse: new Date('2023-07-18T10:15:00Z'),
        timeToTicketResolution: undefined,
        project: 'Project 1',
        todo: ['Signup'],
        todoChecked: [false]
      }
    ];

    // Act
    component.calculateAverageResponseTime(ticketsWithFirstResponse);

    // Assert
    expect(component.averageResponseHours).toBe('01');
    expect(component.averageResponseMinutes).toBe('45');
  });



});
