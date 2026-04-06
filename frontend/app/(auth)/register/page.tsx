"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { isAxiosError } from "axios";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useRegister } from "@/hooks/useAuth";

const schema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  password: z.string().min(8).max(128),
});

type FormValues = z.infer<typeof schema>;

export default function RegisterPage() {
  const router = useRouter();
  const registerMutation = useRegister();

  const registerErrorMessage = (() => {
    if (!registerMutation.error) {
      return null;
    }

    if (isAxiosError<{ message?: string }>(registerMutation.error)) {
      const backendMessage = registerMutation.error.response?.data?.message;
      if (backendMessage) {
        return backendMessage;
      }
    }

    return "Registration failed. Please verify your input and try again.";
  })();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  return (
    <div className="min-h-full flex items-center justify-center px-4 py-12 bg-bg">
      <Card className="w-full max-w-[520px] p-6">
        <div className="font-display text-[28px] tracking-[0.15em] uppercase text-accent drop-shadow-[0_0_8px_#FFD70066]">
          VAULTEX // NEW ACCOUNT
        </div>
        <div className="mt-4 border-t border-dashed border-[#2A2AFF33]" />

        <form
          className="mt-5 space-y-4"
          onSubmit={handleSubmit(async (values) => {
            const res = await registerMutation.mutateAsync(values);
            if (res.token) {
              localStorage.setItem("vaultex_token", res.token);
              localStorage.setItem("vaultex_user", JSON.stringify(res.user));
              router.push("/dashboard");
            }
          })}
        >
          <div>
            <div className="text-[12px] uppercase tracking-[0.12em] text-[#5A5A7A]">
              NAME
            </div>
            <Input placeholder="A. Dutta" {...register("name")} />
            {errors.name ? (
              <div className="mt-1 text-[12px] text-danger">{errors.name.message}</div>
            ) : null}
          </div>

          <div>
            <div className="text-[12px] uppercase tracking-[0.12em] text-[#5A5A7A]">
              EMAIL
            </div>
            <Input placeholder="user@vaultex.local" {...register("email")} />
            {errors.email ? (
              <div className="mt-1 text-[12px] text-danger">{errors.email.message}</div>
            ) : null}
          </div>

          <div>
            <div className="text-[12px] uppercase tracking-[0.12em] text-[#5A5A7A]">
              PASSWORD (MIN 8)
            </div>
            <Input type="password" {...register("password")} />
            {errors.password ? (
              <div className="mt-1 text-[12px] text-danger">
                {errors.password.message}
              </div>
            ) : null}
          </div>

          {registerErrorMessage ? (
            <div className="text-[12px] text-danger uppercase tracking-[0.06em]">
              {registerErrorMessage}
            </div>
          ) : null}

          <div className="flex items-center gap-3 pt-2">
            <Button type="submit" disabled={registerMutation.isPending}>
              {registerMutation.isPending ? "WRITING..." : "REGISTER"}
            </Button>
            <Button type="button" variant="ghost" onClick={() => router.push("/login")}>
              BACK
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

