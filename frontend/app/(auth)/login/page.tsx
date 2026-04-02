"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useLogin } from "@/hooks/useAuth";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

type FormValues = z.infer<typeof schema>;

export default function LoginPage() {
  const router = useRouter();
  const login = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  return (
    <div className="min-h-full flex items-center justify-center px-4 py-12 bg-bg">
      <Card className="w-full max-w-[520px] p-6">
        <div className="font-display text-[28px] tracking-[0.15em] uppercase text-accent drop-shadow-[0_0_8px_#FFD70066]">
          FINLEDGER // ACCESS TERMINAL
        </div>
        <div className="mt-4 border-t border-dashed border-[#2A2AFF33]" />

        <form
          className="mt-5 space-y-4"
          onSubmit={handleSubmit(async (values) => {
            const res = await login.mutateAsync(values);
            if (res.token) router.push("/dashboard");
          })}
        >
          <div>
            <div className="text-[12px] uppercase tracking-[0.12em] text-[#5A5A7A]">
              EMAIL
            </div>
            <Input placeholder="user@finledger.local" {...register("email")} />
            {errors.email ? (
              <div className="mt-1 text-[12px] text-danger">{errors.email.message}</div>
            ) : null}
          </div>

          <div>
            <div className="text-[12px] uppercase tracking-[0.12em] text-[#5A5A7A]">
              PASSWORD
            </div>
            <Input type="password" {...register("password")} />
            {errors.password ? (
              <div className="mt-1 text-[12px] text-danger">
                {errors.password.message}
              </div>
            ) : null}
          </div>

          {login.error ? (
            <div className="text-[12px] text-danger">
              ACCESS DENIED. VERIFY CREDENTIALS.
            </div>
          ) : null}

          <div className="flex items-center gap-3 pt-2">
            <Button type="submit" disabled={login.isPending}>
              {login.isPending ? "CONNECTING..." : "LOGIN"}
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => router.push("/register")}
            >
              REGISTER
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

