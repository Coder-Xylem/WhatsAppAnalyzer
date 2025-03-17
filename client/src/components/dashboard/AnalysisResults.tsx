import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, MessageSquare, Smile, Frown, Meh } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Analysis } from '@/types';
import ParticipantActivity from './ParticipantActivity';
import SentimentAnalysis from './SentimentAnalysis';
import TopicAnalysis from './TopicAnalysis';
// import { downloadPdfReport } from '@/lib/api';

interface AnalysisResultsProps {
  analysis: Analysis;
}

const AnalysisResults: React.FC<AnalysisResultsProps> = ({ analysis }) => {
  

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Analysis Results</CardTitle>
            <CardDescription>
              Insights from your WhatsApp chat data
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Summary</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-indigo-500 rounded-md p-3">
                    <MessageSquare className="h-5 w-5 text-white" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Total Messages
                      </dt>
                      <dd className="flex items-baseline">
                        <div className="text-2xl font-semibold text-gray-900">
                          {analysis.messageCount.toLocaleString()}
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                    <Smile className="h-5 w-5 text-white" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Positive Sentiment
                      </dt>
                      <dd className="flex items-baseline">
                        <div className="text-2xl font-semibold text-gray-900">
                          {analysis.sentiment.positive.toFixed(1)}%
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-red-500 rounded-md p-3">
                    <Frown className="h-5 w-5 text-white" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Negative Sentiment
                      </dt>
                      <dd className="flex items-baseline">
                        <div className="text-2xl font-semibold text-gray-900">
                          {analysis.sentiment.negative.toFixed(1)}%
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-yellow-500 rounded-md p-3">
                    <Meh className="h-5 w-5 text-white" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Neutral Sentiment
                      </dt>
                      <dd className="flex items-baseline">
                        <div className="text-2xl font-semibold text-gray-900">
                          {analysis.sentiment.neutral.toFixed(1)}%
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="participants" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="participants">Participant Activity</TabsTrigger>
          <TabsTrigger value="sentiment">Sentiment Analysis</TabsTrigger>
          {/* <TabsTrigger value="topics">Topic Analysis</TabsTrigger> */}
        </TabsList>
        <TabsContent value="participants" className="mt-6">
          <ParticipantActivity participants={analysis.participants} />
        </TabsContent>
        <TabsContent value="sentiment" className="mt-6">
          <SentimentAnalysis sentiment={analysis.sentiment} />
        </TabsContent>
        <TabsContent value="topics" className="mt-6">
          <TopicAnalysis topics={analysis.topics} commonWords={analysis.topWords} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnalysisResults;
