import { Role } from '@prisma/client';

/// <reference types="lucia" />
declare namespace Lucia {
  // ...
  type DatabaseUserAttributes = {
    name: string;
    role: Role;
  };
}
