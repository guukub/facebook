import { Sidebar } from "@/components/layout/sidebar";
import { Bell, ChevronDown } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-slate-50/50">
      <Sidebar />
      <main className="flex-1 flex flex-col min-h-screen overflow-hidden">
        <header className="h-16 flex items-center justify-end px-8 shrink-0 bg-transparent">
          <div className="flex items-center gap-4">
            <button className="relative p-2 text-gray-400 hover:text-gray-600">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="flex items-center gap-2 cursor-pointer">
              <div className="w-8 h-8 bg-gray-300 rounded-full overflow-hidden">
                <img src="https://i.pravatar.cc/150?u=admin" alt="Admin" className="w-full h-full object-cover" />
              </div>
              <span className="text-sm font-medium text-gray-700">ตี๋บางบอน</span>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </div>
          </div>
        </header>
        <div className="flex-1 overflow-y-auto p-8 pt-2">
          <div className="max-w-[1400px] mx-auto">{children}</div>
        </div>
      </main>
    </div>
  );
}
