"use client";

import { Button } from "@/components/ui/button";
import { Edit3 } from "lucide-react";

type Props = {
  activeProperty: any;
  caption: string;
};

export function PostPreview({ activeProperty, caption }: Props) {
  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex flex-col xl:row-span-2">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-gray-800 text-sm">ตัวอย่างโพสต์</h3>
        <Button variant="outline" size="sm" className="h-8 text-xs text-green-700 border-green-200 bg-green-50 hover:bg-green-100">
          <Edit3 className="w-3 h-3 mr-1" /> แก้ไขข้อความ
        </Button>
      </div>
      
      <div className="flex-1 overflow-y-auto pr-1">
        <div className="text-sm text-gray-800 whitespace-pre-wrap leading-relaxed mb-4 font-sans">
          {caption || "กรุณาเลือกทรัพย์เพื่อดูตัวอย่างข้อความ..."}
        </div>
        
        {activeProperty && (
          <div className="grid grid-cols-2 gap-1 rounded-xl overflow-hidden">
            <div className="col-span-2 aspect-video bg-gray-200">
               <img src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=800&auto=format&fit=crop" className="w-full h-full object-cover" />
            </div>
            <div className="aspect-video bg-gray-200">
               <img src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=800&auto=format&fit=crop" className="w-full h-full object-cover" />
            </div>
            <div className="aspect-video bg-gray-800 relative">
               <img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800&auto=format&fit=crop" className="w-full h-full object-cover opacity-50" />
               <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-lg">+6</div>
            </div>
          </div>
        )}
        
        <div className="mt-4 bg-green-50 rounded-lg p-3 flex gap-3 border border-green-100">
          <div className="w-8 h-8 rounded-full bg-green-200 flex items-center justify-center shrink-0">
            <span className="text-green-700 text-xs font-bold">ℹ️</span>
          </div>
          <div>
            <p className="text-xs font-bold text-green-800">รูปภาพทั้งหมด 9 รูป</p>
            <p className="text-[10px] text-green-600 mt-0.5">ระบบจะอัปโหลดรูปภาพตามลำดับ</p>
          </div>
        </div>
      </div>
    </div>
  );
}
