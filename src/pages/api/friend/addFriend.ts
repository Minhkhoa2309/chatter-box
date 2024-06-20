import prisma from "@/lib/prisma";
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { userId, friendId }: { userId: number, friendId: number } = req.body;

    if (userId === friendId) {
      return res.status(400).json({ error: 'You cannot add yourself as a friend' });
    }

    try {
      // Check if both users exist
      const userOne = await prisma.user.findUnique({ where: { id: Number(userId) } })
      const userTwo = await prisma.user.findUnique({ where: { id: Number(friendId) } })

      if (!userOne || !userTwo) {
        return res.status(404).json({ message: 'One or both users not found' })
      }

      // Check if the friendship already exists
      const existingFriendship = await prisma.friendship.findFirst({
        where: {
          OR: [
            { userOneId: Number(userId), userTwoId: Number(friendId) },
            { userOneId: Number(friendId), userTwoId: Number(userId) }
          ]
        }
      })

      if (existingFriendship) {
        return res.status(400).json({ message: 'Friendship already exists' })
      }

      // Create the friendship
      const newFriendship = await prisma.friendship.create({
        data: {
          userOneId: Number(userId),
          userTwoId: Number(friendId)
        }
      })
      // Check if a chat already exists between the two users
      const existingChat = await prisma.chat.findFirst({
        where: {
          users: {
            some: {
              userId: {
                in: [Number(userId), Number(friendId)]
              }
            }
          }
        }
      })

      // If no existing chat, create a new chat
      let newChat
      if (!existingChat) {
        newChat = await prisma.chat.create({
          data: {
            isGroupChat: false,
            users: {
              create: [
                { userId: Number(userId) },
                { userId: Number(friendId) }
              ]
            },
            messages: {
              create: [
                {
                  senderId: Number(userId),
                  time: new Date(),
                  message: "New friendship started!"
                }
              ]
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
      }

      res.status(201).json({ message: 'Friendship added successfully', friendship: newFriendship })
    } catch (error) {
      console.error('Error adding friendship:', error)
      res.status(500).json({ message: 'Internal Server Error' })
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
