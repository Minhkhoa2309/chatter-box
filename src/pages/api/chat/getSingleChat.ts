import prisma from "@/lib/prisma";
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method Not Allowed' })
    }

    const { id, userId } = req.query

    try {
        const chat = await prisma.chat.findUnique({
            where: { id: Number(id) },
            include: {
                users: {
                    include: {
                        user: true
                    }
                },
                messages: {
                    orderBy: {
                        time: 'asc'
                    }
                }
            }
        })


        if (!chat) {
            return res.status(404).json({ message: 'Chat not found' })
        }
        
        const otherUser = chat.isGroupChat ? {
            name: chat.name,
            avatar: ''
        } : chat.users.find(userChat => userChat.userId !== Number(userId))?.user;

        res.status(200).json({ chat, friend: otherUser })
    } catch (error) {
        console.error('Error fetching single chat:', error)
        res.status(500).json({ message: 'Internal Server Error' })
    }
}