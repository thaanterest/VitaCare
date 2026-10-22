import Image from "next/image";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import RegisterForm from "./RegisterForm";

export default async function RegisterPage() {
  const session = await auth();
  if (session) {
    if (session.user?.role === "ADMIN") {
      redirect("/admin");
    }
    redirect("/");
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16 sm:px-6 lg:px-8">
      <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-xl">
        <div className="flex flex-col items-center mb-6">
          <Image
            src="/logo.png"
            alt="VitaCare Logo"
            width={64}
            height={64}
            className="h-16 w-16 rounded-2xl object-contain drop-shadow-md mb-2"
            priority
          />
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">
            Vita<span className="text-sky-500">Care</span>
          </h1>
          <p className="text-xs text-gray-500 mt-1">สมัครสมาชิกใหม่</p>
        </div>
        <RegisterForm />
      </div>
    </div>
  );
}