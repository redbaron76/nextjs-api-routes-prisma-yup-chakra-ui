import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { setCookies } from "src/utils/cookie";

import { AUTH_TOKEN_NAME } from "src/constants";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    const prisma = new PrismaClient({ log: ["query", "info"] });
    try {
      const { userId }: { userId: number } = req.body;
      const user = await prisma.user.update({
        where: { id: userId },
        data: {
          count: {
            increment: 1,
          },
        },
      });

      if (!user) throw new Error("User not found");

      await setCookies(res, [
        {
          tokenName: AUTH_TOKEN_NAME,
          expire: -1,
        },
      ]);

      // return success as true
      res.status(200).json({ success: true });
    } catch (error) {
      // return error as false
      res.status(200).json({ success: false });
    } finally {
      // disconnect at the end
      await prisma.$disconnect();
    }
  }
  res.status(405).end();
};
