"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function toggleAutomation(isActive: boolean) {
  let setting = await prisma.automationSetting.findFirst();
  if (!setting) {
    setting = await prisma.automationSetting.create({
      data: { isActive }
    });
  } else {
    setting = await prisma.automationSetting.update({
      where: { id: setting.id },
      data: { isActive }
    });
  }

  // Create a log entry for the action
  await prisma.log.create({
    data: {
      message: `User ${isActive ? "Started/Resumed" : "Paused/Stopped"} the automation`,
      status: "INFO"
    }
  });

  revalidatePath("/automation-control");
}

export async function updateAutomationSettings(formData: FormData) {
  const minDelay = parseInt(formData.get("minDelay") as string) || 60;
  const maxDelay = parseInt(formData.get("maxDelay") as string) || 180;
  const batchLimit = parseInt(formData.get("batchLimit") as string) || 10;

  let setting = await prisma.automationSetting.findFirst();
  if (!setting) {
    await prisma.automationSetting.create({
      data: { minDelay, maxDelay, batchLimit, isActive: false }
    });
  } else {
    await prisma.automationSetting.update({
      where: { id: setting.id },
      data: { minDelay, maxDelay, batchLimit }
    });
  }

  revalidatePath("/automation-control");
}

export async function clearLogs() {
  await prisma.log.deleteMany({});
  revalidatePath("/automation-control");
}
