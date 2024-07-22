import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    // Log the request body
    console.log('Incoming data:', req.body);

    // Send a response
    res.status(200).json({ message: 'Data logged successfully' });
  } else {
    // Handle other HTTP methods if needed
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
