import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";

export default function Landing() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Analyze Your WhatsApp Chats
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  Upload your WhatsApp chat and get detailed insights about your conversations.
                  Discover patterns, analyze sentiment, and visualize your chat history.
                </p>
              </div>
              <div className="space-x-4">
                <Button className="bg-[#128C7E] text-white hover:bg-[#075E54]" asChild>
                  <Link href="/dashboard">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Start Analyzing
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/help">Learn More</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100">
          <div className="container px-4 md:px-6">
            <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="rounded-full bg-[#128C7E] p-4">
                  <MessageSquare className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold">Message Analysis</h3>
                <p className="text-gray-500">
                  Get detailed statistics about your messages, including frequency and patterns.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="rounded-full bg-[#128C7E] p-4">
                  <svg className="h-6 w-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5M8 8v8m-5 0h18" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold">Visual Insights</h3>
                <p className="text-gray-500">
                  View beautiful charts and visualizations of your chat data.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="rounded-full bg-[#128C7E] p-4">
                  <svg className="h-6 w-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold">Sentiment Analysis</h3>
                <p className="text-gray-500">
                  Understand the emotional tone of your conversations.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
