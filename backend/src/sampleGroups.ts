import { UserModel } from "./models/user.model";

const user1 = new UserModel({ 
    id: "1",
    name: "John",
    surname: "Doe",
    profilePhoto: "user1.jpg",
    emailAddress: "john.doe@example.com",
    emailVerified: true,
    password: "password",
    roles: ["Manager"],
    groups: ["group1", "group2"],
  });
  
  const user2 = new UserModel({
    id: "2",
    name: "Jane",
    surname: "Smith",
    profilePhoto: "user2.jpg",
    emailAddress: "jane.smith@example.com",
    emailVerified: true,
    password: "password",
    roles: ["Functional"],
    groups: ["group1"],
  });
  
  const user3 = new UserModel({
    id: "3",
    name: "Alice",
    surname: "Johnson",
    profilePhoto: "user3.jpg",
    emailAddress: "alice.johnson@example.com",
    emailVerified: true,
    password: "password",
    roles: ["Technical"],
    groups: ["group2"],
  });

export const sample_groups: any[] = [
    {
        id: '1',
        groupName: 'Frontend',
        backgroundPhoto: '',
        people: [user1, user2],
    },
    {
        id: '2',
        groupName: 'Backend',
        backgroundPhoto: '',
        people: [user2, user3],
    },
    {
        id: '3',
        groupName: 'Integration',
        backgroundPhoto: '',
        people: [user1, user3],
    }
]