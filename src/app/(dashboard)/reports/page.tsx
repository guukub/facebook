import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BarChart, Activity, CheckCircle, XCircle } from "lucide-react";

export default async function ReportsPage() {
  const [totalQueues, successQueues, failedQueues, pendingQueues] = await Promise.all([
    prisma.postQueue.count(),
    prisma.postQueue.count({ where: { status: 'SUCCESS' } }),
    prisma.postQueue.count({ where: { status: 'FAILED' } }),
    prisma.postQueue.count({ where: { status: { in: ['PENDING', 'POSTING'] } } })
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col mb-4">
        <h2 className="text-2xl font-bold tracking-tight text-gray-800">รายงานผลการทำงาน (Reports)</h2>
        <p className="text-sm text-gray-500">สรุปสถิติการโพสต์อัตโนมัติของระบบ</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">คำสั่งโพสต์ทั้งหมด</CardTitle>
            <BarChart className="w-4 h-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalQueues}</div>
            <p className="text-xs text-muted-foreground mt-1">คิวทั้งหมดในระบบ</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">โพสต์สำเร็จ</CardTitle>
            <CheckCircle className="w-4 h-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{successQueues}</div>
            <p className="text-xs text-muted-foreground mt-1">โพสต์ลงกลุ่มเสร็จสิ้น</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">โพสต์ล้มเหลว</CardTitle>
            <XCircle className="w-4 h-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{failedQueues}</div>
            <p className="text-xs text-muted-foreground mt-1">เกิดข้อผิดพลาดในการโพสต์</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">กำลังรอคิว</CardTitle>
            <Activity className="w-4 h-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{pendingQueues}</div>
            <p className="text-xs text-muted-foreground mt-1">คิวที่ยังไม่ได้ทำงาน</p>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>กราฟแสดงผล</CardTitle>
          <CardDescription>กราฟสรุปการทำงานแบบละเอียด (Coming Soon)</CardDescription>
        </CardHeader>
        <CardContent className="h-64 flex items-center justify-center bg-gray-50 rounded-md border border-dashed border-gray-200">
          <p className="text-gray-400 text-sm">ส่วนแสดงกราฟจะพร้อมใช้งานในการอัปเดตครั้งถัดไป</p>
        </CardContent>
      </Card>
    </div>
  );
}
