import crypto from "crypto";
import argon2 from "argon2";

export async function isPwned(password: string): Promise<number> {
  let shasum = crypto.createHash("sha1");
  const hashedPass = shasum.update(password).digest("hex").toUpperCase();

  const prefix = hashedPass.slice(0, 5);
  const suffix = hashedPass.slice(5);

  const res = await fetch("https://api.pwnedpasswords.com/range/" + prefix);
  const text = await res.text();
  return (
    text
      .split("\n")
      .map((line) => line.split(":"))
      .filter(([s, _count]) => s === suffix)
      .map(([_s, count]) => Number(count))
      .shift() || 0
  );
}

export async function hash(password: string): Promise<string> {
  return await argon2.hash(password);
}

export async function verify(hash: string, password: string): Promise<boolean> {
  return await argon2.verify(hash, password);
}
