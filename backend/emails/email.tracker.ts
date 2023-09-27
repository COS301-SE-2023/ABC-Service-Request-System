const Imap = require("node-imap");
const MailParser = require("mailparser").MailParser;
const dotenv = require("dotenv");
const fs = require("fs");
const moment = require("moment");
dotenv.config();

const imapConfig = {
  user: process.env.GMAIL_USERNAME,
  password: process.env.GMAIL_PASSWORD,
  host: "imap.gmail.com",
  port: 993,
  tls: true,
  connTimeout: 10000,
};

const imap = new Imap(imapConfig);

imap.once("ready", () => {
  console.log("Connected to IMAP server");
  openInbox();
});

imap.once("error", (err) => {
  console.error("IMAP error:", err);
});

imap.connect();

const currentDate = moment().format("YYYY-MM-DD"); 

function openInbox() {
  imap.openBox("INBOX", false, (err, box) => {
    if (err) {
      console.error("Error opening mailbox:", err);
      return;
    }

    // Search for unread emails with a specific subject received on the current day
    imap.search(
      [["SUBJECT", "New Ticket Created"], "UNSEEN", ["SINCE", currentDate]],
      (err, results) => {
        if (err) {
          console.error("Error searching for emails:", err);
          return;
        }

        // Fetch email details for each result
        results.forEach((emailUid) => {
          const fetch = imap.fetch(emailUid, { bodies: "", unseen: true });
          fetch.on("message", processEmail);
          fetch.once("end", () => console.log("Email processing complete"));
        });
      }
    );
  });
}

function processEmail(msg) {
  msg.on("body", (stream) => {
    let data = "";

    stream.on("data", (chunk) => {
      data += chunk.toString("utf8");

      
    });

    stream.once("end", () => {
      const emailHeaders = Imap.parseHeader(data);
      const ticketId = emailHeaders["In-Reply-To"]
        ? emailHeaders["In-Reply-To"][0]
        : null;
      const response = emailHeaders["References"]
        ? emailHeaders["References"][0]
        : null;

      // Check if the headers exist before accessing their values
      if (ticketId) {
        console.log("Ticket ID:", ticketId);
      } else {
        console.log("Ticket ID not found in email headers.");
      }

      if (response) {
        console.log("Response:", response);
      } else {
        console.log("Response not found in email headers.");
      }
    });
  });
}
