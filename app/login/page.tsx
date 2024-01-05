'use client';

import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import Input from '@/input';
import { LoginForm } from 'auth';
import Link from 'next/link';

export default function Register() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const onSubmit: SubmitHandler<LoginForm> = async (data) => {
    const response = await fetch('/api/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    if (response.status === 200) {
      return router.push('/');
    }
    try {
      const json = await response.json();
      setError(json.error);
    } catch (e) {
      setError('An error occurred');
    }
    return null;
  };
  return (
    <div className="flex justify-center items-center w-screen h-screen">
      <div className="w-3/5 max-w-2xl card bg-base-300 rounded-box">
        <div className="items-center card-body">
          <h2 className="card-title">Login</h2>
          <form
            className="flex flex-col justify-around items-center w-full"
            onSubmit={handleSubmit(onSubmit)}
          >
            <Input
              label="Username"
              placeholder="renge"
              errors={errors?.username || null}
              register={register('username', {
                required: 'Username is required',
              })}
            />
            <Input
              label="Password"
              placeholder="ny@np@55u"
              type="password"
              errors={errors?.password || null}
              register={register('password', {
                required: 'Password is required',
              })}
            />
            {error && <p className="mt-4 text-error">{error}</p>}

            <button className="mt-8 max-w-xs btn btn-block" type="submit">
              Submit
            </button>
          </form>
          <Link href="/signup">Don't have an account? Sign up</Link>
        </div>
      </div>
    </div>
  );
}
