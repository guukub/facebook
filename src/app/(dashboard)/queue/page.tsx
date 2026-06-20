import { prisma } from "@/lib/prisma";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { deleteQueueItem } from "@/app/actions/queue";
import { Trash2 } from "lucide-react";

export default async function QueuePage() {
  const queues = await prisma.postQueue.findMany({
    include: {
      property: true,
      group: true,
    },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Post Queue</h2>

      <div className="border rounded-md bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Property</TableHead>
              <TableHead>Group</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Error</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {queues.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  No items in queue.
                </TableCell>
              </TableRow>
            ) : queues.map((queue) => (
              <TableRow key={queue.id}>
                <TableCell className="font-medium">{queue.property.name}</TableCell>
                <TableCell>{queue.group.name}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    queue.status === 'SUCCESS' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                    queue.status === 'FAILED' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                    queue.status === 'POSTING' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                    'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                  }`}>
                    {queue.status}
                  </span>
                </TableCell>
                <TableCell>{queue.createdAt.toLocaleString()}</TableCell>
                <TableCell className="text-red-500 text-sm max-w-[200px] truncate">{queue.errorMessage || "-"}</TableCell>
                <TableCell className="text-right">
                  <form action={deleteQueueItem.bind(null, queue.id)}>
                    <Button variant="ghost" size="icon" type="submit" className="text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </form>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
