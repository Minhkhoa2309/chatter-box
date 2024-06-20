import prisma from "@/lib/prisma";
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' })
  }

  const { userId } = req.query

  try {
    const userChats = await prisma.chat.findMany({
      where: {
        users: {
          some: {
            userId: Number(userId)
          }
        }
      },
      include: {
        users: {
          include: {
            user: true
          }
        },
        messages: {
          orderBy: {
            time: 'desc'
          }
        }
      }
    })
    
    const chats = userChats.map((chat) => {
      const otherUser = chat.users.find(userChat => userChat.userId !== Number(userId))?.user

      return {
        id: chat.id,
        name: chat.isGroupChat ? chat.name : otherUser ? otherUser.name : 'Unknown',
        avatar: chat.isGroupChat ? '' : otherUser ? otherUser.avatar : '',
        chat: {
          id: chat.id,
          lastMessage: chat.messages[chat.messages.length - 1]
        }
      }
    })

    const userFriendships = await prisma.friendship.findMany({
      where: {
        OR: [
          { userOneId: Number(userId) },
          { userTwoId: Number(userId) }
        ]
      },
      include: {
        userOne: true,
        userTwo: true
      }
    })

    // Map friendships to extract friend's information (excluding the user)
    const userFriends = userFriendships.map(friendship => {
      if (friendship.userOneId === Number(userId)) {
        return friendship.userTwo
      } else {
        return friendship.userOne
      }
    }).filter(user => user.id !== Number(userId))

    res.status(200).json({ chats, userFriends })
  } catch (error) {
    console.error('Error fetching user chats and friendships:', error)
    res.status(500).json({ message: 'Internal Server Error' })
  }
}