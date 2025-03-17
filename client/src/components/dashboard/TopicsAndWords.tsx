import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Topic, TopWord } from '@/types';

interface TopicsAndWordsProps {
  topics: Topic[];
  topWords: TopWord[];
}

const TopicsAndWords: React.FC<TopicsAndWordsProps> = ({ topics, topWords }) => {
  const maxTopicCount = Math.max(...topics.map(t => t.count));
  const maxWordCount = Math.max(...topWords.map(w => w.count));

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Topics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {topics.map((topic) => (
              <div key={topic.topic} className="flex items-center">
                <div className="w-24 text-sm text-gray-600">{topic.topic}</div>
                <div className="flex-1">
                  <div
                    className="bg-primary h-4 rounded"
                    style={{
                      width: `${(topic.count / maxTopicCount) * 100}%`,
                    }}
                  />
                </div>
                <div className="w-32 text-sm text-gray-600 text-right">
                  {topic.count.toLocaleString()} ({topic.percentage.toFixed(1)}%)
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Most Used Words</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {topWords.slice(0, 20).map((word) => (
              <div key={word.word} className="flex items-center">
                <div className="w-24 text-sm text-gray-600">{word.word}</div>
                <div className="flex-1">
                  <div
                    className="bg-primary h-4 rounded"
                    style={{
                      width: `${(word.count / maxWordCount) * 100}%`,
                    }}
                  />
                </div>
                <div className="w-16 text-sm text-gray-600 text-right">
                  {word.count.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TopicsAndWords; 