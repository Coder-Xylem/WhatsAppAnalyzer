
import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
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

interface Analysis {
  id: string;
  fileName: string;
  uploadDate: string;
  fileSize: number;
  totalMessages: number;
}

const History: React.FC = () => {
  const { data: analyses, isLoading } = useQuery<Analysis[]>({
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
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Analysis History</h1>
        </div>
        <Button 
          variant="outline"
          onClick={() => window.history.forward()}
        >
          <ArrowRight className="h-4 w-4 mr-2" />
          Forward
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Past Analyses</CardTitle>
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
              {analyses?.map((analysis) => (
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
};

export default History;
