import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

// เส้นทางที่ต้องล็อกอิน
const PROTECTED_ROUTES = ["/account", "/checkout"];
// เส้นทาง admin
const ADMIN_ROUTES = ["/admin"];

export const proxy = auth((req) => {
  const { pathname } = req.nextUrl;
  const user = req.auth?.user;
  const isLoggedIn = !!user;

  // ถ้าล็อกอินแล้ว เข้าหน้า /login หรือ /register ให้ส่งต่อไปหน้าหลัก หรือแดชบอร์ด admin
  if (isLoggedIn && (pathname === "/login" || pathname === "/register")) {
    if (user?.role === "ADMIN") {
      return NextResponse.redirect(new URL("/admin", req.url));
    }
    return NextResponse.redirect(new URL("/", req.url));
  }

  // ตรวจเส้นทาง admin: ต้องเป็น ADMIN เท่านั้น
  if (ADMIN_ROUTES.some((route) => pathname.startsWith(route))) {
    if (!isLoggedIn) {
      const callbackUrl = encodeURIComponent(pathname);
      return NextResponse.redirect(
        new URL(`/login?callbackUrl=${callbackUrl}`, req.url)
      );
    }
    if (user?.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", req.url));
    }
    return NextResponse.next();
  }

  // ตรวจเส้นทางที่ต้องล็อกอิน
  if (PROTECTED_ROUTES.some((route) => pathname.startsWith(route))) {
    if (!isLoggedIn) {
      const callbackUrl = encodeURIComponent(pathname);
      return NextResponse.redirect(
        new URL(`/login?callbackUrl=${callbackUrl}`, req.url)
      );
    }
    return NextResponse.next();
  }

  return NextResponse.next();
});

export default proxy;

export const config = {
  matcher: [
    // ครอบคลุมทุก route ยกเว้น api, static files, images
    "/((?!api|_next/static|_next/image|favicon.ico|products/images|.*\\.(?:png|jpg|jpeg|gif|webp|svg)).*)",
  ],
};
