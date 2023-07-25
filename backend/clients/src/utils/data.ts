import { client, project } from "../models/client.model";
import { group } from "../models/group.model";

const group1: group = {
    id: "1",
    groupName: "Backend",
    backgroundPhoto: "url",
}

const group2: group = {
    id: "2",
    groupName: "Frontend",
    backgroundPhoto: "url",
}

const group3: group = {
    id: "3",
    groupName: "Integration",
    backgroundPhoto: "url",
}

const project1: project = {
    id: "1",
    name: "Mobile Application",
    logo: "logo",
    color: "green",
    assignedGroups: [group1, group2]
}

const project2: project = {
    id: "2",
    name: "Absa",
    logo: "logo",
    color: "yellow",
    assignedGroups: [group2, group3]
}

export const sample_clients: client[] = [
    {
        id: "1",
        name: "John",
        surname: "Smith",
        organisation: "EPIUSE",
        email: "epiuse@epiuse.com",
        emailVerified: false,
        password: "password",
        industry: "Technical",
        projects: [project1],
    },
    {
        id: "2",
        name: "Edwin",
        surname: "Chang",
        organisation: "Absa",
        email: "edwinchang12@absa.com",
        emailVerified: true,
        password: "password",
        industry: "Financial",
        projects: [project1, project2]
    }
]