import prisma from "@/lib/prisma";
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
      const email = req.query.email as string;
  
      if (!email) {
        return res.status(400).json({ error: 'Email parameter is required' });
      }
  
      try {
        const user = await prisma.user.findUnique({
          where: { email },
        });
  
        if (!user) {
          return res.status(404).json({ error: 'User not found' });
        }
  
        res.status(200).json(user);
      } catch (error) {
        res.status(500).json({ error: 'Unable to fetch user' });
      }
    } else {
      res.setHeader('Allow', ['GET']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  }
