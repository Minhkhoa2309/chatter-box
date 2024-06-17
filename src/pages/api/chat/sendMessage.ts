import prisma from "@/lib/prisma";
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { content, senderId, roomId }: { content: string, senderId: number, roomId: number } = req.body;

    try {
      const newMessage = await prisma.message.create({
        data: {
          content,
          sender: {
            connect: { id: senderId }
          },
          room: {
            connect: { id: roomId }
          }
        }
      });

      res.status(201).json(newMessage);
    } catch (error) {
      res.status(500).json({ error: 'Unable to send message' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
