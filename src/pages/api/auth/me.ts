import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { setCookies } from "src/utils/cookie";
import { verify } from "jsonwebtoken";
import { isNumber } from "lodash";
import cookie from "cookie";

import {
  REFRESH_TOKEN_EXPIRE,
  AUTH_TOKEN_EXPIRE,
  AUTH_TOKEN_NAME,
  REFRESH_TOKEN_NAME,
} from "src/constants";

interface Token {
  userId?: number;
}

interface RefreshToken extends Token {
  count?: number;
}

const getUserId = async (req: NextApiRequest): Promise<RefreshToken> => {
  // get parsed cookies from headers
  const parsedCookies = req && cookie.parse(req.headers.cookie ?? "");

  if (parsedCookies) {
    const authToken = parsedCookies[AUTH_TOKEN_NAME];
    const refreshToken = parsedCookies[REFRESH_TOKEN_NAME];

    // exit with undefined if no tokens
    if (!refreshToken && !authToken)
      return {
        userId: null,
      };

    try {
      const verifiedToken = verify(
        authToken,
        process.env.JWT_AUTH_SECRET
      ) as Token;

      // GOOD authToken -> set userId in context
      return {
        userId: verifiedToken && verifiedToken.userId,
      };
    } catch {
      // authToken expired -> check refreshToken
    }

    // BAD refreshToken and no authToken -> exit with undefined
    if (!refreshToken) return;

    let verifiedToken: RefreshToken;

    try {
      verifiedToken = verify(
        refreshToken,
        process.env.JWT_REFRESH_SECRET
      ) as RefreshToken;
    } catch {
      return {
        userId: null,
      };
    }

    // get saved items from refreshToken
    return verifiedToken;
  }

  return {
    userId: null,
  };
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    const prisma = new PrismaClient({ log: ["query", "info"] });
    const { userId, count } = await getUserId(req);

    console.log(userId, count);

    if (!userId) {
      res.status(200).json({ user: null });
      return;
    }

    let user = await prisma.user.findOne({
      where: {
        id: userId,
      },
    });

    if (!user || (isNumber(count) && user.count !== count)) {
      res.status(200).json({ user: null });
      return;
    }

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

    res.status(200).json({ user });
  }
  res.status(405).end();
};
