import React from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/components/auth/AuthProvider';
import { Link } from 'wouter';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { MessageSquare, Users, FileText, Download } from 'lucide-react';

const Landing: React.FC = () => {
  const { login } = useAuth();

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />
      
      <div className="relative overflow-hidden flex-grow">
        <div className="absolute inset-y-0 h-full w-full" aria-hidden="true">
          <div className="relative h-full">
            <svg className="absolute right-full transform translate-y-1/3 translate-x-1/4 md:translate-y-1/2 sm:translate-x-1/2 lg:translate-x-full" width="404" height="784" fill="none" viewBox="0 0 404 784">
              <defs>
                <pattern id="e229dbec-10e9-49ee-8ec3-0286ca089edf" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                  <rect x="0" y="0" width="4" height="4" className="text-gray-200" fill="currentColor" />
                </pattern>
              </defs>
              <rect width="404" height="784" fill="url(#e229dbec-10e9-49ee-8ec3-0286ca089edf)" />
            </svg>
            <svg className="absolute left-full transform -translate-y-3/4 -translate-x-1/4 sm:-translate-x-1/2 md:-translate-y-1/2 lg:-translate-x-3/4" width="404" height="784" fill="none" viewBox="0 0 404 784">
              <defs>
                <pattern id="d2a68204-c383-44b1-b99f-42ccff4e5365" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                  <rect x="0" y="0" width="4" height="4" className="text-gray-200" fill="currentColor" />
                </pattern>
              </defs>
              <rect width="404" height="784" fill="url(#d2a68204-c383-44b1-b99f-42ccff4e5365)" />
            </svg>
          </div>
        </div>

        {/* Hero Section */}
        <div className="relative pt-6 pb-16 sm:pb-24">
          <div className="mt-16 mx-auto max-w-7xl px-4 sm:px-6">
            <div className="text-center">
              <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                <span className="block">Analyze Your</span>
                <span className="block text-primary">WhatsApp Chats</span>
              </h1>
              <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
                Upload your WhatsApp chat data and get advanced insights through machine learning analysis. Discover sentiment patterns, conversation topics, and more.
              </p>
              <div className="mt-10 flex justify-center">
                <div className="rounded-md shadow">
                  <Button 
                    onClick={() => login()} 
                    className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-blue-700 md:py-4 md:text-lg md:px-10"
                  >
                    Get started
                  </Button>
                </div>
                <div className="ml-3 rounded-md shadow">
                  <Link href="#features">
                    <a className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-primary bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10">
                      Learn more
                    </a>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="relative" id="features">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="py-12 md:py-20">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="lg:text-center">
                  <h2 className="text-base text-primary font-semibold tracking-wide uppercase">Features</h2>
                  <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                    Unlock chat insights with AI
                  </p>
                  <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
                    Our advanced machine learning algorithms analyze your WhatsApp chats to reveal patterns and insights you might have missed.
                  </p>
                </div>

                <div className="mt-10">
                  <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
                    <div className="relative">
                      <dt>
                        <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-primary text-white">
                          <MessageSquare className="h-6 w-6" />
                        </div>
                        <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Sentiment Analysis</p>
                      </dt>
                      <dd className="mt-2 ml-16 text-base text-gray-500">
                        Understand the emotional tone of conversations over time with our advanced sentiment analysis.
                      </dd>
                    </div>

                    <div className="relative">
                      <dt>
                        <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-primary text-white">
                          <Users className="h-6 w-6" />
                        </div>
                        <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Participant Activity</p>
                      </dt>
                      <dd className="mt-2 ml-16 text-base text-gray-500">
                        See who contributes the most, least, and analyze conversation participation patterns.
                      </dd>
                    </div>

                    <div className="relative">
                      <dt>
                        <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-primary text-white">
                          <FileText className="h-6 w-6" />
                        </div>
                        <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Topic Modeling</p>
                      </dt>
                      <dd className="mt-2 ml-16 text-base text-gray-500">
                        Discover what topics dominate your conversations with our sophisticated ML topic classification.
                      </dd>
                    </div>

                    <div className="relative">
                      <dt>
                        <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-primary text-white">
                          <Download className="h-6 w-6" />
                        </div>
                        <p className="ml-16 text-lg leading-6 font-medium text-gray-900">PDF Reports</p>
                      </dt>
                      <dd className="mt-2 ml-16 text-base text-gray-500">
                        Download comprehensive PDF reports of your analysis to share or save for future reference.
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Landing;
