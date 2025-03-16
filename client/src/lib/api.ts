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
export async function downloadPdfReport(analysisId: number) {
  try {
    const response = await fetch(`/api/analyses/${analysisId}/pdf`, {
      headers: {
        'Accept': 'application/pdf'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const blob = await response.blob();
    if (blob.size === 0) {
      throw new Error('Empty PDF received');
    }

    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = `chat-analysis-${analysisId}.pdf`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  } catch (error) {
    console.error('Error downloading PDF:', error);
    alert('Failed to download PDF. Please try again.');
  }
}