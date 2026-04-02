import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default function Home() {
  const token = cookies().get("finledger_token")?.value;
  redirect(token ? "/records" : "/login");
}
