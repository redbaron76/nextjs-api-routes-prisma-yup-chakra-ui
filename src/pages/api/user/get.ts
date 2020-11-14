import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    const prisma = new PrismaClient({ log: ["query", "info"] });
    const users = await prisma.user.findMany();

    res.status(200).json({ users });
  }
  res.status(405).end();
};
