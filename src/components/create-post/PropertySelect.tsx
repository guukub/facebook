"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

type Property = { id: string; name: string; price: number | null; propertyType: string | null };

type Props = {
  properties: Property[];
  selectedProperty: string;
  setSelectedProperty: (id: string) => void;
};

export function PropertySelect({ properties, selectedProperty, setSelectedProperty }: Props) {
  const activeProperty = properties.find(p => p.id === selectedProperty);

  const formatPrice = (price: number | null) => {
    if (!price) return "N/A";
    return new Intl.NumberFormat('th-TH').format(price) + " บาท";
  };

  return (
    <>
      <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex flex-col h-[500px]">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-6 h-6 rounded-full bg-green-600 text-white flex items-center justify-center text-xs font-bold">1</div>
          <h3 className="font-semibold text-gray-800 text-sm">เลือกประเภททรัพย์</h3>
        </div>
        <div className="space-y-3 overflow-y-auto">
          {['บ้านเดี่ยว', 'ทาวน์โฮม', 'คอนโด', 'ที่ดิน', 'อาคารพาณิชย์'].map(type => (
            <label key={type} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
              <Checkbox className="data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600" />
              <span className="text-sm font-medium text-gray-700">{type}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex flex-col h-[500px]">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-green-600 text-white flex items-center justify-center text-xs font-bold">2</div>
            <h3 className="font-semibold text-gray-800 text-sm">เลือกทรัพย์</h3>
          </div>
          <span className="text-xs text-gray-400">(เลือกได้ 1 รายการ)</span>
        </div>
        <Select onValueChange={setSelectedProperty} value={selectedProperty}>
          <SelectTrigger className="w-full h-11 bg-gray-50/50">
            <SelectValue placeholder="ค้นหาหรือเลือกทรัพย์..." />
          </SelectTrigger>
          <SelectContent>
            {properties.map(p => (
              <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {activeProperty && (
          <div className="mt-4 border rounded-xl overflow-hidden shadow-sm bg-white">
            <div className="h-32 bg-gray-200 relative">
              <img src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=800&auto=format&fit=crop" className="w-full h-full object-cover" alt="Property" />
            </div>
            <div className="p-4">
              <h4 className="font-bold text-gray-800 text-sm line-clamp-2">{activeProperty.name}</h4>
              <p className="text-xs text-gray-500 mt-1">{activeProperty.propertyType}</p>
              <p className="text-green-600 font-bold mt-2">{formatPrice(activeProperty.price)}</p>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
