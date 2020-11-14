import { PrismaClient } from "@prisma/client";
import { IUserCreate } from "src/interfaces/user";
import * as yup from "yup";

export const validUserCreate = yup.object().shape<IUserCreate>({
  firstName: yup.string().required().min(2),
  lastName: yup.string().required().min(2),
  password: yup.string().required().min(8),
  confirmPassword: yup.string().oneOf([yup.ref("password"), null]),
  email: yup
    .string()
    .required("This field is required")
    .email("This field must be an e-mail address")
    .test("unique-email", "This e-mail is already in use", async function (
      email: string
    ): Promise<boolean> {
      const prisma = new PrismaClient({ log: ["query", "info"] });
      // const {options} = this;
      const user = await prisma.user.findOne({
        where: {
          email,
        },
      });
      await prisma.$disconnect();
      return !user;
    }),
});
