import { auth } from "auth/lucia";
import * as context from "next/headers";

export async function getSession() {
  const session = await auth.handleRequest("POST", context).validate();
  if (!session) {
    throw new Error("You must be signed in to perform this action");
  }
  return session;
}
