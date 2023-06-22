import { ticket } from "./models/ticket.model";

export const sample_tickets: ticket[] = [
    {id: "1", summary: 'Update UI and bug fixes', assignee: 'Jesse', assigned: 'Jaimen', group: 'Hyperion Tech', priority: 'High', startDate: '19/05/2023', endDate: '23/05/2023', status: 'Done', comments:[]},
    {id: "2", summary: 'testing tickets', assignee: 'John', assigned: 'Ashir', group: 'AWS', priority: 'Low', startDate: '09/11/2023', endDate: '10/11/2023', status: 'Pending', comments:[]},
    {id: "3", summary: 'Epiuse frontend ticket', assignee: 'Mark', assigned: 'Priyul', group: 'NASA Tech', priority: 'Medium', startDate: '24/08/2023', endDate: '29/08/2023', status: 'Active', comments:[]},
    // write script to add tickets to this mock database
    //unit testing
    //empty search returns all -> add later
  ];
  