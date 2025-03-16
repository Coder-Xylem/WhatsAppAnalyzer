import { getToken } from './auth';
import { apiRequest, queryClient } from './queryClient';
import { Analysis, AnalysisSummary } from '@/types';

// Upload and analyze WhatsApp chat file
export async function uploadAndAnalyzeChat(file: File): Promise<Analysis> {
  const token = await getToken();
  
  if (!token) {
    throw new Error("Not authenticated");
  }
  
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await fetch('/api/upload', {
    method: 'POST',
    body: formData,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'Failed to upload and analyze file');
  }
  
  const result = await response.json();
  
  // Invalidate analyses cache
  queryClient.invalidateQueries({ queryKey: ['/api/analyses'] });
  
  return result;
}

// Get all analyses
export async function getAnalyses(): Promise<AnalysisSummary[]> {
  const token = await getToken();
  
  if (!token) {
    throw new Error("Not authenticated");
  }
  
  const response = await fetch('/api/analyses', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'Failed to fetch analyses');
  }
  
  return response.json();
}

// Get specific analysis
export async function getAnalysis(id: number): Promise<Analysis> {
  const token = await getToken();
  
  if (!token) {
    throw new Error("Not authenticated");
  }
  
  const response = await fetch(`/api/analyses/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'Failed to fetch analysis');
  }
  
  return response.json();
}

// Download PDF report
export function downloadPdfReport(id: number): void {
  getToken().then(token => {
    if (!token) {
      throw new Error("Not authenticated");
    }
    
    // Create a hidden anchor and simulate click to download the file
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = `/api/analyses/${id}/pdf?token=${token}`;
    a.download = `chat-analysis-${id}.pdf`;
    
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }).catch(error => {
    console.error('Error downloading PDF:', error);
  });
}
