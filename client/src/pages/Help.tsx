import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Help: React.FC = () => {
  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center space-x-4 mb-6">
        <Button 
          variant="outline" 
          size="icon"
          onClick={() => window.history.back()}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Help Center</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Help & FAQ</CardTitle>
          <CardDescription>
            Frequently asked questions about using WhatsApp Chat Analyzer
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible>
            <AccordionItem value="item-1">
              <AccordionTrigger>How do I upload a WhatsApp chat?</AccordionTrigger>
              <AccordionContent>
                Export your WhatsApp chat as a .txt file from WhatsApp, then upload it through the dashboard. The system will automatically analyze the content.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
              <AccordionTrigger>What types of analysis are performed?</AccordionTrigger>
              <AccordionContent>
                We analyze sentiment patterns, participant activity, common topics, and provide detailed statistics about your conversations.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3">
              <AccordionTrigger>Can I view my past analyses?</AccordionTrigger>
              <AccordionContent>
                Yes, you can view your analysis history and results from the dashboard at any time.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4">
              <AccordionTrigger>Is my chat data secure?</AccordionTrigger>
              <AccordionContent>
                Yes, your data is encrypted and processed securely. We never share your chat data with third parties.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
};

export default Help;
