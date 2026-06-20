"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { createPostQueues, generateCaption } from "@/app/actions/queue";
import { toggleAutomation } from "@/app/actions/automation";
import { Rocket, AlertTriangle } from "lucide-react";
import { useRouter } from "next/navigation";

// Import new child components
import { PropertySelect } from "@/components/create-post/PropertySelect";
import { GroupSelect } from "@/components/create-post/GroupSelect";
import { PostPreview } from "@/components/create-post/PostPreview";
import { AutomationControl } from "@/components/create-post/AutomationControl";

type Props = {
  properties: { id: string, name: string, price: number | null, propertyType: string | null }[];
  groups: { id: string, name: string, category: string, province: string, memberCount: number | null }[];
  setting: any;
  logs: any[];
  queues: any[];
};

export default function CreatePostClient({ properties, groups, setting, logs, queues }: Props) {
  const router = useRouter();
  const [selectedProperty, setSelectedProperty] = useState<string>("");
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
  const [caption, setCaption] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchGroup, setSearchGroup] = useState("");
  
  useEffect(() => {
    if (selectedProperty) {
      generateCaption(selectedProperty).then(setCaption);
    } else {
      setCaption("");
    }
  }, [selectedProperty]);

  const toggleGroup = (id: string) => {
    setSelectedGroups(prev => 
      prev.includes(id) ? prev.filter(g => g !== id) : [...prev, id]
    );
  };

  const filteredGroups = groups.filter(g => g.name.toLowerCase().includes(searchGroup.toLowerCase()));
  const selectAll = () => setSelectedGroups(filteredGroups.map(g => g.id));
  const deselectAll = () => setSelectedGroups([]);

  const activeProperty = properties.find(p => p.id === selectedProperty);

  const handleCreateQueue = async (startAutomation: boolean = false) => {
    if (!selectedProperty || selectedGroups.length === 0) return;
    setLoading(true);
    await createPostQueues(selectedProperty, selectedGroups, caption);
    
    if (startAutomation && !setting.isActive) {
      await toggleAutomation(true);
    } else {
      router.refresh();
    }
    
    setLoading(false);
    setSelectedProperty("");
    setSelectedGroups([]);
    setCaption("");
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col mb-4">
        <h2 className="text-2xl font-bold tracking-tight text-gray-800">สร้างโพสต์และโพสต์อัตโนมัติ</h2>
        <p className="text-sm text-gray-500">เลือกทรัพย์และกลุ่ม Facebook ที่ต้องการโพสต์</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        <div className="xl:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <PropertySelect 
            properties={properties} 
            selectedProperty={selectedProperty} 
            setSelectedProperty={setSelectedProperty} 
          />

          <GroupSelect 
            groups={groups} 
            searchGroup={searchGroup} 
            setSearchGroup={setSearchGroup} 
            selectedGroups={selectedGroups} 
            toggleGroup={toggleGroup} 
            selectAll={selectAll} 
            deselectAll={deselectAll} 
          />
          
          <div className="md:col-span-3 flex gap-4">
            <Button 
              className="bg-[#10703f] hover:bg-[#0c5630] text-white flex-1 py-6 text-sm font-semibold rounded-xl shadow-md transition-all hover:shadow-lg"
              onClick={() => handleCreateQueue(true)}
              disabled={loading || !selectedProperty || selectedGroups.length === 0}
            >
              <Rocket className="w-5 h-5 mr-2" />
              โพสต์ทั้งหมด (เริ่ม Automation)
            </Button>
            <Button 
              variant="outline" 
              className="flex-1 py-6 text-sm font-semibold rounded-xl shadow-sm hover:bg-gray-50"
              onClick={() => handleCreateQueue(false)}
              disabled={loading || !selectedProperty || selectedGroups.length === 0}
            >
              สร้างคิวโพสต์
            </Button>
          </div>
        </div>

        <PostPreview activeProperty={activeProperty} caption={caption} />
      </div>

      <AutomationControl setting={setting} logs={logs} queues={queues} />

      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex gap-3 mt-6 items-start">
        <AlertTriangle className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5" />
        <div>
          <h4 className="text-sm font-bold text-yellow-800">คำเตือน:</h4>
          <p className="text-xs text-yellow-700 mt-1 leading-relaxed">
            การโพสต์อัตโนมัติติดต่อกันอาจทำให้บัญชี Facebook ของคุณถูกจำกัด หรือถูกปิดใช้งานได้ ควรใช้อย่างระมัดระวัง ไม่ควรโพสต์ถี่เกินไป และไม่ควรโพสต์เกิน 20-30 กลุ่มต่อวัน
          </p>
        </div>
      </div>
    </div>
  );
}
