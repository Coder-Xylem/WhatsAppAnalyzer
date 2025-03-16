import React, { useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Topic, CommonWord } from '@/types';
import { Chart, registerables } from 'chart.js';

interface TopicAnalysisProps {
  topics: Topic;
  commonWords: CommonWord[];
}

// Register Chart.js components
Chart.register(...registerables);

const TopicAnalysis: React.FC<TopicAnalysisProps> = ({ topics, commonWords }) => {
  const topicsChartRef = useRef<HTMLCanvasElement>(null);
  const topicsChartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    if (topicsChartRef.current) {
      // Destroy previous chart if it exists
      if (topicsChartInstance.current) {
        topicsChartInstance.current.destroy();
      }
      
      const ctx = topicsChartRef.current.getContext('2d');
      
      if (ctx) {
        // Prepare data for the chart
        const labels = Object.keys(topics.distribution);
        const data = Object.values(topics.distribution);
        
        // Colors for topics
        const backgroundColors = [
          'rgba(59, 130, 246, 0.8)',   // blue
          'rgba(139, 92, 246, 0.8)',   // purple
          'rgba(16, 185, 129, 0.8)',   // green
          'rgba(245, 158, 11, 0.8)',   // amber
          'rgba(239, 68, 68, 0.8)',    // red
          'rgba(107, 114, 128, 0.8)',  // gray
        ];
        
        const borderColors = backgroundColors.map(color => color.replace('0.8', '1'));
        
        // Create new chart
        topicsChartInstance.current = new Chart(ctx, {
          type: 'pie',
          data: {
            labels,
            datasets: [{
              data,
              backgroundColor: backgroundColors.slice(0, labels.length),
              borderColor: borderColors.slice(0, labels.length),
              borderWidth: 1
            }]
          },
          options: {
            responsive: true,
            plugins: {
              legend: {
                position: 'bottom'
              },
              tooltip: {
                callbacks: {
                  label: (context) => {
                    const value = context.raw as number;
                    return `${context.label}: ${value}%`;
                  }
                }
              }
            }
          }
        });
      }
    }

    // Cleanup on unmount
    return () => {
      if (topicsChartInstance.current) {
        topicsChartInstance.current.destroy();
      }
    };
  }, [topics]);

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Common Topics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[250px]">
            <canvas ref={topicsChartRef} />
          </div>
          <div className="mt-4">
            <h4 className="text-sm font-medium text-gray-500 mb-2">Topic Distribution</h4>
            <div className="space-y-2">
              {Object.entries(topics.distribution).map(([topic, percentage], index) => (
                <div key={index} className="flex items-center">
                  <div 
                    className="w-3 h-3 rounded-full mr-2" 
                    style={{ backgroundColor: `rgba(${index * 50}, ${100 + index * 20}, ${200 - index * 20}, 0.8)` }}
                  ></div>
                  <span className="text-sm text-gray-700 flex-1">{topic}</span>
                  <span className="text-sm font-medium">{percentage}%</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Most Common Words</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-4 bg-gray-50 rounded-lg min-h-[250px] flex flex-wrap items-center justify-center">
            {commonWords.map((word, index) => (
              <span 
                key={index} 
                className="inline-block bg-white px-3 py-1 m-1 rounded-full text-sm font-medium"
                style={{ fontSize: word.size ? `${word.size}px` : '16px' }}
                title={`${word.text} (${word.count} occurrences)`}
              >
                {word.text}
              </span>
            ))}
          </div>
          <div className="mt-4">
            <h4 className="text-sm font-medium text-gray-500 mb-2">Top 10 Words</h4>
            <div className="grid grid-cols-2 gap-2">
              {commonWords.slice(0, 10).map((word, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span className="text-sm text-gray-700">{word.text}</span>
                  <span className="text-xs font-medium bg-white px-2 py-1 rounded-full">{word.count}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TopicAnalysis;
