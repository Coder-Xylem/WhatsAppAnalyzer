import { queryClient } from './queryClient';
import type { Analysis, AnalysisSummary } from '@/types';

// Upload and analyze WhatsApp chat file
export async function uploadAndAnalyzeChat(file: File): Promise<Analysis> {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to upload and analyze file');
    }

    const result = await response.json();
    queryClient.invalidateQueries({ queryKey: ['/api/analyses'] });
    return result;
  } catch (error) {
    console.error('Upload error:', error);
    throw error;
  }
}

// Get all analyses
export async function getAnalyses(): Promise<AnalysisSummary[]> {
  const response = await fetch('/api/analyses');

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to fetch analyses');
  }

  return response.json();
}

// Get specific analysis
export async function getAnalysis(id: string): Promise<Analysis> {
  const response = await fetch(`/api/analyses/${id}`);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to fetch analysis');
  }

  return response.json();
}