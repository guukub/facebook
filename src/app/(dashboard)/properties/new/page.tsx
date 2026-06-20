"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createProperty } from "@/app/actions/property";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NewPropertyPage() {
  const [loading, setLoading] = useState(false);

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-4">
        <Link href="/properties">
          <Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button>
        </Link>
        <h2 className="text-2xl font-bold tracking-tight">Add New Property</h2>
      </div>

      <form action={async (formData) => {
        setLoading(true);
        await createProperty(formData);
      }} className="space-y-6">
        
        <div className="space-y-4 bg-card p-6 rounded-lg border shadow-sm">
          <div className="space-y-2">
            <Label htmlFor="name">Property Name</Label>
            <Input id="name" name="name" required placeholder="e.g. บ้านเดี่ยว ม.ชัยพฤกษ์ บางบอน" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="propertyType">Type</Label>
              <Select name="propertyType" defaultValue="บ้านเดี่ยว">
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="บ้านเดี่ยว">บ้านเดี่ยว</SelectItem>
                  <SelectItem value="ทาวน์โฮม">ทาวน์โฮม</SelectItem>
                  <SelectItem value="คอนโด">คอนโด</SelectItem>
                  <SelectItem value="ที่ดิน">ที่ดิน</SelectItem>
                  <SelectItem value="อาคารพาณิชย์">อาคารพาณิชย์</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select name="status" defaultValue="พร้อมขาย">
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="พร้อมขาย">พร้อมขาย</SelectItem>
                  <SelectItem value="จองแล้ว">จองแล้ว</SelectItem>
                  <SelectItem value="ขายแล้ว">ขายแล้ว</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Price (THB)</Label>
              <Input id="price" name="price" type="number" required placeholder="3500000" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input id="location" name="location" required placeholder="บางบอน" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Details</Label>
            <Textarea id="description" name="description" required placeholder="3 ห้องนอน 2 ห้องน้ำ 50 ตร.ว." rows={4} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="sellingPoints">Selling Points</Label>
            <Textarea id="sellingPoints" name="sellingPoints" required placeholder="ใกล้ MRT, ตกแต่งพร้อมอยู่" rows={2} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" name="phone" required placeholder="0812345678" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lineId">LINE ID</Label>
              <Input id="lineId" name="lineId" required placeholder="teebangbon" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="images">Images (URLs, 1 per line)</Label>
            <Textarea id="images" name="images" placeholder="https://example.com/img1.jpg&#10;https://example.com/img2.jpg" rows={3} />
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={loading}>
            {loading ? "Saving..." : "Save Property"}
          </Button>
        </div>
      </form>
    </div>
  );
}
