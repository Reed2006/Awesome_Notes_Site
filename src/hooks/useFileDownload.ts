import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { downloadFile, type UploadProgress } from '@/services/storage';
import { toast } from 'sonner';

export function useFileDownload() {
  const [progress, setProgress] = useState<UploadProgress | null>(null);

  const mutation = useMutation({
    mutationFn: async ({ url, filename }: { url: string; filename: string }) => {
      await downloadFile(url, filename, setProgress);
    },
    onSuccess: (_, variables) => {
      toast.success(`文件已下载: ${variables.filename}`);
      setProgress(null);
    },
    onError: (error: Error) => {
      toast.error(`下载失败: ${error.message}`);
      setProgress(null);
    },
  });

  return {
    download: mutation.mutate,
    isDownloading: mutation.isPending,
    progress,
    error: mutation.error,
  };
}
