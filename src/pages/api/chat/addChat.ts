import prisma from "@/lib/prisma";
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { userIds, name, isGroupChat }: { userIds: number[], name: string, isGroupChat: boolean } = req.body;


        try {
            const chat = await prisma.chat.create({
                data: {
                    isGroupChat: isGroupChat,
                    name: isGroupChat ? name : '',
                    users: {
                        createMany: {
                            data: userIds.map(userId => ({ userId }))
                        }
                    }
                },
                include: {
                    messages: true,
                    users: {
                        include: {
                            user: true
                        }
                    }
                }
            })

            res.status(201).json({ chat })
        } catch (error) {
            console.error('Error adding friendship:', error)
            res.status(500).json({ message: 'Internal Server Error' })
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
