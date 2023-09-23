import { Schema, connection } from "mongoose"
// const ticketDb = dbConnection(); <- this breaks it

export interface comment {
    author: string;
    authorPhoto: string;
    content: string;
    createdAt: Date;
    type: string;
    attachment?: attachment,
}

export interface history {
    personWhoChangedAssigned : string;
    personWhoChangedPhoto: string;
    prevAssignedName : string;
    prevAssignedPhoto: string;
    newAssignedName: string;
    newAssignedPhoto: string;
}

export interface attachment {
    name: string,
    url: string
}

export interface worklog {
    author: string;
    authorPhoto: string;
    timeSpent: string;
    timeRemaining: string;
    dateStarted: Date;
    timeStarted: string;
    description: string;
}

// export interface WorklogResponse {
//     summary: string[];
//     worklogs: worklog[];
// }

export interface WorklogEntry {
    ticketSummary: string;
    worklog: worklog;
}


export interface ticket{
    id: string,
    summary: string,
    assignee: string,
    assigned: string,
    group: string,
    priority: "High" | "Medium" | "Low",
    startDate: string,
    endDate: string,
    status: "Done" | "Pending" | "Active",
    comments?: comment [],
    history?: history[],
    workLogs?: worklog[],
    description: string,
    createdAt: Date;
    timeToFirstResponse?: Date,
    timeToTicketResolution?: Date
    project: string,
    todo: string[],
    todoChecked: boolean[]
}

const attachmentSchema = new Schema<attachment>(
    {
        name: {type: String},
        url: {type:String},
    }
)

const commentSchema = new Schema<comment>(
    {
      author: { type: String, required: true },
      authorPhoto: { type: String, required: true},
      content: { type: String, required: true },
      createdAt: { type: Date, required: true },
      type: { type: String, required: true },
      attachment: { type: attachmentSchema },
    },
    {
      _id: false,
    }
);

const historySchema = new Schema<history>(
    {
        personWhoChangedAssigned : {type: String, required: true},
        personWhoChangedPhoto: {type: String, required: true},
        prevAssignedName : {type: String, required: true},
        prevAssignedPhoto: {type: String, required: true},
        newAssignedName: {type: String, required: true},
        newAssignedPhoto: {type: String, required: true},
    },
    {
        _id: false,
    }
);


const worklogSchema = new Schema<worklog>(
    {
        author: { type: String, required: true },
        authorPhoto: { type: String, required: true},
        timeSpent: { type: String, required: true },
        timeRemaining: { type: String, required: true },
        dateStarted: { type: Date, required: true },
        timeStarted: { type: String, required: true },
        description: { type: String, required: true },
    }
);

export const ticketSchema = new Schema<ticket>(
    {
        id: {type: String, required: true},
        summary: {type: String, required: true},
        assignee: {type: String, required: true},
        assigned: {type: String, required: true},
        group: {type: String, required: true},
        priority: {type: String, required: true},
        startDate: {type: String, required: true},
        endDate: {type: String, required: true},
        status: {type: String, required: true},
        comments: {type: [commentSchema]},
        history: {type: [historySchema]},
        workLogs: [worklogSchema],
        description: {type: String, required: true},
        timeToFirstResponse: {type: Date},
        timeToTicketResolution: {type: Date},
        project: {type: String, required: true},
        todo: {type: [String]},
        todoChecked: {type: [Boolean]}
    },{
        toJSON: {
            virtuals: true
        },
        toObject: {
            virtuals: true
        },
        timestamps: true
    }
);

const ticketDb = connection.useDb("TicketDB");
export const TicketModel = ticketDb.model("ticket", ticketSchema);