// import { ComponentFixture, TestBed } from '@angular/core/testing';
// import { TeamsPageComponent } from './teams-page.component';
// import { AuthService } from '../../services/auth.service';
// import { GroupService } from '../../services/group.service';
// import { UserService } from 'src/services/user.service';
// import { Router } from '@angular/router';
// import { HttpClientTestingModule } from '@angular/common/http/testing';
// import { of } from 'rxjs';
// import { ChangeDetectorRef } from '@angular/core';
// import { DashPanelComponent } from '../dash-panel/dash-panel.component';
// import { PageHeaderComponent } from '../page-header/page-header.component';
// import { MatIconModule } from '@angular/material/icon';
// import { MatBadgeModule } from '@angular/material/badge';
// import { GroupTabletComponent } from '../group-tablet/group-tablet.component';

// describe('TeamsPageComponent', () => {
//   let component: TeamsPageComponent;
//   let fixture: ComponentFixture<TeamsPageComponent>;
//   let authServiceSpy: jasmine.SpyObj<AuthService>;
//   let groupServiceSpy: jasmine.SpyObj<GroupService>;
//   let userServiceSpy: jasmine.SpyObj<UserService>;

//   beforeEach(() => {
//     const authSpy = jasmine.createSpyObj('AuthService', ['getUser', 'isManager', 'isAdmin', 'getUserObject', 'isFunctional', 'isTechnical']);
//     const groupSpy = jasmine.createSpyObj('GroupService', ['getGroupById', 'getGroups', 'getUsersByGroupId', 'getGroupNameById']);
//     const userSpy = jasmine.createSpyObj('UserService', ['getUserById']);

//     TestBed.configureTestingModule({
//       imports: [HttpClientTestingModule, MatIconModule, MatBadgeModule],
//       declarations: [TeamsPageComponent, DashPanelComponent, PageHeaderComponent, GroupTabletComponent],
//       providers: [
//         { provide: AuthService, useValue: authSpy },
//         { provide: GroupService, useValue: groupSpy },
//         { provide: UserService, useValue: userSpy },
//         { provide: Router, useClass: class { navigate = jasmine.createSpy("navigate"); } },
//         { provide: ChangeDetectorRef, useClass: class { detectChanges = jasmine.createSpy("detectChanges"); } },
//       ]
//     });

//     fixture = TestBed.createComponent(TeamsPageComponent);
//     component = fixture.componentInstance;

//     authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
//     groupServiceSpy = TestBed.inject(GroupService) as jasmine.SpyObj<GroupService>;
//     userServiceSpy = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;

//     authServiceSpy.getUser.and.returnValue({
//       id: 'user-id',
//       groupId: 'group-id',
//       name: 'Test',
//       surname: 'User',
//       profilePhoto: 'test.jpg',
//       emailAddress: 'test.user@example.com',
//       emailVerified: true,
//       password: 'password',
//       roles: ['Technical', 'Functional'],
//       groups: ['1'],
//       inviteToken: 'token',
//       bio: 'Test bio',
//       backgroundPhoto: 'background.jpg',
//       facebook: 'facebookLink',
//       github: 'githubLink',
//       linkedin: 'linkedinLink',
//       instagram: 'instagramLink',
//       location: 'Test location'
//     });

//     authServiceSpy.isFunctional.and.returnValue(true);
//     authServiceSpy.isTechnical.and.returnValue(true);

//     groupServiceSpy.getGroupById.and.returnValue(of({
//       id: '1',
//       groupName: 'Test Group',
//       backgroundPhoto: 'some/url'
//       // Add other necessary properties of your group model
//     }));
//     groupServiceSpy.getUsersByGroupId.and.returnValue(of([]));
//     groupServiceSpy.getGroups.and.returnValue(of([]));
//     fixture.detectChanges();
//   });

//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });

//   // Add your tests here

// });
