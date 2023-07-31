"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sample_clients = void 0;
var group1 = {
  id: "1",
  groupName: "Backend",
  backgroundPhoto: "url"
};
var group2 = {
  id: "2",
  groupName: "Frontend",
  backgroundPhoto: "url"
};
var group3 = {
  id: "3",
  groupName: "Integration",
  backgroundPhoto: "url"
};
var group4 = {
  id: "4",
  groupName: "Services",
  backgroundPhoto: "url"
};
var project1 = {
  id: "1",
  _id: "64c01aa79c2a7421c8c11200",
  name: "Mobile Application",
  logo: "logo",
  color: "green",
  assignedGroups: [group1, group2]
};
var project2 = {
  id: "2",
  name: "Absa",
  logo: "logo",
  color: "yellow",
  assignedGroups: [group3]
};
var project3 = {
  id: "3",
  name: "Something",
  logo: "logo",
  color: "white",
  assignedGroups: [group4]
};
var sample_clients = [{
  id: "1",
  name: "John",
  surname: "Smith",
  organisation: "EPIUSE",
  email: "epiuse@epiuse.com",
  emailVerified: false,
  password: "password",
  industry: "Technical",
  projects: [project3]
}, {
  id: "2",
  name: "Edwin",
  surname: "Chang",
  organisation: "Absa",
  email: "edwinchang12@absa.com",
  emailVerified: true,
  password: "password",
  industry: "Financial",
  projects: [project1, project2]
}];
exports.sample_clients = sample_clients;