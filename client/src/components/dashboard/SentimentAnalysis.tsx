import React, { useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sentiment } from '@/types';
import { Chart, registerables } from 'chart.js';

interface SentimentAnalysisProps {
  sentiment: Sentiment;
}

// Register Chart.js components
Chart.register(...registerables);

const SentimentAnalysis: React.FC<SentimentAnalysisProps> = ({ sentiment }) => {
  const timelineChartRef = useRef<HTMLCanvasElement>(null);
  const distributionChartRef = useRef<HTMLCanvasElement>(null);
  const timelineChartInstance = useRef<Chart | null>(null);
  const distributionChartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    // Initialize timeline chart
    if (timelineChartRef.current && sentiment.timeline?.length > 0) {
      // Destroy previous chart if it exists
      if (timelineChartInstance.current) {
        timelineChartInstance.current.destroy();
      }
      
      const ctx = timelineChartRef.current.getContext('2d');
      
      if (ctx) {
        // Parse the timeline data with null checks
        const labels = sentiment.timeline?.map(t => t.date) || [];
        const positiveData = sentiment.timeline?.map(t => t.positive) || [];
        const negativeData = sentiment.timeline?.map(t => t.negative) || [];
        const neutralData = sentiment.timeline?.map(t => t.neutral) || [];
        
        // Create new chart
        timelineChartInstance.current = new Chart(ctx, {
          type: 'line',
          data: {
            labels,
            datasets: [
              {
                label: 'Positive',
                data: positiveData,
                borderColor: 'rgba(16, 185, 129, 1)',
                backgroundColor: 'rgba(16, 185, 129, 0.2)',
                tension: 0.3,
                fill: true
              },
              {
                label: 'Negative',
                data: negativeData,
                borderColor: 'rgba(239, 68, 68, 1)',
                backgroundColor: 'rgba(239, 68, 68, 0.2)',
                tension: 0.3,
                fill: true
              },
              {
                label: 'Neutral',
                data: neutralData,
                borderColor: 'rgba(245, 158, 11, 1)',
                backgroundColor: 'rgba(245, 158, 11, 0.2)',
                tension: 0.3,
                fill: true
              }
            ]
          },
          options: {
            responsive: true,
            plugins: {
              legend: {
                position: 'bottom'
              },
              tooltip: {
                mode: 'index',
                intersect: false
              }
            },
            scales: {
              y: {
                beginAtZero: true,
                stacked: false
              }
            }
          }
        });
      }
    }
    
    // Initialize distribution chart
    if (distributionChartRef.current) {
      // Destroy previous chart if it exists
      if (distributionChartInstance.current) {
        distributionChartInstance.current.destroy();
      }
      
      const ctx = distributionChartRef.current.getContext('2d');
      
      if (ctx) {
        // Create new chart
        distributionChartInstance.current = new Chart(ctx, {
          type: 'doughnut',
          data: {
            labels: ['Positive', 'Negative', 'Neutral'],
            datasets: [{
              data: [sentiment.positive, sentiment.negative, sentiment.neutral],
              backgroundColor: [
                'rgba(16, 185, 129, 0.8)',  // green for positive
                'rgba(239, 68, 68, 0.8)',   // red for negative
                'rgba(245, 158, 11, 0.8)'   // amber for neutral
              ],
              borderColor: [
                'rgba(16, 185, 129, 1)',
                'rgba(239, 68, 68, 1)',
                'rgba(245, 158, 11, 1)'
              ],
              borderWidth: 1
            }]
          },
          options: {
            responsive: true,
            plugins: {
              legend: {
                position: 'bottom'
              }
            }
          }
        });
      }
    }
    
    // Cleanup on unmount
    return () => {
      if (timelineChartInstance.current) {
        timelineChartInstance.current.destroy();
      }
      if (distributionChartInstance.current) {
        distributionChartInstance.current.destroy();
      }
    };
  }, [sentiment]);

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      {sentiment.timeline?.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Sentiment Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <canvas ref={timelineChartRef} />
            </div>
          </CardContent>
        </Card>
      )}
      
      <Card>
        <CardHeader>
          <CardTitle>Sentiment Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[530px] w-full flex items-center justify-center">
            <canvas ref={distributionChartRef} />
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2 text-center">
            <div className="rounded-lg bg-green-50 p-2">
              <span className="text-xs font-medium text-green-800">Positive</span>
              <p className="text-xl font-bold text-green-600">{sentiment.positive?.toFixed(1) || 0}%</p>
            </div>
            <div className="rounded-lg bg-red-50 p-2">
              <span className="text-xs font-medium text-red-800">Negative</span>
              <p className="text-xl font-bold text-red-600">{sentiment.negative?.toFixed(1) || 0}%</p>
            </div>
            <div className="rounded-lg bg-yellow-50 p-2">
              <span className="text-xs font-medium text-yellow-800">Neutral</span>
              <p className="text-xl font-bold text-yellow-600">{sentiment.neutral?.toFixed(1) || 0}%</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SentimentAnalysis;
