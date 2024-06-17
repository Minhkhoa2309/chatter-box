import prisma from "@/lib/prisma";
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { name, userIds }: { name: string, userIds: number[] } = req.body;

    try {
      const newRoom = await prisma.room.create({
        data: {
          name,
          users: {
            create: userIds.map(userId => ({
              user: {
                connect: { id: userId }
              }
            }))
          }
        }
      });

      res.status(201).json(newRoom);
    } catch (error) {
      res.status(500).json({ error: 'Unable to create room' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
