"use client";
import React from "react";
import { Role } from "@prisma/client";

const UserTable = ({
  users,
  updateRole,
}: {
  users: {
    id: string;
    name: string;
    role: Role;
    createdAt: Date;
    updatedAt: Date;
  }[];
  updateRole: (id: string, role: Role) => void;
}) => {
  const roles = Object.values(Role);
  return (
    <table className="table bg-base-200">
      <thead>
        <tr>
          <th></th>
          <th>Name</th>
          <th>Role</th>
          <th>Created At</th>
          <th>Updated At</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user, i) => (
          <tr key={user.id}>
            <th>{i + 1}</th>
            <td>{user.name}</td>
            <td>
              <select
                className="w-full max-w-xs select select-ghost"
                disabled={i == 0}
                defaultValue={user.role}
                onChange={(e) =>
                  updateRole(user.id, Role[e.target.value as keyof typeof Role])
                }
              >
                {roles.map((role) => (
                  <option key={role}>{role}</option>
                ))}
              </select>
            </td>
            <td>{user.createdAt.toUTCString()}</td>
            <td>{user.updatedAt.toUTCString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default UserTable;
