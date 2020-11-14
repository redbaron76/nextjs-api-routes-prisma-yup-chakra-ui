import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { setCookies } from "src/utils/cookie";
import bcrypt from "bcryptjs";

import { IUserLogin } from "src/interfaces/user";
import {
  AUTH_TOKEN_NAME,
  REFRESH_TOKEN_NAME,
  AUTH_TOKEN_EXPIRE,
  REFRESH_TOKEN_EXPIRE,
} from "src/constants";
import { reduceMeUser } from "src/utils/format";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    const prisma = new PrismaClient({ log: ["query", "info"] });
    try {
      const { login: data }: { login: IUserLogin } = req.body;
      const user = await prisma.user.findOne({
        where: {
          email: data.email,
        },
        include: {
          profile: true,
        },
      });

      if (!user) throw new Error("User not valid");

      const validPassword = await bcrypt.compare(data.password, user.password);
      if (!validPassword) throw new Error("Password not valid");

      await setCookies(res, [
        {
          tokenName: AUTH_TOKEN_NAME,
          payload: { userId: user.id },
          expire: AUTH_TOKEN_EXPIRE,
          secret: process.env.JWT_AUTH_SECRET,
        },
        {
          tokenName: REFRESH_TOKEN_NAME,
          payload: { userId: user.id, count: user.count },
          expire: REFRESH_TOKEN_EXPIRE,
          secret: process.env.JWT_REFRESH_SECRET,
        },
      ]);

      // return logged-in user
      res.status(200).json({ user: reduceMeUser(user) });
    } catch (error) {
      // return error message
      res.status(200).json({ error: { message: error.message } });
    } finally {
      // disconnect at the end
      await prisma.$disconnect();
    }
  }
  res.status(405).end();
};
