import { prisma } from '../../src/lib/prisma';

export async function logInfo(message: string) {
  console.log(`[INFO] ${new Date().toISOString()}: ${message}`);
  await prisma.log.create({
    data: {
      message,
      status: "INFO"
    }
  });
}

export async function logError(message: string) {
  console.error(`[ERROR] ${new Date().toISOString()}: ${message}`);
  await prisma.log.create({
    data: {
      message,
      status: "ERROR"
    }
  });
}

export async function logSuccess(message: string) {
  console.log(`[SUCCESS] ${new Date().toISOString()}: ${message}`);
  await prisma.log.create({
    data: {
      message,
      status: "SUCCESS"
    }
  });
}
