import { queryClient } from './queryClient';
import { Analysis, AnalysisSummary } from '@/types';

// Upload and analyze WhatsApp chat file
export async function uploadAndAnalyzeChat(file: File): Promise<Analysis> {
  const formData = new FormData();
  formData.append('file', file);
  
  // Set credentials: 'include' to send cookies (for session-based auth)
  const response = await fetch('/api/upload', {
    method: 'POST',
    body: formData,
    credentials: 'include', // Important for sending session cookies
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Failed to upload and analyze file' }));
    throw new Error(errorData.message || 'Failed to upload and analyze file');
  }
  
  const result = await response.json();
  
  // Invalidate analyses cache
  queryClient.invalidateQueries({ queryKey: ['/api/analyses'] });
  
  return result;
}

// Get all analyses
export async function getAnalyses(): Promise<AnalysisSummary[]> {
  const response = await fetch('/api/analyses', {
    credentials: 'include', // Important for sending session cookies
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Failed to fetch analyses' }));
    throw new Error(errorData.message || 'Failed to fetch analyses');
  }
  
  return response.json();
}

// Get specific analysis
export async function getAnalysis(id: number): Promise<Analysis> {
  const response = await fetch(`/api/analyses/${id}`, {
    credentials: 'include', // Important for sending session cookies
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Failed to fetch analysis' }));
    throw new Error(errorData.message || 'Failed to fetch analysis');
  }
  
  return response.json();
}

// Download PDF report
export function downloadPdfReport(id: number): void {
  try {
    // Create a hidden anchor and simulate click to download the file
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = `/api/analyses/${id}/pdf`;
    a.download = `chat-analysis-${id}.pdf`;
    
    // The credentials will be included automatically by the browser
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  } catch (error) {
    console.error('Error downloading PDF:', error);
  }
}
