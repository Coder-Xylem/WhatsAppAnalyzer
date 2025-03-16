import React, { useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Participant } from '@/types';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Chart, registerables } from 'chart.js';

interface ParticipantActivityProps {
  participants: Participant[];
}

// Register Chart.js components
Chart.register(...registerables);

const ParticipantActivity: React.FC<ParticipantActivityProps> = ({ participants }) => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  // Function to get initials from name
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  // Function to determine sentiment badge color
  const getSentimentBadgeColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return 'bg-green-100 text-green-800';
      case 'negative':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  // Function to get random color based on name
  const getColorFromName = (name: string) => {
    const colors = [
      'rgba(59, 130, 246, 0.8)', // blue
      'rgba(99, 102, 241, 0.8)', // indigo
      'rgba(139, 92, 246, 0.8)',  // purple
      'rgba(236, 72, 153, 0.8)', // pink
      'rgba(239, 68, 68, 0.8)',  // red
      'rgba(245, 158, 11, 0.8)', // amber
      'rgba(16, 185, 129, 0.8)', // emerald
    ];
    
    // Simple hash function to get consistent color for the same name
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    return colors[Math.abs(hash) % colors.length];
  };

  useEffect(() => {
    if (chartRef.current && participants.length > 0) {
      // Destroy previous chart if it exists
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      const ctx = chartRef.current.getContext('2d');
      
      if (ctx) {
        // Prepare data for the chart
        const labels = participants.map(p => p.name);
        const messageData = participants.map(p => p.messages);
        const backgroundColors = participants.map(p => getColorFromName(p.name));
        const borderColors = backgroundColors.map(color => color.replace('0.8', '1'));

        // Create new chart
        chartInstance.current = new Chart(ctx, {
          type: 'bar',
          data: {
            labels,
            datasets: [{
              label: 'Number of Messages',
              data: messageData,
              backgroundColor: backgroundColors,
              borderColor: borderColors,
              borderWidth: 1
            }]
          },
          options: {
            responsive: true,
            plugins: {
              legend: {
                display: false
              }
            },
            scales: {
              y: {
                beginAtZero: true
              }
            }
          }
        });
      }
    }

    // Cleanup on unmount
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [participants]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Participant Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <canvas ref={chartRef} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Participant Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Participant
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Messages
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Words
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Avg. Sentiment
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {participants.map((participant, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <Avatar>
                            <AvatarFallback style={{ backgroundColor: getColorFromName(participant.name) }} className="text-white">
                              {getInitials(participant.name)}
                            </AvatarFallback>
                          </Avatar>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{participant.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{participant.messages.toLocaleString()}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{participant.words.toLocaleString()}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getSentimentBadgeColor(participant.sentiment.overall)}`}>
                        {participant.sentiment.overall.charAt(0).toUpperCase() + participant.sentiment.overall.slice(1)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ParticipantActivity;
