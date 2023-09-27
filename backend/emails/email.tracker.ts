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

        // Process the latest email only
        if (results.length > 0) {
          const latestEmailUid = results[results.length - 1];
          const fetch = imap.fetch(latestEmailUid, { bodies: "", unseen: true });
          fetch.on("message", (msg) => {
            processEmail(msg);
            // Mark the email as read
          

            // imap.addFlags(latestEmailUid, flagsToAdd, (err) => {
            //   if (err) {
            //     console.error("Error marking email as read:", err);
            //   } else {
            //     console.log("Email marked as read.");
            //   }
            // });

            imap.fetch(latestEmailUid, {
              bodies: "",
              markSeen: true,
            });
          });
          fetch.once("end", () => console.log("Email processing complete"));
        } else {
          console.log("No unread emails found.");
        }
      }
    );
  });
}

function processEmail(msg) {
  let emailBody = ""; // Initialize an empty string to store the email body

  msg.on("body", (stream) => {
    stream.on("data", (chunk) => {
      // Append each chunk of data to the emailBody string
      emailBody += chunk.toString("utf8");
    });

    stream.once("end", () => {
      // Use regular expressions to extract the reply
      const replyRegex = /Content-Transfer-Encoding: quoted-printable\r\n\r\n([\s\S]*?)\r\n\r\nOn [\s\S]*? wrote:/;
      const replyMatch = emailBody.match(replyRegex);
      
      if (replyMatch) {
        const reply = replyMatch[1].trim();
        console.log("Reply:", reply);
      } else {
        console.log("Reply not found in email body.");
      }

      // You can continue extracting other information from the email body as needed.
      const ticketIdMatch = emailBody.match(/Ticket ID:\s*(\d+)/);
      const ticketId = ticketIdMatch ? ticketIdMatch[1] : null;

      if (ticketId) {
        console.log("Ticket ID:", ticketId);
      } else {
        console.log("Ticket ID not found in email body.");
      }
    });
  });
}



