import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/components/auth/AuthProvider';
import { Link } from 'wouter';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { 
  MessageSquare, 
  Users, 
  FileText, 
  Download, 
  Smartphone,
  FileBarChart,
  HelpCircle,
  ChevronRight
} from 'lucide-react';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '@/components/ui/tabs';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';

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
                  <Button 
                    onClick={() => {
                      document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    variant="outline"
                    className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-primary bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10"
                  >
                    Learn more
                  </Button>
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
        
        {/* How to Extract Chat Data Section */}
        <div className="bg-gradient-to-b from-gray-50 to-white py-16 sm:py-24" id="how-to">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-base font-semibold uppercase tracking-wide text-primary">Get Started</h2>
              <p className="mt-1 text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-5xl">
                How to Export Your WhatsApp Chat
              </p>
              <p className="mx-auto mt-5 max-w-xl text-xl text-gray-500">
                Follow these simple steps to extract chat data from your WhatsApp app
              </p>
            </div>
            
            <div className="mt-12">
              <Tabs defaultValue="android" className="w-full">
                <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
                  <TabsTrigger value="android" className="flex items-center justify-center gap-2">
                    <Smartphone className="h-4 w-4" />
                    Android
                  </TabsTrigger>
                  <TabsTrigger value="iphone" className="flex items-center justify-center gap-2">
                    <Smartphone className="h-4 w-4" />
                    iPhone
                  </TabsTrigger>
                </TabsList>
                
                <div className="mt-8">
                  <TabsContent value="android" className="rounded-lg">
                    <Card>
                      <CardHeader>
                        <CardTitle>Export Chat from Android</CardTitle>
                        <CardDescription>
                          Follow these steps to export your WhatsApp chat on Android devices
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ol className="space-y-4 list-decimal ml-4">
                          <li className="flex items-start">
                            <span className="font-medium text-gray-900 mr-2">Open WhatsApp:</span>
                            <span className="text-gray-600">Open the WhatsApp application on your Android device.</span>
                          </li>
                          <li className="flex items-start">
                            <span className="font-medium text-gray-900 mr-2">Open the Chat:</span>
                            <span className="text-gray-600">Navigate to the chat you want to export.</span>
                          </li>
                          <li className="flex items-start">
                            <span className="font-medium text-gray-900 mr-2">Access Chat Options:</span>
                            <span className="text-gray-600">Tap the three dots in the top-right corner to open the menu.</span>
                          </li>
                          <li className="flex items-start">
                            <span className="font-medium text-gray-900 mr-2">More Options:</span>
                            <span className="text-gray-600">Select "More" from the dropdown menu.</span>
                          </li>
                          <li className="flex items-start">
                            <span className="font-medium text-gray-900 mr-2">Export Chat:</span>
                            <span className="text-gray-600">Tap on "Export chat". You'll be asked whether to include media files.</span>
                          </li>
                          <li className="flex items-start">
                            <span className="font-medium text-gray-900 mr-2">Choose 'Without Media':</span>
                            <span className="text-gray-600">Select "Without Media" to export only the text content.</span>
                          </li>
                          <li className="flex items-start">
                            <span className="font-medium text-gray-900 mr-2">Save or Share:</span>
                            <span className="text-gray-600">Save the .txt file to your device or share it directly.</span>
                          </li>
                        </ol>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  <TabsContent value="iphone" className="rounded-lg">
                    <Card>
                      <CardHeader>
                        <CardTitle>Export Chat from iPhone</CardTitle>
                        <CardDescription>
                          Follow these steps to export your WhatsApp chat on iOS devices
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ol className="space-y-4 list-decimal ml-4">
                          <li className="flex items-start">
                            <span className="font-medium text-gray-900 mr-2">Open WhatsApp:</span>
                            <span className="text-gray-600">Open the WhatsApp application on your iPhone.</span>
                          </li>
                          <li className="flex items-start">
                            <span className="font-medium text-gray-900 mr-2">Open the Chat:</span>
                            <span className="text-gray-600">Go to the chat you want to export.</span>
                          </li>
                          <li className="flex items-start">
                            <span className="font-medium text-gray-900 mr-2">Access Chat Info:</span>
                            <span className="text-gray-600">Tap on the contact name at the top of the chat to open chat info.</span>
                          </li>
                          <li className="flex items-start">
                            <span className="font-medium text-gray-900 mr-2">Scroll Down:</span>
                            <span className="text-gray-600">Scroll to the bottom of the chat info screen.</span>
                          </li>
                          <li className="flex items-start">
                            <span className="font-medium text-gray-900 mr-2">Export Chat:</span>
                            <span className="text-gray-600">Tap on "Export Chat".</span>
                          </li>
                          <li className="flex items-start">
                            <span className="font-medium text-gray-900 mr-2">Choose 'Without Media':</span>
                            <span className="text-gray-600">Select "Without Media" to export only text content.</span>
                          </li>
                          <li className="flex items-start">
                            <span className="font-medium text-gray-900 mr-2">Share Options:</span>
                            <span className="text-gray-600">Choose how you want to share or save the exported .txt file.</span>
                          </li>
                        </ol>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </div>
              </Tabs>
              
              <div className="mt-12 text-center">
                <Button 
                  onClick={() => login()} 
                  className="inline-flex items-center px-6 py-3 text-base font-medium rounded-md shadow-sm text-white bg-primary hover:bg-blue-700"
                >
                  Start Analyzing <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
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
