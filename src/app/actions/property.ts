"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createProperty(formData: FormData) {
  const imagesText = formData.get("images") as string;
  const imagesArray = imagesText ? imagesText.split("\n").map(s => s.trim()).filter(Boolean) : [];

  await prisma.property.create({
    data: {
      name: formData.get("name") as string,
      propertyType: formData.get("propertyType") as string,
      price: parseFloat(formData.get("price") as string),
      location: formData.get("location") as string,
      description: formData.get("description") as string,
      sellingPoints: formData.get("sellingPoints") as string,
      phone: formData.get("phone") as string,
      lineId: formData.get("lineId") as string,
      status: formData.get("status") as string,
      images: JSON.stringify(imagesArray),
    },
  });

  revalidatePath("/properties");
  redirect("/properties");
}

export async function updateProperty(id: string, formData: FormData) {
  const imagesText = formData.get("images") as string;
  const imagesArray = imagesText ? imagesText.split("\n").map(s => s.trim()).filter(Boolean) : [];

  await prisma.property.update({
    where: { id },
    data: {
      name: formData.get("name") as string,
      propertyType: formData.get("propertyType") as string,
      price: parseFloat(formData.get("price") as string),
      location: formData.get("location") as string,
      description: formData.get("description") as string,
      sellingPoints: formData.get("sellingPoints") as string,
      phone: formData.get("phone") as string,
      lineId: formData.get("lineId") as string,
      status: formData.get("status") as string,
      images: JSON.stringify(imagesArray),
    },
  });

  revalidatePath("/properties");
  redirect("/properties");
}

export async function deleteProperty(id: string) {
  await prisma.property.delete({ where: { id } });
  revalidatePath("/properties");
}
