
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

export default function History() {
  const { data: analyses, isLoading } = useQuery({
    queryKey: ['analyses'],
    queryFn: async () => {
      const response = await fetch('/api/analyses');
      if (!response.ok) throw new Error('Failed to fetch analyses');
      return response.json();
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-border" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Analysis History</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>File Name</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Messages</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {analyses?.map((analysis: any) => (
                <TableRow key={analysis.id}>
                  <TableCell>{analysis.fileName}</TableCell>
                  <TableCell>{format(new Date(analysis.uploadDate), 'PPP')}</TableCell>
                  <TableCell>{Math.round(analysis.fileSize / 1024)} KB</TableCell>
                  <TableCell>{analysis.totalMessages}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
