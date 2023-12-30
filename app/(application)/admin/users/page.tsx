import { Role } from "@prisma/client";
import prisma from "db";
import { getSession } from "lib/session";
import React from "react";
import UserTable from "./UserTable";

const Users = async () => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  const updateRole = async (id: string, role: Role) => {
    "use server";
    const session = await getSession("POST");
    if (session.user.role == "ADMIN") {
      const user = await prisma.user.update({
        where: {
          id,
        },
        data: {
          role: role,
        },
      });
      return user;
    } else {
      throw new Error("Unauthorized");
    }
  };

  return (
    <div className="overflow-x-auto">
      <UserTable users={users} updateRole={updateRole} />
    </div>
  );
};

export default Users;
