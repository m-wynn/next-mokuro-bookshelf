"use client";
import { useForm, SubmitHandler } from "react-hook-form";
import { useRouter } from "next/navigation";
import Input from "@/input";
import { SignupForm } from "auth";

export default function Register() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignupForm>();
  const router = useRouter();

  const onSubmit: SubmitHandler<SignupForm> = async (data) => {
    const response = await fetch("/api/signup", {
      method: "POST",
      body: JSON.stringify(data),
    });

    console.log(response);

    if (response.status === 0) {
      // redirected
      // when using `redirect: "manual"`, response status 0 is returned
      return router.refresh();
    }
  };
  return (
    <div className="flex justify-center items-center w-screen h-screen">
      <div className="w-3/5 max-w-2xl card bg-base-300 rounded-box">
        <div className="items-center card-body">
          <h2 className="card-title">Sign Up</h2>
          <form
            className="flex flex-col justify-around items-center w-full"
            onSubmit={handleSubmit(onSubmit)}
          >
            <Input
              label="Username"
              placeholder="renge"
              errors={errors?.username || null}
              register={register("username", {
                required: "Username is required",
              })}
            />
            <Input
              label="Password"
              placeholder="ny@np@55u"
              type="password"
              errors={errors?.password || null}
              register={register("password", {
                required: "Username is required",
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters",
                },
              })}
            />
            <Input
              label="Confirm Password"
              type="password"
              placeholder="ny@np@55u"
              errors={errors?.confirmPassword || null}
              register={register("confirmPassword", {
                validate: (value) =>
                  value === watch("password") || "Passwords do not match",
              })}
            />
            <Input
              label="Invite Code"
              errors={errors?.inviteCode || null}
              register={register("inviteCode", {
                required: "Invite Code is required",
              })}
            />

            <button className="mt-8 max-w-xs btn btn-block" type="submit">
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
