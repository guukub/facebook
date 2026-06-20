import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toggleAutomation, updateAutomationSettings, clearLogs } from "@/app/actions/automation";
import { Play, Pause, Square, Save, RefreshCw, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Optional: refresh page automatically every 5 seconds to see logs if we used a client component, 
// but we'll keep it simple as a server component with a refresh button for now.

export default async function AutomationControlPage() {
  const setting = await prisma.automationSetting.findFirst() || {
    isActive: false, minDelay: 60, maxDelay: 180, batchLimit: 10
  };

  const logs = await prisma.log.findMany({
    orderBy: { createdAt: 'desc' },
    take: 50 // Show last 50 logs
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Automation Control</h2>
        <form>
          <Button variant="outline" formAction={async () => { "use server"; }}>
            <RefreshCw className="mr-2 h-4 w-4" /> Refresh Logs
          </Button>
        </form>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Control Panel</CardTitle>
              <CardDescription>Start or pause the Playwright script</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className={`px-4 py-2 rounded-full font-bold text-sm ${setting.isActive ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                  Status: {setting.isActive ? "RUNNING" : "PAUSED"}
                </div>
                <div className="text-sm text-muted-foreground">
                  (Note: You must also run `npm run automation` in terminal)
                </div>
              </div>
              
              <div className="flex gap-4 pt-4 border-t">
                {setting.isActive ? (
                  <form action={toggleAutomation.bind(null, false)}>
                    <Button variant="destructive" size="lg" type="submit">
                      <Pause className="mr-2 h-5 w-5" /> Pause Posting
                    </Button>
                  </form>
                ) : (
                  <form action={toggleAutomation.bind(null, true)}>
                    <Button className="bg-green-600 hover:bg-green-700" size="lg" type="submit">
                      <Play className="mr-2 h-5 w-5" /> Start Posting
                    </Button>
                  </form>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Settings</CardTitle>
              <CardDescription>Risk management settings</CardDescription>
            </CardHeader>
            <CardContent>
              <form action={updateAutomationSettings} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="minDelay">Min Delay (seconds)</Label>
                    <Input id="minDelay" name="minDelay" type="number" defaultValue={setting.minDelay} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="maxDelay">Max Delay (seconds)</Label>
                    <Input id="maxDelay" name="maxDelay" type="number" defaultValue={setting.maxDelay} required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="batchLimit">Max Posts per Session</Label>
                  <Input id="batchLimit" name="batchLimit" type="number" defaultValue={setting.batchLimit} required />
                </div>
                <Button type="submit" variant="secondary" className="w-full">
                  <Save className="mr-2 h-4 w-4" /> Save Settings
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <Card className="flex flex-col h-[600px]">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Live Logs</CardTitle>
              <CardDescription>Last 50 events from automation</CardDescription>
            </div>
            <form action={clearLogs}>
              <Button variant="ghost" size="icon" className="text-destructive" title="Clear Logs">
                <Trash2 className="h-4 w-4" />
              </Button>
            </form>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto bg-black text-green-400 p-4 font-mono text-sm rounded-b-lg">
            {logs.length === 0 ? (
              <div className="text-gray-500">No logs found...</div>
            ) : logs.map(log => (
              <div key={log.id} className="mb-1">
                <span className="text-gray-500">[{log.createdAt.toLocaleTimeString()}]</span>{" "}
                <span className={
                  log.status === 'ERROR' ? 'text-red-500' :
                  log.status === 'SUCCESS' ? 'text-green-500' : 'text-blue-300'
                }>[{log.status}]</span>{" "}
                <span className="text-white">{log.message}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
