import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { deleteFacebookGroup } from "@/app/actions/group";
import { PlusCircle, Edit, Trash2, ExternalLink } from "lucide-react";

export default async function GroupsPage() {
  const groups = await prisma.facebookGroup.findMany({
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Facebook Groups</h2>
        <Link href="/groups/new">
          <Button><PlusCircle className="mr-2 h-4 w-4" /> Add Group</Button>
        </Link>
      </div>

      <div className="border rounded-md bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Group Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Province</TableHead>
              <TableHead>Members</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {groups.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  No Facebook groups found.
                </TableCell>
              </TableRow>
            ) : groups.map((group) => (
              <TableRow key={group.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    {group.name}
                    <a href={group.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </TableCell>
                <TableCell>{group.category}</TableCell>
                <TableCell>{group.province}</TableCell>
                <TableCell>{group.memberCount.toLocaleString()}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    group.isActive ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                  }`}>
                    {group.isActive ? 'Active' : 'Inactive'}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <form action={deleteFacebookGroup.bind(null, group.id)}>
                      <Button variant="destructive" size="icon" type="submit">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </form>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
