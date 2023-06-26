"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TicketModel = exports.ticketSchema = void 0;
var mongoose_1 = require("mongoose");
exports.ticketSchema = new mongoose_1.Schema({
    id: { type: String, required: true },
    summary: { type: String, required: true },
    assignee: { type: String, required: true },
    assigned: { type: String, required: true },
    group: { type: String, required: true },
    priority: { type: String, required: true },
    startDate: { type: String, required: true },
    endDate: { type: String, required: true },
    status: { type: String, required: true },
}, {
    toJSON: {
        virtuals: true
    },
    toObject: {
        virtuals: true
    },
    timestamps: true
});
var ticketDb = mongoose_1.connection.useDb("TicketDB");
exports.TicketModel = ticketDb.model("ticket", exports.ticketSchema);
