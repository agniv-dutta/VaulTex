import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default function Home() {
  const token = cookies().get("vaultex_token")?.value;
  redirect(token ? "/dashboard" : "/login");
}
