import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { Upload, X, FileText } from 'lucide-react';
import { uploadAndAnalyzeChat } from '@/lib/api';
import { Analysis } from '@/types';

interface FileUploadProps {
  onAnalysisComplete: (analysisData: Analysis) => void;
  onAnalysisStart: () => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onAnalysisComplete, onAnalysisStart }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    const files = event.target.files;
    
    if (files && files.length > 0) {
      const file = files[0];
      
      // Validate file type
      if (!file.name.endsWith('.txt')) {
        toast({
          title: 'Invalid file',
          description: 'Please upload a .txt file exported from WhatsApp.',
          variant: 'destructive',
        });
        return;
      }
      
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: 'File too large',
          description: 'Maximum file size is 10MB.',
          variant: 'destructive',
        });
        return;
      }
      
      setSelectedFile(file);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    
    const files = event.dataTransfer.files;
    
    if (files && files.length > 0) {
      const file = files[0];
      
      // Validate file type
      if (!file.name.endsWith('.txt')) {
        toast({
          title: 'Invalid file',
          description: 'Please upload a .txt file exported from WhatsApp.',
          variant: 'destructive',
        });
        return;
      }
      
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: 'File too large',
          description: 'Maximum file size is 10MB.',
          variant: 'destructive',
        });
        return;
      }
      
      setSelectedFile(file);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleAnalyze = async () => {
    if (!selectedFile) {
      toast({
        title: 'No file selected',
        description: 'Please select a file to upload.',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      setIsUploading(true);
      onAnalysisStart();
      
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          const newProgress = prev + 5;
          return newProgress > 90 ? 90 : newProgress;
        });
      }, 200);
      
      // Upload and analyze the chat file
      const analysisData = await uploadAndAnalyzeChat(selectedFile);
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      toast({
        title: 'Analysis complete',
        description: 'Your chat has been successfully analyzed.',
      });
      
      onAnalysisComplete(analysisData);
    } catch (error) {
      console.error('Upload error:', error);
      
      // Set isUploading to false and reset progress
      setIsUploading(false);
      setUploadProgress(0);
      
      // Display error message
      toast({
        title: 'Upload failed',
        description: error instanceof Error ? error.message : 'Failed to upload and analyze file.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Card className="w-full mb-6">
      <CardHeader>
        <CardTitle>Upload WhatsApp Chat</CardTitle>
        <CardDescription>
          Export your WhatsApp chat as a .txt file and upload it below.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!isUploading ? (
          <div className="space-y-6">
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md cursor-pointer hover:border-primary transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="space-y-1 text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600">
                  <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-primary hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary">
                    <span>Upload a file</span>
                    <input
                      id="file-upload"
                      name="file-upload"
                      type="file"
                      className="sr-only"
                      accept=".txt"
                      onChange={handleFileChange}
                      ref={fileInputRef}
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">
                  WhatsApp .txt chat export only
                </p>
              </div>
            </div>

            {selectedFile && (
              <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded">
                <FileText className="text-primary h-5 w-5" />
                <span className="text-sm font-medium text-gray-900 flex-1 truncate" title={selectedFile.name}>
                  {selectedFile.name}
                </span>
                <span className="text-xs text-gray-500">
                  {(selectedFile.size / 1024).toFixed(1)} KB
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleRemoveFile}
                  className="text-red-500 hover:text-red-700 p-0 h-6 w-6"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}

            <Button
              onClick={handleAnalyze}
              className="w-full"
              disabled={!selectedFile}
            >
              Analyze Chat
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-center">
              <p className="text-sm font-medium text-gray-700 mb-2">Analyzing your chat...</p>
              <Progress value={uploadProgress} className="h-2" />
              <p className="text-xs text-gray-500 mt-1">
                This may take a few moments as our ML model processes your data
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FileUpload;
