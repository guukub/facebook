"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Search } from "lucide-react";

type Group = { id: string; name: string; memberCount: number | null };

type Props = {
  groups: Group[];
  searchGroup: string;
  setSearchGroup: (val: string) => void;
  selectedGroups: string[];
  toggleGroup: (id: string) => void;
  selectAll: () => void;
  deselectAll: () => void;
};

export function GroupSelect({ groups, searchGroup, setSearchGroup, selectedGroups, toggleGroup, selectAll, deselectAll }: Props) {
  const filteredGroups = groups.filter(g => g.name.toLowerCase().includes(searchGroup.toLowerCase()));

  const formatMembers = (count: number | null) => {
    if (!count) return "-";
    return count > 1000 ? (count / 1000).toFixed(1) + "K" : count.toString();
  };

  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex flex-col h-[500px]">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-green-600 text-white flex items-center justify-center text-xs font-bold">3</div>
          <h3 className="font-semibold text-gray-800 text-sm">เลือกกลุ่ม Facebook ที่ต้องการโพสต์</h3>
        </div>
        <span className="text-xs text-green-600 font-medium">เลือกแล้ว {selectedGroups.length} กลุ่ม</span>
      </div>
      
      <div className="relative mb-4">
        <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
        <Input 
          placeholder="ค้นหากลุ่ม Facebook..." 
          className="pl-9 bg-gray-50/50" 
          value={searchGroup}
          onChange={e => setSearchGroup(e.target.value)}
        />
      </div>

      <div className="flex-1 overflow-y-auto pr-2 space-y-1 mb-4">
        <div className="flex text-[10px] text-gray-400 font-medium uppercase px-2 mb-2">
          <div className="flex-1">ชื่อกลุ่ม</div>
          <div>สมาชิก</div>
        </div>
        {filteredGroups.map(group => (
          <label key={group.id} className="flex items-center justify-between p-2.5 rounded-lg hover:bg-gray-50 cursor-pointer">
            <div className="flex items-center gap-3 overflow-hidden">
              <Checkbox 
                className="data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
                checked={selectedGroups.includes(group.id)}
                onCheckedChange={() => toggleGroup(group.id)}
              />
              <span className="text-xs font-medium text-gray-700 truncate">{group.name}</span>
            </div>
            <span className="text-xs text-gray-500 font-medium">{formatMembers(group.memberCount)}</span>
          </label>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-2 mt-auto pt-4 border-t">
        <Button variant="outline" className="w-full text-xs" onClick={selectAll}>เลือกทั้งหมด</Button>
        <Button variant="outline" className="w-full text-xs" onClick={deselectAll}>ล้างการเลือก</Button>
      </div>
    </div>
  );
}
