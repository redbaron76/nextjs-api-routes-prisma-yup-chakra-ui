import { NextApiRequest, NextApiResponse } from "next";
import { NextApiResponseServerIO } from "src/types/next";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

import { IUserCreate } from "src/interfaces/user";
import { validUserCreate } from "src/utils/validators/user";
import { generateErrors } from "src/utils/validation";

export default async (req: NextApiRequest, res: NextApiResponseServerIO) => {
  if (req.method === "POST") {
    const prisma = new PrismaClient({ log: ["query", "info"] });
    const { create: data }: { create: IUserCreate } = req.body;
    await validUserCreate
      .validate(data, {
        abortEarly: false,
      })
      .then(async (valid) => {
        if (valid) {
          delete data.confirmPassword;
          try {
            data.password = await bcrypt.hash(data.password, 12);
            const newUser = await prisma.user.create({
              data: {
                ...data,
                profile: {
                  create: {
                    bio: "",
                  },
                },
              },
            });

            // Trigger event in useQuerySocket
            res.socket.server.io.emit("users", newUser);

            res.status(201).json({ data });
          } catch (err) {
            console.log("ERR", err);
            res.status(400).end();
          }
        }
      })
      .catch(({ value, inner }) => {
        res.status(200).json({ value, errors: generateErrors(inner) });
      })
      .finally(async () => {
        await prisma.$disconnect();
      });
  }
  res.status(405).end();
};
