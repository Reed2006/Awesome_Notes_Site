import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { uploadFile, type UploadProgress } from '@/services/storage';
import { toast } from 'sonner';

interface UploadParams {
  file: File;
  storagePath: string;
}

export function useFileUpload() {
  const [progress, setProgress] = useState<UploadProgress | null>(null);

  const mutation = useMutation({
    mutationFn: async ({ file, storagePath }: UploadParams) => {
      const url = await uploadFile(file, storagePath, {
        onProgress: setProgress,
      });
      return { url, file };
    },
    onSuccess: (data) => {
      toast.success(`文件已上传: ${data.file.name}`);
      setProgress(null);
    },
    onError: (error: Error) => {
      toast.error(`上传失败: ${error.message}`);
      setProgress(null);
    },
  });

  return {
    upload: mutation.mutate,
    isUploading: mutation.isPending,
    progress,
    uploadedUrl: mutation.data?.url,
    error: mutation.error,
  };
}
