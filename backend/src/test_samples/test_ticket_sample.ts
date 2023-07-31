import { ticket } from "../test_routers/testTicket.model";


export const sample_tickets: ticket[] = [
  {
      id: "1",
      summary: 'Update UI and bug fixes',
      assignee: 'jesse@example.com',
      assigned: 'jaimen@example.com',
      group: '1',
      priority: 'High',
      startDate: '19/05/2023',
      endDate: '23/05/2023',
      status: 'Done',
      comments: [

      ],
      description: "You need to update the UI to support the new angular material UI library and also fix the typescript bug with the header.",
      createdAt: new Date(),
      project: 'New project',
      todo: ["Change to Old Project"],
      todoChecked: [true]
  },
  {
      id: "2",
      summary: 'testing tickets',
      assignee: 'john@example.com',
      assigned: 'ashir@example.com',
      group: '2',
      priority: 'Low',
      startDate: '09/11/2023',
      endDate: '10/11/2023',
      status: 'Pending',
      comments: [
          {
              author: 'John',
              authorPhoto: 'https://res.cloudinary.com/ds2qotysb/image/upload/v1687775046/n2cjwxkijhdgdrgw7zkj.png',
              content: 'Will begin testing soon.',
              createdAt: new Date('2023-11-09'),
              type: 'status',
          },
      ],
      description: "You need to test the tickets before the client has a chance to access their portal.",
      createdAt: new Date(),
      project: 'project',
      todo: ["Change name of project"],
      todoChecked: [false]
  },
  {
      id: "3",
      summary: 'Epiuse frontend ticket',
      assignee: 'mark@example.com',
      assigned: 'priyul@example.com',
      group: '3',
      priority: 'Medium',
      startDate: '24/08/2023',
      endDate: '29/08/2023',
      status: 'Active',
      comments: [
          {
              author: 'Mark',
              authorPhoto: 'https://res.cloudinary.com/ds2qotysb/image/upload/v1687775046/n2cjwxkijhdgdrgw7zkj.png',
              content: 'Initial commit.',
              createdAt: new Date('2023-08-24'),
              type: 'status',
              attachment: 
                {
                    name: 'attachment2',
                    url: 'attachment2.pdf'
                }
          },
          {
              author: 'Priyul',
              authorPhoto: 'https://res.cloudinary.com/ds2qotysb/image/upload/v1687775046/n2cjwxkijhdgdrgw7zkj.png',
              content: 'Code review comments added.',
              createdAt: new Date('2023-08-26'),
              type: 'review',
              attachment: 
                {
                    name: 'attachment2',
                    url: 'attachment2.pdf'
                }
          },
      ],
      description: 'Update the front end ticket schema so that it conforms to new legislation.',
      createdAt: new Date(),
      project: 'Some project',
      todo: ["Specify Project", "Backend"],
      todoChecked: [true, false]
  },
];
