import { Role } from '@prisma/client';
import prisma from 'db';
import { getSession } from 'lib/session';
import React from 'react';
import UserTable from './UserTable';

const Users = async () => {
  const session = await getSession('GET');
  if (session.user.role !== 'ADMIN') {
    throw new Error('Unauthorized');
  }
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: {
      createdAt: 'asc',
    },
  });

  const updateRole = async (id: string, role: Role) => {
    'use server';

    if (session.user.role === 'ADMIN') {
      const user = await prisma.user.update({
        where: {
          id,
        },
        data: {
          role,
        },
      });
      return user;
    }
    throw new Error('Unauthorized');
  };

  return (
    <div className="overflow-x-auto">
      <UserTable users={users} updateRole={updateRole} />
    </div>
  );
};

export default Users;
