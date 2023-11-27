"use client";
import { useSession } from "next-auth/react";

export default function Index() {
  const { data: session, status } = useSession();
  return (
    <h1>
      Hello Mr. <b>{session?.user?.name}</b> you are <b>{status}</b> as a{" "}
      <b>{session?.user?.role}</b>
      <b>{session?.user?.id}</b>
    </h1>
  );
}
