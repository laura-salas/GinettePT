import fs from 'fs';
import path from 'path';

const messagesFilePath = path.join(process.cwd(), 'scripts/api/messages.json');

export default function handler(req, res) {
  if (req.method === 'GET') {
    // Read messages from the messages.json file
    const messages = JSON.parse(fs.readFileSync(messagesFilePath, 'utf8'));
    res.status(200).json(messages);
  } else if (req.method === 'POST') {
    // Write messages to the messages.json file
    const newMessage = JSON.parse(req.body);
    const messages = JSON.parse(fs.readFileSync(messagesFilePath, 'utf8'));
    messages.push(newMessage);
    fs.writeFileSync(messagesFilePath, JSON.stringify(messages, null, 2));
    res.status(200).json(newMessage);
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}