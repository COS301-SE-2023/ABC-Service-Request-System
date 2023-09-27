const Imap = require("node-imap");
const MailParser = require("mailparser").MailParser;
const dotenv = require("dotenv");
const fs = require("fs");
const moment = require("moment");
const format = require("date-fns");
const axios = require("axios");
dotenv.config();

const imapConfig = {
  user: process.env.GMAIL_USERNAME,
  password: process.env.GMAIL_PASSWORD,
  host: "imap.gmail.com",
  port: 993,
  tls: true,
  connTimeout: 0,
};

const imap = new Imap(imapConfig);
const COMMENT_URL = "http://localhost:3001/api/ticket/commentEmail";

// console.log(COMMENT_URL);
// console.log(USER_URL);

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
          const latestEmailUid = results[0];
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
          fetch.once("end", () => {
            console.log("Email processing complete");
            setTimeout(openInbox, 10000);
          });
        } else {
          console.log("No unread emails found.");
          setTimeout(openInbox, 10000);
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
      const replyRegex =
        /Content-Transfer-Encoding: quoted-printable\r\n\r\n([\s\S]*?)\r\n\r\nOn [\s\S]*? wrote:/;
      const replyMatch = emailBody.match(replyRegex);

      // Regular expressions to extract email and date
      const emailRegex = /From: (.+?) <(.+?)>/;
      const dateRegex = /Date: (.+)/;

      // Extract email and date from email headers
      const emailMatch = emailBody.match(emailRegex);
      const dateMatch = emailBody.match(dateRegex);

      // Check if matches were found
      if (emailMatch && emailMatch.length === 3 && dateMatch && dateMatch.length === 2) {
        const email = emailMatch[2].trim();

        console.log("Email:", email);

        if (replyMatch) {
          const reply = replyMatch[1].trim();
          console.log("Reply:", reply);

          // You can continue extracting other information from the email body as needed.
          const ticketIdMatch = emailBody.match(/Ticket ID:\s*(\d+)/);
          const ticketId = ticketIdMatch ? ticketIdMatch[1] : null;

          if (ticketId) {
            console.log("Ticket ID:", ticketId);

            const USER_URL = `http://localhost:3002/api/user/userByEmail/${encodeURIComponent(email)}`;

            axios
              .get(USER_URL, {
                params: {
                  email: email,
                },
              })
              .then((response) => {
                const userData = response.data;

                const emailPhoto = userData.profilePhoto;
                const author = userData.name + " " + userData.surname;

                const body = { ticketId, reply, emailPhoto, author};

                axios
                  .put(COMMENT_URL, body)
                  .then((response) => {
                    console.log("Response:", response.data);
                  })
                  .catch((error) => {
                    console.error("Error:", error);
                  });
              })
              .catch((error) => {
                console.error("Error fetching user data:", error);
              });
            // making a request
            // const body = {ticketId, reply, email};
            
            // this.http.put(COMMENT_URL, body);
          } else {
            console.log("Ticket ID not found in email body.");
          }
        } else {
          console.log("Reply not found in email body.");
        }
      } else {
        console.log("Email and/or Date not found in email headers.");
      }
    });
  });
}