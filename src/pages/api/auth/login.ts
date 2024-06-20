import type { NextApiRequest, NextApiResponse } from 'next'
import jwt from 'jsonwebtoken'
import prisma from '@/lib/prisma'

const jwtConfig = {
    accessTokenSecret: process.env.JWT_ACCESS_TOKEN_SECRET as string
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { email, password } = req.body

        const user = await prisma.user.findUnique({ where: { email } })

        if (user && user.password === password) {
            const accessToken = jwt.sign({ id: user.id }, jwtConfig.accessTokenSecret, { expiresIn: '4h'});

            const response = {
                accessToken,
                userData: { ...user, password: undefined }
            }

            res.status(200).json(response)
        } else {
            res.status(400).json({ error: { email: ['Email or Password is Invalid'] } })
        }
    } else {
        res.status(405).json({ error: 'Method Not Allowed' })
    }
}
