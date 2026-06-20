import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SettingsPage() {
  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col mb-4">
        <h2 className="text-2xl font-bold tracking-tight text-gray-800">การตั้งค่าระบบ (Settings)</h2>
        <p className="text-sm text-gray-500">จัดการโปรไฟล์และการตั้งค่าพื้นฐานของระบบ</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>ข้อมูลโปรไฟล์ (Profile)</CardTitle>
          <CardDescription>เปลี่ยนรหัสผ่านสำหรับเข้าสู่ระบบของ Admin</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Username</Label>
            <Input disabled value="admin" className="bg-gray-50" />
          </div>
          <div className="space-y-2">
            <Label>รหัสผ่านใหม่ (New Password)</Label>
            <Input type="password" placeholder="••••••••" />
          </div>
          <div className="space-y-2">
            <Label>ยืนยันรหัสผ่านใหม่ (Confirm Password)</Label>
            <Input type="password" placeholder="••••••••" />
          </div>
          <Button className="bg-green-600 hover:bg-green-700 text-white">บันทึกรหัสผ่าน</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>การตั้งค่าขั้นสูง (Advanced)</CardTitle>
          <CardDescription>จัดการข้อมูลในฐานข้อมูล (โปรดระมัดระวัง)</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg bg-gray-50">
            <div>
              <p className="font-bold text-sm text-gray-800">ล้างประวัติการโพสต์ทั้งหมด</p>
              <p className="text-xs text-gray-500">การกระทำนี้จะลบข้อมูลคิวและการโพสต์ทั้งหมด (ไม่สามารถกู้คืนได้)</p>
            </div>
            <Button variant="destructive" disabled>Clear All Queues</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
