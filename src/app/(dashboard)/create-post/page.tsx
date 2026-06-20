import { prisma } from "@/lib/prisma";
import CreatePostClient from "./create-post-client";

export default async function CreatePostPage() {
  const [properties, groups, setting, logs, queues] = await Promise.all([
    prisma.property.findMany({ select: { id: true, name: true, price: true, propertyType: true } }),
    prisma.facebookGroup.findMany({ 
      where: { isActive: true },
      select: { id: true, name: true, category: true, province: true, memberCount: true }
    }),
    prisma.automationSetting.findFirst(),
    prisma.log.findMany({ orderBy: { createdAt: 'desc' }, take: 50 }),
    prisma.postQueue.findMany({ 
      where: { status: { in: ['PENDING', 'POSTING'] } },
      include: { group: true },
      orderBy: { createdAt: 'asc' }
    })
  ]);

  const defaultSetting = setting || { isActive: false, minDelay: 60, maxDelay: 180, batchLimit: 10 };

  return <CreatePostClient 
    properties={properties} 
    groups={groups} 
    setting={defaultSetting} 
    logs={logs} 
    queues={queues} 
  />;
}
