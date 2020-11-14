import cookie from "cookie";
import { sign } from "jsonwebtoken";

import { NextApiResponse } from "next";

export async function setCookie(
  res: NextApiResponse,
  tokenName: string = "token",
  payload: object | string,
  expire: number = 60 * 60 * 6, // 6h
  secret: string = process.env.JWT_AUTH_SECRET
): Promise<void> {
  res.setHeader(
    "Set-Cookie",
    cookie.serialize(tokenName, payload ? sign(payload, secret) : "", {
      httpOnly: true,
      maxAge: expire,
      path: "/",
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    })
  );
}

interface Cookie {
  tokenName: string;
  payload?: object;
  expire: number;
  secret?: string;
}

export async function setCookies(
  res: NextApiResponse,
  cookies: Cookie[]
): Promise<void> {
  res.setHeader(
    "Set-Cookie",
    cookies.map((c) => {
      return cookie.serialize(
        c.tokenName,
        c.payload ? sign(c.payload, c.secret) : "",
        {
          httpOnly: true,
          maxAge: c.expire,
          path: "/",
          sameSite: "lax",
          secure: process.env.NODE_ENV === "production",
        }
      );
    })
  );
}
