"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { createPostQueues, generateCaption } from "@/app/actions/queue";
import { toggleAutomation, updateAutomationSettings, clearLogs } from "@/app/actions/automation";
import { Rocket, Bot, Pause, Square, RefreshCw, CheckCircle2, Search, AlertTriangle, Edit3 } from "lucide-react";
import { useRouter } from "next/navigation";

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
  
  // Settings state
  const [minDelay, setMinDelay] = useState(setting.minDelay);
  const [maxDelay, setMaxDelay] = useState(setting.maxDelay);
  const [batchLimit, setBatchLimit] = useState(setting.batchLimit);

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

  const selectAll = () => setSelectedGroups(filteredGroups.map(g => g.id));
  const deselectAll = () => setSelectedGroups([]);

  const filteredGroups = groups.filter(g => g.name.toLowerCase().includes(searchGroup.toLowerCase()));
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

  const saveSettings = async () => {
    const formData = new FormData();
    formData.append("minDelay", minDelay.toString());
    formData.append("maxDelay", maxDelay.toString());
    formData.append("batchLimit", batchLimit.toString());
    await updateAutomationSettings(formData);
  };

  const formatPrice = (price: number | null) => {
    if (!price) return "N/A";
    return new Intl.NumberFormat('th-TH').format(price) + " บาท";
  };

  const formatMembers = (count: number | null) => {
    if (!count) return "-";
    return count > 1000 ? (count / 1000).toFixed(1) + "K" : count.toString();
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col mb-4">
        <h2 className="text-2xl font-bold tracking-tight text-gray-800">สร้างโพสต์และโพสต์อัตโนมัติ</h2>
        <p className="text-sm text-gray-500">เลือกทรัพย์และกลุ่ม Facebook ที่ต้องการโพสต์</p>
      </div>

      {/* Top Grid: Create Post Sections */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        
        {/* Step 1 & 2 & 3 wrapper */}
        <div className="xl:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Step 1: Property Types */}
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

          {/* Step 2: Property Select */}
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

          {/* Step 3: Facebook Groups */}
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
          
          {/* Action Buttons spanning full width below the 3 steps */}
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

        {/* Right column: Post Preview */}
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

      </div>

      {/* Automation Control Panel */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mt-8">
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-800">Automation Control Panel</h2>
          <p className="text-xs text-gray-500">ควบคุมการโพสต์อัตโนมัติด้วย Browser Automation (Playwright)</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-6">
          
          {/* Status */}
          <div className="bg-gray-50 rounded-xl p-5 border border-gray-100 flex flex-col items-center justify-center text-center">
            <h3 className="text-sm font-bold text-gray-700 w-full text-left mb-4">สถานะการทำงาน</h3>
            <div className="flex items-center gap-2 text-green-600 font-bold text-lg mb-1">
              <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
              {setting.isActive ? "กำลังทำงาน" : "พร้อมทำงาน"}
            </div>
            <p className="text-xs text-gray-400 mb-6">{setting.isActive ? "ระบบกำลังโพสต์ตามคิว" : "รอเริ่มการโพสต์"}</p>
            
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-2 shadow-inner relative">
              <Bot className="w-12 h-12" />
              <div className="absolute -bottom-2 -right-2 bg-green-500 w-8 h-8 rounded-full flex items-center justify-center text-white border-2 border-white shadow-sm">
                <span className="font-bold text-xs">f</span>
              </div>
            </div>
          </div>

          {/* Controls & Settings */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h3 className="text-sm font-bold text-gray-700 mb-3">ควบคุมการทำงาน</h3>
              <div className="flex gap-2">
                <form action={toggleAutomation.bind(null, true)} className="flex-1">
                  <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white shadow-sm" disabled={setting.isActive}>
                    <Rocket className="w-4 h-4 mr-1.5" /> Start Posting
                  </Button>
                </form>
                <form action={toggleAutomation.bind(null, false)} className="flex-1">
                  <Button type="submit" className="w-full bg-yellow-500 hover:bg-yellow-600 text-white shadow-sm" disabled={!setting.isActive}>
                    <Pause className="w-4 h-4 mr-1.5" /> Pause
                  </Button>
                </form>
                <Button variant="destructive" className="shadow-sm">
                  <Square className="w-4 h-4 mr-1.5" /> Stop
                </Button>
                <form>
                  <Button formAction={async () => { router.refresh(); }} variant="outline" className="shadow-sm">
                    <RefreshCw className="w-4 h-4 mr-1.5" /> รีเฟรช
                  </Button>
                </form>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
              <h3 className="text-sm font-bold text-gray-700 mb-4">การตั้งค่าการทำงาน</h3>
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div>
                  <Label className="text-xs text-gray-500 mb-1 block">Delay ขั้นต่ำ (วินาที)</Label>
                  <Input type="number" className="h-9 bg-white" value={minDelay} onChange={e => setMinDelay(Number(e.target.value))} onBlur={saveSettings} />
                </div>
                <div>
                  <Label className="text-xs text-gray-500 mb-1 block">Delay สูงสุด (วินาที)</Label>
                  <Input type="number" className="h-9 bg-white" value={maxDelay} onChange={e => setMaxDelay(Number(e.target.value))} onBlur={saveSettings} />
                </div>
                <div>
                  <Label className="text-xs text-gray-500 mb-1 block">โพสต์ต่อรอบ (กลุ่ม)</Label>
                  <Select value={batchLimit.toString()} onValueChange={v => { setBatchLimit(Number(v)); saveSettings(); }}>
                    <SelectTrigger className="h-9 bg-white"><SelectValue /></SelectTrigger>
                    <SelectContent><SelectItem value="10">10</SelectItem><SelectItem value="20">20</SelectItem><SelectItem value="30">30</SelectItem></SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex items-center justify-between pt-3 border-t">
                <div className="flex items-center gap-2"><Switch checked={true} /><Label className="text-xs">สุ่ม Delay</Label></div>
                <div className="flex items-center gap-2"><Switch checked={true} /><Label className="text-xs">เลื่อนการโพสต์ถ้าถี่เกินไป</Label></div>
                <div className="flex items-center gap-2"><Switch checked={true} /><Label className="text-xs">จำกัดเวลาใช้งาน</Label></div>
              </div>
            </div>
            
            <div className="bg-blue-50 text-blue-800 text-[11px] p-3 rounded-lg flex gap-2 border border-blue-100">
              <div className="mt-0.5"><CheckCircle2 className="w-3 h-3 text-blue-500" /></div>
              <p>ระบบจะทำการสุ่มเวลา Delay ระหว่าง {minDelay} - {maxDelay} วินาที ต่อ 1 โพสต์ เพื่อให้เหมือนการโพสต์ของมนุษย์มากที่สุด</p>
            </div>
          </div>

          {/* Queue & Logs */}
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 flex flex-col h-[320px]">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-sm font-bold text-gray-700">คิวที่กำลังดำเนินการ</h3>
                <span className="bg-green-600 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">{queues.length} กลุ่ม</span>
              </div>
              <div className="flex text-[10px] text-gray-400 font-medium uppercase px-2 mb-2 pb-2 border-b">
                <div className="w-8">ลำดับ</div>
                <div className="flex-1">กลุ่ม Facebook</div>
                <div className="w-16 text-center">สถานะ</div>
              </div>
              <div className="flex-1 overflow-y-auto space-y-2 pr-1">
                {queues.length === 0 ? <p className="text-xs text-center text-gray-400 py-4">ไม่มีคิวค้าง</p> : queues.slice(0, 10).map((q, i) => (
                  <div key={q.id} className="flex items-center text-xs px-2 py-1.5 hover:bg-white rounded-md border border-transparent hover:border-gray-100">
                    <div className="w-8 text-gray-400 font-mono">{i + 1}</div>
                    <div className="flex-1 truncate pr-2 text-gray-700">{q.group.name}</div>
                    <div className="w-16">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full block text-center ${q.status === 'POSTING' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        {q.status === 'POSTING' ? 'กำลังโพสต์' : 'รอคิว'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gray-900 rounded-xl flex flex-col h-[320px] overflow-hidden shadow-inner border border-gray-800">
              <div className="px-4 py-2 bg-gray-800 border-b border-gray-700 flex justify-between items-center">
                <h3 className="text-xs font-bold text-gray-300">Log การทำงาน (สด)</h3>
              </div>
              <div className="flex-1 overflow-y-auto p-3 font-mono text-[10px] space-y-1 text-gray-300">
                {logs.length === 0 ? <p className="text-gray-600">Waiting for events...</p> : logs.map(l => (
                  <div key={l.id} className="flex gap-2">
                    <span className="text-green-500 shrink-0">{l.createdAt.toLocaleTimeString()}</span>
                    <span className={l.status === 'ERROR' ? 'text-red-400' : 'text-gray-300'}>{l.message}</span>
                  </div>
                ))}
              </div>
              <div className="p-2 bg-gray-800 border-t border-gray-700">
                <form action={clearLogs}><button className="w-full text-[10px] text-gray-400 hover:text-white uppercase tracking-wider font-bold py-1">ล้าง Log</button></form>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Warning Banner */}
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
