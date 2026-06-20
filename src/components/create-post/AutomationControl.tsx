"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toggleAutomation, updateAutomationSettings, clearLogs } from "@/app/actions/automation";
import { Rocket, Bot, Pause, Square, RefreshCw, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = {
  setting: any;
  logs: any[];
  queues: any[];
};

export function AutomationControl({ setting, logs, queues }: Props) {
  const router = useRouter();
  const [minDelay, setMinDelay] = useState(setting.minDelay);
  const [maxDelay, setMaxDelay] = useState(setting.maxDelay);
  const [batchLimit, setBatchLimit] = useState(setting.batchLimit);

  const saveSettings = async () => {
    const formData = new FormData();
    formData.append("minDelay", minDelay.toString());
    formData.append("maxDelay", maxDelay.toString());
    formData.append("batchLimit", batchLimit.toString());
    await updateAutomationSettings(formData);
  };

  return (
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
  );
}
