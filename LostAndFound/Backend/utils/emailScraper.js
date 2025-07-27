const Imap = require('imap');
const simpleParser = require('simple-parser');
const Item = require('../models/Item'); // Assuming "Item" model is used to save entries

// Configuration for the email scraper
const imapConfig = {
    user: process.env.EMAIL_USER, // Replace with the email
    password: process.env.EMAIL_PASS,  // Replace with the email password
    host: 'imap.thapar.edu',          // Thapar University's IMAP host
    port: 993,                        // IMAP port
    tls: true,                        // Secure connection
};

const scrapeEmails = async () => {
    const imap = new Imap(imapConfig);

    imap.once('ready', () => {
        imap.openBox('INBOX', true, (err, box) => {
            if (err) throw err;

            // Fetch emails
            const fetch = imap.seq.fetch('1:*', { bodies: '' });

            fetch.on('message', (msg) => {
                msg.on('body', (stream) => {
                    simpleParser(stream, async (err, parsed) => {
                        if (err) throw err;

                        // Extract relevant details from the email
                        const subject = parsed.subject || '';
                        const body = parsed.text || '';
                        
                        // Example logic: Check for "Lost" or "Found" keywords in the subject
                        const isLost = subject.toLowerCase().includes('lost');
                        const isFound = subject.toLowerCase().includes('found');

                        if (isLost || isFound) {
                            const newItem = new Item({
                                title: subject,
                                description: body,
                                location: 'Extracted from body if available',
                                contact: 'Extracted from body if available',
                                isLost,
                                reportedBy: 'Captain Manjit Singh', // Static user for these entries
                            });

                            await newItem.save();
                            console.log(`Saved item: ${newItem.title}`);
                        }
                    });
                });
            });

            fetch.once('end', () => {
                imap.end();
            });
        });
    });

    imap.once('error', (err) => {
        console.error('IMAP error:', err);
    });

    imap.once('end', () => {
        console.log('Scraper finished.');
    });

    imap.connect();
};

module.exports = scrapeEmails;
