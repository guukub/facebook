"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createFacebookGroup(formData: FormData) {
  await prisma.facebookGroup.create({
    data: {
      name: formData.get("name") as string,
      url: formData.get("url") as string,
      category: formData.get("category") as string,
      province: formData.get("province") as string,
      memberCount: parseInt(formData.get("memberCount") as string) || 0,
      notes: formData.get("notes") as string,
      isActive: formData.get("isActive") === "on",
    },
  });

  revalidatePath("/groups");
  redirect("/groups");
}

export async function updateFacebookGroup(id: string, formData: FormData) {
  await prisma.facebookGroup.update({
    where: { id },
    data: {
      name: formData.get("name") as string,
      url: formData.get("url") as string,
      category: formData.get("category") as string,
      province: formData.get("province") as string,
      memberCount: parseInt(formData.get("memberCount") as string) || 0,
      notes: formData.get("notes") as string,
      isActive: formData.get("isActive") === "on",
    },
  });

  revalidatePath("/groups");
  redirect("/groups");
}

export async function deleteFacebookGroup(id: string) {
  await prisma.facebookGroup.delete({ where: { id } });
  revalidatePath("/groups");
}
