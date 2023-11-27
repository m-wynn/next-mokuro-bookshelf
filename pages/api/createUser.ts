import prisma from "db";
import { isPwned } from "../../lib/password";

import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  error?: string;
};

type Query = {
  name: string;
  password: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  let { name, password } = req.query as Query;
  // if (!name || !password) {
  //   res.status(400).json({ error: "Missing query params" });
  // }

  let pwned = await isPwned(password);
  if (pwned > 0) {
    res.status(400).json({ error: `Password has been pwned ${pwned} times` });
  } else {
    res.status(200).json({});
  }

  await prisma.user.create({
    data: {
      name,
      password,
    },
  });
}
