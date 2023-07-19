import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { Injectable } from "@angular/core";
import { ticket, attachment, TicketModel } from "../../../backend/src/models/ticket.model";
import { UserModel, user } from "../../../backend/src/models/user.model";
import { map, switchMap, tap } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})

export class TicketsService {
  TICKET_URL = 'http://localhost:3000/api/ticket';
  USER_URL: any;
  API_URL = 'http://localhost:3000/api/user';

  constructor(private http: HttpClient, private router: Router) { }

  getAllTickets(){
    return this.http.get<ticket[]>(this.TICKET_URL);
  }

  getTicketWithID(objectId: string){
    return this.http.get<ticket>(`${this.TICKET_URL}/id?id=${objectId}`);
  }

  getTicketsWithName(userName: string) {
    return this.http.get<ticket[]>(`${this.TICKET_URL}/assigned?id=${userName}`);
  }

  getAllProjectNamesForCurrentUserWithGroupName(groupName: string){
    console.log('groupname service: ', groupName);
    return this.http.get<string[]>(`${this.TICKET_URL}/projects?groupName=${groupName}`);
  }

  makeAComment(ticketId: string, comment: string, author: string, authorPhoto: string, type: string, attachment: attachment){
    const body = {ticketId, comment, author, authorPhoto, type, attachment};
    return this.http.put(`${this.TICKET_URL}/comment`, body);
  }

  // Add Ticket Functionality
  addTicket(summary: string,  description: string, assignee: string, assigned: string, group: string, priority: string, startDate: string, endDate: string, status: string, comments: string[], project: string) {
    const body = {summary, description, assignee, assigned, group, priority, startDate, endDate, status, comments, project};
   console.log('Ticket is added service:', body);
    return this.http.post(`${this.TICKET_URL}/addticket`, body);
  }

  uploadFile(file: File) {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post<{ url: string }>(`${this.TICKET_URL}/upload`, formData);
  }

  updateTicketStatus(ticketId: string, status: string) {
    const body = {ticketId, status};
    return this.http.put(`${this.TICKET_URL}/updateStatus`, body);
  }

  addTimeToFirstResponse(ticketId: string, commentTime: Date) {
    return this.http.post(`${this.TICKET_URL}/addTimeToFirstResponse`, {ticketId, commentTime});
  }

//   //Personal Analytics
//   getActiveTicketsByUserId(userId: string) {
//     return this.http.get<user>(`${this.API_URL}/id`, { params: { id: userId } }).pipe(
//         switchMap(user => {
//             console.log("Current" + user.name); // Log the user
//             return this.http.get<ticket[]>(this.TICKET_URL).pipe(
//                 tap((tickets: any) => console.log(tickets)), // Log the tickets
//                 map(tickets => {
//                     // Filter only the tickets that are active and assigned to the user
//                     return tickets.filter((ticket: { status: string; assigned: string; }) => {
//                         console.log(ticket); // Log each ticket
//                         // Adjust this line to compare with user.name instead of user.id
//                         return ticket.status === "Active" && ticket.assigned === user.name;
//                     });
//                 })
//             )
//         })
//     )
//   }

//   getPendingTicketsByUserId(userId: string) {
//     return this.http.get<user>(`${this.API_URL}/id`, { params: { id: userId } }).pipe(
//         switchMap(user => {
//             console.log(user); // Log the user
//             return this.http.get<ticket[]>(this.TICKET_URL).pipe(
//                 tap((tickets: any) => console.log(tickets)), // Log the tickets
//                 map(tickets => {
//                     // Filter only the tickets that are active and assigned to the user
//                     return tickets.filter((ticket: { status: string; assigned: string; }) => {
//                         console.log(ticket); // Log each ticket
//                         // Adjust this line to compare with user.name instead of user.id
//                         return ticket.status === "Pending" && ticket.assigned === user.name;
//                     });
//                 })
//             )
//         })
//     )
//   }

//   getOverdueTicketsByUserId(userId: string) {
//     return this.http.get<user>(`${this.API_URL}/id`, { params: { id: userId } }).pipe(
//       switchMap(user => {
//         console.log(user); // Log the user
//         return this.http.get<ticket[]>(this.TICKET_URL).pipe(
//           tap((tickets: any) => console.log(tickets)), // Log the tickets
//           map(tickets => {
//             // Filter only the tickets that are overdue, active, pending, and assigned to the user
//             const currentDate = new Date();
//             const overdueTickets = tickets.filter((ticket: { status: string; assigned: string; endDate: string; }) => {
//               const endDate = new Date(ticket.endDate);
//               return (
//                 (ticket.status === "Active" || ticket.status === "Pending") &&
//                 ticket.assigned === user.name &&
//                 endDate < currentDate
//               );
//             });

//             console.log("Overdue Tickets:", overdueTickets);
//             return overdueTickets;
//           })
//         );
//       })
//     );
//   }


//   getDueTodayTicketsByUserId(userId: string) {
//     return this.http.get<user>(`${this.API_URL}/id`, { params: { id: userId } }).pipe(
//       switchMap(user => {
//         console.log(user); // Log the user
//         return this.http.get<ticket[]>(this.TICKET_URL).pipe(
//           tap((tickets: any) => console.log(tickets)), // Log the tickets
//           map(tickets => {
//             // Filter only the tickets that are due today, active, pending, and assigned to the user
//             const currentDate = new Date();
//             const dueTodayTickets = tickets.filter((ticket: { status: string; assigned: string; endDate: string; }) => {
//               const endDate = new Date(ticket.endDate);
//               return (
//                 (ticket.status === "Active" || ticket.status === "Pending") &&
//                 ticket.assigned === user.name &&
//                 endDate.toDateString() === currentDate.toDateString()
//               );
//             });

//             console.log("Due Today Tickets:", dueTodayTickets);
//             return dueTodayTickets;
//           })
//         );
//       })
//     );
//   }

//   //Group Analytics
//   getActiveTicketsInGroup(userId: string, groupName: string) {
//     return this.http.get<user>(`${this.API_URL}/id`, { params: { id: userId } }).pipe(
//         switchMap(user => {
//             //console.log(user); // Log the user
//             return this.getAllTickets().pipe(
//                 tap((tickets: any) => console.log(tickets)), // Log the tickets
//                 map(tickets => {
//                     // Filter only the tickets that are active and in the specified group
//                     const activeTickets = tickets.filter((ticket: { status: string; group: { groupName: string } }) => {
//                         console.log(`Ticket Status: ${ticket.status}, Expected: Active`); // Log ticket status
//                         console.log(`Ticket Group: ${ticket.group}, Expected: ${groupName}`); // Log ticket group

//                         //get groupid from groupname




//                         if (ticket.status === "Active" && ticket.group.groupName === groupName) {
//                             console.log("Match Found: ", ticket);
//                             return true;
//                         } else {
//                             console.log("Match Not Found: ", ticket);
//                             return false;
//                         }
//                     });

//                     // Return the count of active tickets
//                     console.log("Active Tickets:", activeTickets);
//                     return activeTickets.length;
//                 })
//             )
//         })
//     )
// }



//   getPendingTicketsInGroup(userId: string, groupId: string) {
//     return this.http.get<user>(`${this.API_URL}/id`, { params: { id: userId } }).pipe(
//         switchMap(user => {
//             //console.log(user); // Log the user
//             return this.getAllTickets().pipe(
//                 tap((tickets: any) => console.log(tickets)), // Log the tickets
//                 map(tickets => {
//                     // Filter only the tickets that are active (or overdue) and assigned to the user, and in the specified group
//                     return tickets.filter((ticket: { status: string; assigned: string; groupId: string; dueDate: string; }) => {
//                         //console.log(ticket); // Log each ticket
//                         const dueDate = new Date(ticket.dueDate);
//                         const now = new Date();
//                         // Adjust this line to compare with user.name instead of user.id
//                         return ((ticket.status === "Pending" || dueDate < now) && ticket.assigned === user.name && ticket.groupId === groupId);
//                     });
//                 })
//             )
//         })
//     )
//   }


//   getOverdueTicketsInGroup(userId: string, groupId: string) {
//     return this.http.get<user>(`${this.API_URL}/id`, { params: { id: userId } }).pipe(
//         switchMap(user => {
//             //console.log(user); // Log the user
//             return this.getAllTickets().pipe(
//                 tap((tickets: any) => console.log(tickets)), // Log the tickets
//                 map(tickets => {
//                     // Filter only the tickets that are overdue and assigned to the user, and in the specified group
//                     return tickets.filter((ticket: { status: string; assigned: string; groupId: string; dueDate: string; }) => {
//                         //console.log(ticket); // Log each ticket
//                         const dueDate = new Date(ticket.dueDate);
//                         const now = new Date();
//                         // Adjust this line to compare with user.name instead of user.id
//                         return (dueDate < now && ticket.assigned === user.name && ticket.groupId === groupId);
//                     });
//                 })
//             )
//         })
//     )
//   }

//   getTicketsDueTodayInGroup(userId: string, groupId: string) {
//     return this.http.get<user>(`${this.API_URL}/id`, { params: { id: userId } }).pipe(
//         switchMap(user => {
//             //console.log(user); // Log the user
//             return this.getAllTickets().pipe(
//                 tap((tickets: any) => console.log(tickets)), // Log the tickets
//                 map(tickets => {
//                     // Filter only the tickets that are due today and assigned to the user, and in the specified group
//                     return tickets.filter((ticket: { status: string; assigned: string; groupId: string; dueDate: string; }) => {
//                         //console.log(ticket); // Log each ticket
//                         const dueDate = new Date(ticket.dueDate);
//                         const now = new Date();
//                         // Compare only the date and ignore time
//                         const isDueToday = dueDate.getDate() === now.getDate() && dueDate.getMonth() === now.getMonth() && dueDate.getFullYear() === now.getFullYear();
//                         // Adjust this line to compare with user.name instead of user.id
//                         return (isDueToday && ticket.assigned === user.name && ticket.groupId === groupId);
//                     });
//                 })
//             )
//         })
//     )
//   }



//   getActiveTicketsByUserIdAndGroupId(userId: string, groupId: string) {
//     return this.http.get<user>(`${this.API_URL}/id`, { params: { id: userId } }).pipe(
//       switchMap(user => {
//         console.log(user); // Log the user
//         return this.http.get<ticket[]>(this.TICKET_URL).pipe(
//           tap((tickets: any) => console.log(tickets)), // Log the tickets
//           map(tickets => {
//             // Filter only the tickets that are active, assigned to the user, and in the specified group
//             return tickets.filter((ticket: { status: string; assigned: string; groupId: string; }) => {
//               console.log(ticket); // Log each ticket
//               // Adjust this line to compare with user.name instead of user.id
//               return ticket.status === "Active" && ticket.assigned === user.name && ticket.groupId === groupId;
//             });
//           })
//         )
//       })
//     )
//   }

//   getPendingTicketsByUserIdAndGroupId(userId: string, groupId: string) {
//     return this.http.get<user>(`${this.API_URL}/id`, { params: { id: userId } }).pipe(
//       switchMap(user => {
//         console.log(user); // Log the user
//         return this.http.get<ticket[]>(this.TICKET_URL).pipe(
//           tap((tickets: any) => console.log(tickets)), // Log the tickets
//           map(tickets => {
//             // Filter only the tickets that are pending, assigned to the user, and in the specified group
//             return tickets.filter((ticket: { status: string; assigned: string; groupId: string; }) => {
//               console.log(ticket); // Log each ticket
//               return ticket.status === "Pending" && ticket.assigned === user.name && ticket.groupId === groupId;
//             });
//           })
//         )
//       })
//     )
//   }

//   getOverdueTicketsByUserIdAndGroupId(userId: string, groupId: string) {
//     return this.http.get<user>(`${this.API_URL}/id`, { params: { id: userId } }).pipe(
//       switchMap(user => {
//         console.log(user); // Log the user
//         return this.http.get<ticket[]>(this.TICKET_URL).pipe(
//           tap((tickets: any) => console.log(tickets)), // Log the tickets
//           map(tickets => {
//             // Filter only the tickets that are overdue, active or pending, assigned to the user, and in the specified group
//             const currentDate = new Date();
//             const overdueTickets = tickets.filter((ticket: { status: string; assigned: string; endDate: string; groupId: string; }) => {
//               const endDate = new Date(ticket.endDate);
//               return (
//                 (ticket.status === "Active" || ticket.status === "Pending") &&
//                 ticket.assigned === user.name &&
//                 endDate < currentDate &&
//                 ticket.groupId === groupId
//               );
//             });

//             console.log("Overdue Tickets:", overdueTickets);
//             return overdueTickets;
//           })
//         );
//       })
//     );
//   }

//   getDueTodayTicketsByUserIdAndGroupId(userId: string, groupId: string) {
//     return this.http.get<user>(`${this.API_URL}/id`, { params: { id: userId } }).pipe(
//       switchMap(user => {
//         console.log(user); // Log the user
//         return this.http.get<ticket[]>(this.TICKET_URL).pipe(
//           tap((tickets: any) => console.log(tickets)), // Log the tickets
//           map(tickets => {
//             // Filter only the tickets that are due today, active or pending, assigned to the user, and in the specified group
//             const currentDate = new Date();
//             const dueTodayTickets = tickets.filter((ticket: { status: string; assigned: string; endDate: string; groupId: string; }) => {
//               const endDate = new Date(ticket.endDate);
//               return (
//                 (ticket.status === "Active" || ticket.status === "Pending") &&
//                 ticket.assigned === user.name &&
//                 endDate.toDateString() === currentDate.toDateString() &&
//                 ticket.groupId === groupId
//               );
//             });

//             console.log("Due Today Tickets:", dueTodayTickets);
//             return dueTodayTickets;
//           })
//         );
//       })
//     );
//   }





}
