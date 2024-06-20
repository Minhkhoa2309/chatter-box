import prisma from "@/lib/prisma";
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' })
  }

  const { chatId, senderId, message } = req.body.data

  try {
    // Check if chat exists
    const chat = await prisma.chat.findUnique({
      where: { id: Number(chatId) }
    })


    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' })
    }

    // Create a new message
    const newMessage = await prisma.message.create({
      data: {
        chatId: Number(chatId),
        senderId: Number(senderId),
        message,
        time: new Date(),
      }
    })


    res.status(201).json({ newMessage })
  } catch (error) {
    console.error('Error sending message:', error)
    res.status(500).json({ message: 'Internal Server Error' })
  }
}