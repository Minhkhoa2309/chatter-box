import type { NextApiRequest, NextApiResponse } from 'next'
import jwt from 'jsonwebtoken'
import prisma from '@/lib/prisma'

const jwtConfig = {
    accessTokenSecret: process.env.NEXT_PUBLIC_JWT_ACCESS_TOKEN_SECRET as string,
    refreshTokenSecret: process.env.NEXT_PUBLIC_JWT_REFRESH_TOKEN_SECRET as string
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method Not Allowed' })
    }
    const token = req.headers.authorization

    if (!token) {
        return res.status(401).json({ error: 'Token is required' })
    }
    try {
        const decoded = jwt.verify(token, jwtConfig.accessTokenSecret) as { id: number }
    
        const user = await prisma.user.findUnique({ where: { id: decoded.id } })
    
        if (!user) {
          return res.status(401).json({ error: 'User not found' })
        }
    
        const userData = { ...user, password: undefined }
        return res.status(200).json({ userData })
      } catch (error) {
        return res.status(401).json({ error: 'Invalid Token' })
      }
}
