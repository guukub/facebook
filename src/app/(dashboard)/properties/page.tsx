import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { deleteProperty } from "@/app/actions/property";
import { PlusCircle, Edit, Trash2 } from "lucide-react";

export default async function PropertiesPage() {
  const properties = await prisma.property.findMany({
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Properties</h2>
        <Link href="/properties/new">
          <Button><PlusCircle className="mr-2 h-4 w-4" /> Add Property</Button>
        </Link>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {properties.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  No properties found.
                </TableCell>
              </TableRow>
            ) : properties.map((property) => (
              <TableRow key={property.id}>
                <TableCell className="font-medium">{property.name}</TableCell>
                <TableCell>{property.propertyType}</TableCell>
                <TableCell>{property.price.toLocaleString()} THB</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    property.status === 'พร้อมขาย' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                    property.status === 'จองแล้ว' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                    'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
                  }`}>
                    {property.status}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Link href={`/properties/${property.id}/edit`}>
                      <Button variant="outline" size="icon"><Edit className="h-4 w-4" /></Button>
                    </Link>
                    <form action={deleteProperty.bind(null, property.id)}>
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
