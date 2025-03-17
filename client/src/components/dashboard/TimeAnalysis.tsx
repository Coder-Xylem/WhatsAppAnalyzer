import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TimeAnalysis as TimeAnalysisType } from '@/types';

interface TimeAnalysisProps {
  timeAnalysis: TimeAnalysisType;
}

const TimeAnalysis: React.FC<TimeAnalysisProps> = ({ timeAnalysis }) => {
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const maxDailyActivity = Math.max(...timeAnalysis.dailyActivity);
  const maxHourlyActivity = Math.max(...timeAnalysis.hourlyActivity);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Daily Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {daysOfWeek.map((day, index) => (
              <div key={day} className="flex items-center">
                <div className="w-24 text-sm text-gray-600">{day}</div>
                <div className="flex-1">
                  <div
                    className="bg-primary h-4 rounded"
                    style={{
                      width: `${(timeAnalysis.dailyActivity[index] / maxDailyActivity) * 100}%`,
                    }}
                  />
                </div>
                <div className="w-16 text-sm text-gray-600 text-right">
                  {timeAnalysis.dailyActivity[index].toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Hourly Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {timeAnalysis.hourlyActivity.map((count, hour) => (
              <div key={hour} className="flex items-center">
                <div className="w-24 text-sm text-gray-600">
                  {hour.toString().padStart(2, '0')}:00
                </div>
                <div className="flex-1">
                  <div
                    className="bg-primary h-4 rounded"
                    style={{
                      width: `${(count / maxHourlyActivity) * 100}%`,
                    }}
                  />
                </div>
                <div className="w-16 text-sm text-gray-600 text-right">
                  {count.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Time Span</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg text-gray-900">
            Chat history spans {timeAnalysis.totalDays} days
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default TimeAnalysis; 