import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Home, Users, Clock, CheckCircle, XCircle } from "lucide-react";

export default async function DashboardPage() {
  const [
    totalProperties,
    totalGroups,
    pendingPosts,
    successPosts,
    failedPosts
  ] = await Promise.all([
    prisma.property.count(),
    prisma.facebookGroup.count(),
    prisma.postQueue.count({ where: { status: "PENDING" } }),
    prisma.postQueue.count({ where: { status: "SUCCESS" } }),
    prisma.postQueue.count({ where: { status: "FAILED" } })
  ]);

  const stats = [
    { title: "ทรัพย์ทั้งหมด", value: totalProperties, icon: Home, color: "text-blue-500" },
    { title: "กลุ่ม Facebook", value: totalGroups, icon: Users, color: "text-indigo-500" },
    { title: "คิวรอโพสต์", value: pendingPosts, icon: Clock, color: "text-amber-500" },
    { title: "โพสต์สำเร็จ", value: successPosts, icon: CheckCircle, color: "text-green-500" },
    { title: "โพสต์ไม่สำเร็จ", value: failedPosts, icon: XCircle, color: "text-red-500" },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        {stats.map((stat, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
