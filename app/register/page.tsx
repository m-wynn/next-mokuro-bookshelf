"use client";
import { useForm, SubmitHandler } from "react-hook-form";
import { signIn } from "next-auth/react";
import { useEffect, useState } from "react";
import { User } from "@prisma/client";

type Inputs = {
  username: string;
  password: string;
};

export default function Register() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>();

  const [users, setUsers] = useState<User[]>([]);
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    await signIn("register", data);
  };
  useEffect(() => {
    fetch("/api/user")
      .then((res) => res.json())
      .then((users) => setUsers(users.users));
  }, []);
  return (
    <div>
      {users.map((user) => (
        <p key={user.id}>{user.name}</p>
      ))}
      <form onSubmit={handleSubmit(onSubmit)}>
        <label>Username</label>
        <input
          type="text"
          placeholder="Renge"
          className="input w-full max-w-xs"
          {...register("username", { required: true })}
        />
        {errors.username && <span>Error</span>}
        <label>Password</label>
        <input
          type="password"
          placeholder="ny@np@55u"
          className="input w-full max-w-xs"
          {...register("password", { required: true })}
        />
        {errors.password && <span>Error</span>}
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
