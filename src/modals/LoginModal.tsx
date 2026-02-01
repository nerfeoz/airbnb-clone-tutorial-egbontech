"use client";
import Modal from "./Modal";
import { useAuthModal } from "@/store/useAuthModalStore";
import Button from "@/components/ui/Button";
import { FcGoogle } from "react-icons/fc";
import Input from "@/components/ui/Input";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";

interface LoginValues {
  email: string;
  password: string;
}

type LoginErrors = Partial<Record<keyof LoginValues, string>>;

export default function LoginModal() {
  const { isLoginOpen, closeLogin, openRegister } = useAuthModal();

  const [values, setValues] = useState<LoginValues>({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<LoginErrors>({});
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: undefined,
    }));
  };

  const validate = () => {
    const newErrors: LoginErrors = {};

    if (!values.email.trim()) {
      newErrors.email = "Email field is required!";
    } else if (!/^\S+@\S+\.\S+$/.test(values.email)) {
      newErrors.email = "Enter a valid email!";
    }

    if (!values.password.trim()) {
      newErrors.password = "Password field is required!";
    } else if (values.password.length < 6) {
      newErrors.password = "Password must be  atleast 6 characters!";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);

    try {
      const { error } = await authClient.signIn.email({
        email: values.email,
        password: values.password,
      });

      if (error) {
        toast(error.message as string, {
          style: {
            background: "#FF5A5F",
            color: "white",
          },
        });
        return;
      }

      toast("Logged in successfully", {
        style: {
          background: "#FF5A5F",
          color: "white",
        },
      });
      setValues({ email: "", password: "" });
      closeLogin();
      router.refresh();
    } catch (error) {
      toast(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.",
        {
          style: {
            background: "#FF5A5F",
            color: "white",
          },
        },
      );
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    try {
      await authClient.signIn.social({
        provider: "google",
      });
    } catch {
      toast("Google signin failed", {
        style: {
          background: "#FF5A5F",
          color: "white",
        },
      });
    }
  };
  return (
    <Modal onClose={closeLogin} isOpen={isLoginOpen} title="Login">
      <div className="mb-6 space-y-1">
        <h2 className="text-2xl font-semibold text-gray-900">
          Welcome to Airbnb
        </h2>
        const
        <p className="text-sm text-gray-500">Login to account</p>
      </div>

      <form onSubmit={onSubmit} className="space-y-8">
        <Input
          name="email"
          label="Email"
          type="text"
          value={values.email}
          error={errors.email}
          onChange={handleChange}
        />
        <Input
          name="password"
          label="Password"
          type="text"
          value={values.password}
          error={errors.password}
          onChange={handleChange}
        />
        <Button disabled={loading} loading={loading} type="submit">
          Continue
        </Button>

        {/* divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-4  text-gray-500">Or</span>
          </div>
        </div>

        <Button
          onClick={signInWithGoogle}
          type="button"
          variant="outline"
          icon={<FcGoogle size={22} />}
        >
          Continue with Google
        </Button>

        {/* footer */}
        <p className="text-gray-500 text-center text-sm mt-6">
          Don&apos;t have an account?{" "}
          <span
            onClick={openRegister}
            className="text-primary cursor-pointer font-semibold hover:underline"
          >
            Register
          </span>
        </p>
      </form>
    </Modal>
  );
}
