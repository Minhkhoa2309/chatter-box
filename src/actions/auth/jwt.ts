"use server";

// ** JWT import
import jwt from 'jsonwebtoken'
import prisma from "../../../lib/prisma";
import * as bcrypt from "bcrypt";

// ! These two secrets should be in .env file and not in any other file
const jwtConfig = {
    accessTokenSecret: process.env.NEXT_PUBLIC_JWT_ACCESS_TOKEN_SECRET,
    refreshTokenSecret: process.env.NEXT_PUBLIC_JWT_REFRESH_TOKEN_SECRET
}
type ResponseType = [number, { [key: string]: any }]

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
        jwtConfig.accessTokenSecret as string,
        { expiresIn: '4h' }
    );

    const refreshToken = jwt.sign(
        {
            id: user.id,
        },
        jwtConfig.refreshTokenSecret as string,
        { expiresIn: '3d' }
    );
    return { user, accessToken, refreshToken };
}

const generateRandomPassword = () => {
    const characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*()-_=+";
    const charactersLength = 8;

    const uniqueCharacters = [...Array.from(new Set(characters))];

    let password = "";

    for (let i = 0; i < charactersLength; i++) {
        const randomIndex = Math.floor(Math.random() * uniqueCharacters.length);
        password += uniqueCharacters[randomIndex];
    }

    return password;
};

export const login = async (loginData: any): Promise<any> => {
    return new Promise(async (resolve, reject) => {
        const { email, password } = loginData;
        const user = await prisma.users.findUnique({
            where: {
                email,
            },
        });

        if (user && password === user.password) {
            resolve(sendToken(user));
        } else {
            reject({
                user: null,
                accessToken: null,
                refreshToken: null,
                error: {
                    message: 'Invalid email or password',
                },
            })
        }
    })

}

export const registerUser = async (userData: any) => {
    const isUserExist = await prisma.users.findUnique({
        where: {
            email: userData.email,
        },
    });

    if (isUserExist) {
        return isUserExist;
    }

    const password = generateRandomPassword();

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.users.create({
        data: {
            name: userData.name,
            email: userData.email,
            password: hashedPassword,
            image: userData.image,
            createdAt: new Date()
        },
    });

    return user;
};

export const authMe = async (accessToken: string, refreshToken: string): Promise<ResponseType> => {
    return new Promise((resolve, reject) => {
        jwt.verify(accessToken, jwtConfig.accessTokenSecret as string, async (err, decoded) => {
            if (err) {
                if (err.name === 'TokenExpiredError') {
                    try {
                        const refreshTokenDecoded = jwt.decode(refreshToken, { json: true });
                        const expirationTime = refreshTokenDecoded?.exp;

                        if (expirationTime && expirationTime * 1000 < Date.now()) {
                            reject({ error: 'Unauthorized' });
                        }

                        // @ts-ignore
                        const { id: userId } = refreshTokenDecoded.payload;
                        const userData = await prisma.users.findUnique({
                            where: {
                                id: userId,
                            },
                        });

                        if (!userData) {
                            resolve([401, { error: { error: 'Invalid User' } }]);
                        }

                        const newAccessToken = jwt.sign({ id: userId }, jwtConfig.accessTokenSecret as string, {
                            expiresIn: '4h'
                        });

                        const newRefreshToken = jwt.sign({ id: userId }, jwtConfig.refreshTokenSecret as string, {
                            expiresIn: '3d'
                        });

                        window.localStorage.setItem('accessToken', newAccessToken);
                        window.localStorage.setItem('refreshToken', newRefreshToken);

                        const obj = { userData: { ...userData, password: undefined } };
                        resolve([200, obj]);

                    } catch (error) {
                        reject(error);
                    }
                } else {
                    reject({ error: 'Invalid User' });
                }
            } else {
                // ** If token is valid do nothing
                // @ts-ignore
                const userId = decoded.id

                // ** Get user that matches id in token
                if (!userId) {
                    resolve([401, { error: { error: 'Invalid User' } }]);
                }

                const user = await prisma.users.findUnique({
                    where: {
                        id: userId,
                    },
                });

                if (!user) {
                    resolve([401, { error: { error: 'Invalid User' } }]);
                }

                const userData = JSON.parse(JSON.stringify(user));
                delete userData.password;

                resolve([200, { userData }]);
            }
        });
    });
}