"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createFacebookGroup } from "@/app/actions/group";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NewGroupPage() {
  const [loading, setLoading] = useState(false);

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-4">
        <Link href="/groups">
          <Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button>
        </Link>
        <h2 className="text-2xl font-bold tracking-tight">Add Facebook Group</h2>
      </div>

      <form action={async (formData) => {
        setLoading(true);
        await createFacebookGroup(formData);
      }} className="space-y-6">
        
        <div className="space-y-4 bg-card p-6 rounded-lg border shadow-sm">
          <div className="space-y-2">
            <Label htmlFor="name">Group Name</Label>
            <Input id="name" name="name" required placeholder="e.g. บ้านมือสองกรุงเทพ" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="url">Group URL</Label>
            <Input id="url" name="url" required type="url" placeholder="https://www.facebook.com/groups/..." />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Input id="category" name="category" required placeholder="e.g. อสังหาริมทรัพย์" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="province">Province</Label>
              <Input id="province" name="province" required placeholder="e.g. กรุงเทพ" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="memberCount">Member Count</Label>
              <Input id="memberCount" name="memberCount" type="number" required placeholder="10000" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="isActive">Status</Label>
              <div className="flex items-center space-x-2 pt-2">
                <input type="checkbox" id="isActive" name="isActive" defaultChecked className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary" />
                <label htmlFor="isActive" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Active (Ready for posting)
                </label>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea id="notes" name="notes" placeholder="Any special rules for this group..." rows={2} />
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={loading}>
            {loading ? "Saving..." : "Save Group"}
          </Button>
        </div>
      </form>
    </div>
  );
}
