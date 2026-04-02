"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, useState } from "react";
import { queryClientFactory } from "@/lib/queryClient";
import { AuthRehydrate } from "@/components/auth/AuthRehydrate";
import { ToastHost } from "@/components/ui/ToastHost";

export function Providers({ children }: { children: ReactNode }) {
  const [client] = useState(() => queryClientFactory());

  return (
    <QueryClientProvider client={client}>
      <AuthRehydrate />
      <ToastHost />
      {children}
    </QueryClientProvider>
  );
}

