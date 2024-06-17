import type { NextApiRequest, NextApiResponse } from 'next'
import jwt from 'jsonwebtoken'
import prisma from '@/lib/prisma'

const jwtConfig = {
  accessTokenSecret: process.env.NEXT_PUBLIC_JWT_ACCESS_TOKEN_SECRET as string
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { email, password, name } = req.body

    const isEmailAlreadyInUse = await prisma.user.findUnique({ where: { email } })

    if (isEmailAlreadyInUse) {

      res.status(400).json({ error: { email: ['Email is already in use'] } })
    } else {
      const newUser = await prisma.user.create({
        data: {
          email,
          password,
          name
        }
      })

      const accessToken = jwt.sign({ id: newUser.id }, jwtConfig.accessTokenSecret, { expiresIn: '4h' })

      res.status(200).json({ accessToken })
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' })
  }
}
