"use server";
import prisma from "../../../lib/prisma";
import * as bcrypt from "bcrypt";
import * as jwt from 'jsonwebtoken'

// compare with hashed password
const comparePassword = async (
    password: string,
    hashedPassword: string,
): Promise<boolean> => {
    return await bcrypt.compare(password, hashedPassword);
}

const sendToken = (user: any) => {
    const accessToken = jwt.sign(
        {
            id: user.id,
        },
        process.env.ACCESS_TOKEN_SECRET as string,
        { expiresIn: '4h' }
    );

    const refreshToken = jwt.sign(
        {
            id: user.id,
        },
        process.env.REFRESH_TOKEN_SECRET as string,
        { expiresIn: '3d' }
    );
    return { user, accessToken, refreshToken };
}

export const login = async (loginData: any) => {
    const { email, password } = loginData;
    const user = await prisma.users.findUnique({
        where: {
            email,
        },
    });

    if (user && (await comparePassword(password, user.password))) {
        return sendToken(user);
    } else {
        return {
            user: null,
            accessToken: null,
            refreshToken: null,
            error: {
                message: 'Invalid email or password',
            },
        };
    }
}