"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createPostQueues(propertyId: string, groupIds: string[], customCaption: string) {
  const property = await prisma.property.findUnique({ where: { id: propertyId } });
  if (!property) throw new Error("Property not found");

  const queueItems = groupIds.map(groupId => ({
    propertyId,
    groupId,
    caption: customCaption,
    images: property.images, // using the property's images directly
    status: "PENDING",
  }));

  await prisma.postQueue.createMany({
    data: queueItems,
  });

  revalidatePath("/queue");
  redirect("/queue");
}

export async function generateCaption(propertyId: string) {
  const property = await prisma.property.findUnique({ where: { id: propertyId } });
  if (!property) return "";

  return `🔥 บ้านดี ทำเลน่าอยู่ พร้อมเข้าอยู่

ขาย ${property.propertyType} ${property.name}
ทำเล ${property.location}

ราคา ${property.price.toLocaleString()} บาท

รายละเอียดทรัพย์:
${property.description}

จุดขาย:
${property.sellingPoints}

สนใจนัดชมทรัพย์ / ขอข้อมูลเพิ่มเติม
โทร: ${property.phone}
LINE: ${property.lineId}

#ขายบ้าน #บ้านมือสอง #อสังหาริมทรัพย์ #ตี๋บางบอน`;
}

export async function deleteQueueItem(id: string) {
  await prisma.postQueue.delete({ where: { id } });
  revalidatePath("/queue");
}
