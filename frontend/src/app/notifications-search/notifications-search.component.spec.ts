import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NotificationsSearchComponent } from './notifications-search.component';
import { DashPanelComponent } from '../dash-panel/dash-panel.component';
import { PageHeaderComponent } from '../page-header/page-header.component';
import { MatIconModule } from '@angular/material/icon';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('NotificationsSearchComponent', () => {
  let component: NotificationsSearchComponent;
  let fixture: ComponentFixture<NotificationsSearchComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, MatIconModule],
      declarations: [NotificationsSearchComponent, DashPanelComponent, PageHeaderComponent],
      schemas: [NO_ERRORS_SCHEMA]
    });
    fixture = TestBed.createComponent(NotificationsSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
