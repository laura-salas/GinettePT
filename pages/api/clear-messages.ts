import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'scripts/api/messages.json');

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      fs.writeFileSync(dataFilePath, JSON.stringify([]));
      res.status(200).json({ message: 'Messages cleared successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Failed to clear messages' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
