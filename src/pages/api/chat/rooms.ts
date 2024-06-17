import prisma from "@/lib/prisma";
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        try {
            const rooms = await prisma.room.findMany({
                include: {
                    users: {
                        include: {
                            user: true
                        }
                    },
                    messages: {
                        include: {
                            sender: true
                        }
                    }
                }
            });
            res.status(200).json(rooms);
        } catch (error) {
            res.status(500).json({ error: 'Unable to fetch rooms' });
        }
    } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
