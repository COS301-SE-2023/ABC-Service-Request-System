const Imap = require("node-imap");
const MailParser = require("mailparser").MailParser;
const dotenv = require("dotenv");
dotenv.config();

const imap = new Imap({
  user: process.env.GMAIL_USERNAME,
  password: process.env.GMAIL_PASSWORD,
  host: "imap.gmail.com",
  port: 993,
  tls: true,
  connTimeout: 10000,
});

function openInbox(cb) {
  imap.openBox("INBOX", true, cb);
}

function fetchNewEmails() {
  openInbox((err, box) => {
    if (err) throw err;


    // Fetch the new emails
    const fetch = imap.seq.fetch(
      `${box.messages.total - 9}:${box.messages.total}`, // Adjust the range as needed
      {
        bodies: "",
      }
    );

    console.log("fetch: ", fetch);

    fetch.on("message", (msg, seqno) => {
      const mailparser = new MailParser();

      msg.on("body", (stream) => {
        stream.pipe(mailparser);
      });

      mailparser.on("end", (parsedMail) => {
        // Access the parsed email data
        const emailSubject = parsedMail.subject;
        const emailText = parsedMail.text;
        const inReplyTo = parsedMail.headers["in-reply-to"];

        console.log("emailText: ", emailText);
        console.log("inReplyTo: ", inReplyTo);

        // Check if the email subject contains "Ticket ID:"
        if (inReplyTo && inReplyTo.includes("Ticket ID:")) {
          const ticketId = inReplyTo.match(/Ticket ID: (\d+)/)[1];
          console.log(`Found email with Ticket ID: ${ticketId}`);

          // Extract the user's reply from the email text
          const userReply = extractUserReply(emailText);
          console.log("User's Reply:", userReply);

          // Implement your further processing logic here.
        }
      });
    });
  });
}

imap.once("ready", () => {
  // Start polling for new emails at a regular interval (e.g., every 30 seconds)
  setInterval(fetchNewEmails, 3000);
  console.log(`Checking for new emails in INBOX...`);
});

imap.connect();

imap.once("error", (err) => {
  console.error("IMAP Error:", err);
});

imap.on("end", () => {
  console.log("IMAP Connection ended.");
});

imap.on("reconnect", (timeout) => {
  console.log(`Reconnecting in ${timeout} seconds...`);
  setTimeout(() => {
    imap.connect();
  }, timeout * 1000);
});

// Function to extract the user's reply from the email text
function extractUserReply(emailText) {
  // Your logic to extract the user's reply here
  // You might want to search for a specific pattern or use a library like NLP for more advanced processing
  // For simplicity, let's assume the user's reply is everything after a certain delimiter, like "User Reply:"
  const delimiter = "User Reply:";
  const startIndex = emailText.indexOf(delimiter);
  if (startIndex !== -1) {
    return emailText.slice(startIndex + delimiter.length).trim();
  } else {
    return ""; // Return an empty string if no user reply is found
  }
}
