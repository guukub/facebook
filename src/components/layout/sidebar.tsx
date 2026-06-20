"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Home, 
  Map, 
  Users, 
  Edit3, 
  ListTodo, 
  Bot, 
  LineChart, 
  Settings,
  AlertTriangle,
  ChevronDown
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { title: "Dashboard", href: "/dashboard", icon: Home },
  { title: "Properties", href: "/properties", icon: Map },
  { title: "Facebook Groups", href: "/groups", icon: Users },
  { title: "Create Post", href: "/create-post", icon: Edit3 },
  { title: "Post Queue", href: "/queue", icon: ListTodo, badge: 24 },
  { title: "Automation", href: "/automation-control", icon: Bot },
  { title: "Reports", href: "/reports", icon: LineChart },
  { title: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex flex-col w-[260px] bg-[#0c2a1c] text-white h-screen shrink-0 font-sans">
      <div className="p-6 flex items-center gap-3">
        <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center font-bold text-white shadow-sm">
          T
        </div>
        <div>
          <h1 className="text-[16px] font-bold leading-tight">TeeBangbon</h1>
          <p className="text-[11px] text-green-300">Auto Poster</p>
        </div>
      </div>
      
      <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto mt-2">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors group",
                isActive
                  ? "bg-green-600 text-white shadow-md"
                  : "text-green-100/70 hover:bg-[#14422e] hover:text-white"
              )}
            >
              <div className="flex items-center gap-3">
                <item.icon className={cn("w-5 h-5", isActive ? "text-white" : "text-green-100/70 group-hover:text-white")} strokeWidth={isActive ? 2.5 : 2} />
                {item.title}
              </div>
              {item.badge && (
                <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 mt-auto">
        <div className="bg-[#14422e] p-3 rounded-lg flex items-center justify-between cursor-pointer mb-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gray-300 rounded-full overflow-hidden">
              <img src="https://i.pravatar.cc/150?u=admin" alt="Admin" className="w-full h-full object-cover" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">ตี๋บางบอน</p>
              <p className="text-[10px] text-green-200">Administrator</p>
            </div>
          </div>
          <ChevronDown className="w-4 h-4 text-green-300" />
        </div>

        <div className="border border-yellow-500/30 bg-yellow-500/10 p-3 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-4 h-4 text-yellow-500" />
            <p className="text-xs font-bold text-yellow-500">คำเตือน</p>
          </div>
          <p className="text-[10px] text-yellow-500/80 leading-relaxed">
            การโพสต์อัตโนมัติอาจทำให้บัญชี Facebook ของคุณถูกจำกัด หรือถูกปิดใช้งานได้ ควรใช้อย่างระมัดระวัง และไม่ควรโพสต์ถี่เกินไป
          </p>
        </div>
      </div>
    </div>
  );
}
