declare module 'auth' {
  type SignupForm = {
    username: string;
    password: string;
    confirmPassword: string;
    inviteCode: string;
  };
  type LoginForm = {
    username: string;
    password: string;
  };
}
