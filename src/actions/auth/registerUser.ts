"use server";
import prisma from "../../../lib/prisma";
import * as bcrypt from "bcrypt";

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