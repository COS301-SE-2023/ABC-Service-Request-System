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

export interface attachment {
    name: string,
    url: string
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