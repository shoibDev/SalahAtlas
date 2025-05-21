// validations/validateLogin.ts

interface LoginFormData {
  email: string;
  password: string;
}

export function validateLogin(data: LoginFormData): string[] {
  const errors: string[] = [];

  if (!data.email.trim()) {
    errors.push("Email is required");
  } else if (!/^\S+@\S+\.\S+$/.test(data.email)) {
    errors.push("Enter a valid email address");
  }

  if (!data.password.trim()) {
    errors.push("Password is required");
  }

  return errors;
}
