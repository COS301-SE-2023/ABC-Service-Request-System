import { ticket } from "./models/ticket.model";

export const sample_tickets: ticket[] = [
  {
      id: "1",
      summary: 'Update UI and bug fixes',
      assignee: 'Jesse',
      assigned: 'Jaimen',
      group: 'Hyperion Tech',
      priority: 'High',
      startDate: '19/05/2023',
      endDate: '23/05/2023',
      status: 'Done',
      comments: [

      ],
  },
  {
      id: "2",
      summary: 'testing tickets',
      assignee: 'John',
      assigned: 'Ashir',
      group: 'AWS',
      priority: 'Low',
      startDate: '09/11/2023',
      endDate: '10/11/2023',
      status: 'Pending',
      comments: [
          {
              author: 'John',
              content: 'Will begin testing soon.',
              createdAt: new Date('2023-11-09'),
              type: 'status',
          },
      ],
  },
  {
      id: "3",
      summary: 'Epiuse frontend ticket',
      assignee: 'Mark',
      assigned: 'Priyul',
      group: 'NASA Tech',
      priority: 'Medium',
      startDate: '24/08/2023',
      endDate: '29/08/2023',
      status: 'Active',
      comments: [
          {
              author: 'Mark',
              content: 'Initial commit.',
              createdAt: new Date('2023-08-24'),
              type: 'status',
              attachmentUrl: 'http://example.com/commit1',
          },
          {
              author: 'Priyul',
              content: 'Code review comments added.',
              createdAt: new Date('2023-08-26'),
              type: 'review',
              attachmentUrl: 'http://example.com/review1',
          },
      ],
  },
];
