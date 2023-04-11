import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'scripts/api/messages.json');

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const messages = JSON.stringify(req.body);
      fs.writeFileSync(dataFilePath, messages);
      res.status(200).json({ message: 'Messages saved successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Failed to save messages' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
