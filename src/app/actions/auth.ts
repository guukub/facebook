"use server";

import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export async function loginAction(formData: FormData) {
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;

  if (!username || !password) {
    return { error: "Please enter both username and password." };
  }

  // Hardcoded check for simplicity, or check DB
  // For the first time, if no admin exists, we create one (seeding)
  const adminCount = await prisma.admin.count();
  if (adminCount === 0) {
    if (username === "admin" && password === "admin123") {
      await prisma.admin.create({
        data: {
          username: "admin",
          password: "admin123", // In a real app, hash this!
        },
      });
    } else {
      return { error: "Invalid credentials." };
    }
  } else {
    const admin = await prisma.admin.findUnique({
      where: { username },
    });
    if (!admin || admin.password !== password) {
      return { error: "Invalid credentials." };
    }
  }

  cookies().set("admin_session", "true", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7, // 1 week
    path: "/",
  });

  redirect("/dashboard");
}

export async function logoutAction() {
  cookies().delete("admin_session");
  redirect("/login");
}
