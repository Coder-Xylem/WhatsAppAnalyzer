import React, { useState } from 'react';
import { useAuth } from '../hooks/use-auth';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import FileUpload from '@/components/dashboard/FileUpload';
import AnalysisResults from '@/components/dashboard/AnalysisResults';
import { Analysis } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [analysisData, setAnalysisData] = useState<Analysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalysisStart = () => {
    setIsAnalyzing(true);
    setAnalysisData(null);
  };

  const handleAnalysisComplete = (data: Analysis) => {
    setIsAnalyzing(false);
    setAnalysisData(data);
  };

  if (!user) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <Card className="w-full max-w-md mx-4">
            <CardContent className="pt-6">
              <p className="text-center text-gray-600">Please log in to access the dashboard.</p>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        </div>
      </header>
      
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          {/* Upload Section */}
          <div className="px-4 py-6 sm:px-0">
            <FileUpload 
              onAnalysisComplete={handleAnalysisComplete}
              onAnalysisStart={handleAnalysisStart}
            />
          </div>

          {/* Loading State */}
          {isAnalyzing && (
            <div className="px-4 py-6 sm:px-0">
              <Card>
                <CardContent className="pt-6 py-12 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <Loader2 className="h-16 w-16 text-primary animate-spin" />
                    <h3 className="mt-4 text-lg font-medium text-gray-900">Analyzing your chat</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      This may take a few moments as our ML model processes your data...
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Results Section */}
          {analysisData && !isAnalyzing && (
            <div className="px-4 py-6 sm:px-0">
              <AnalysisResults analysis={analysisData} />
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
