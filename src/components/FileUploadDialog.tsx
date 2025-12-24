import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useFileUpload } from '@/hooks/useFileUpload';
import { formatFileSize } from '@/lib/file-utils';
import { Upload, FileText } from 'lucide-react';
import { toast } from 'sonner';

interface FileUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  courseId: string;
  categoryId: string;
  onUploadSuccess?: (url: string, file: File) => void;
}

// 文件大小限制：100MB
const MAX_FILE_SIZE = 100 * 1024 * 1024;

// 允许的文件类型
const ALLOWED_FILE_TYPES = [
  'application/pdf',
  'video/mp4',
  'application/zip',
  'application/x-rar-compressed',
  'application/vnd.rar',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // docx
];

export function FileUploadDialog({
  open,
  onOpenChange,
  courseId,
  categoryId,
  onUploadSuccess,
}: FileUploadDialogProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { upload, isUploading, progress } = useFileUpload();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    // 文件大小验证
    if (file.size > MAX_FILE_SIZE) {
      toast.error(`文件大小不能超过 ${formatFileSize(MAX_FILE_SIZE)}`);
      return;
    }

    // 文件类型验证
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      toast.error('不支持的文件类型。仅支持 PDF、MP4、ZIP、RAR、DOCX');
      return;
    }

    setSelectedFile(file);
  };

  const handleUpload = () => {
    if (!selectedFile) return;

    // 生成存储路径：category/course/filename
    const storagePath = `${categoryId}/${courseId}/${selectedFile.name}`;

    upload(
      { file: selectedFile, storagePath },
      {
        onSuccess: (data) => {
          onUploadSuccess?.(data.url, data.file);
          onOpenChange(false);
          setSelectedFile(null);
        },
      }
    );
  };

  const handleClose = () => {
    if (!isUploading) {
      onOpenChange(false);
      setSelectedFile(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl">上传文件</DialogTitle>
          <DialogDescription>
            选择要上传的学习资料文件（最大 100MB）
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* 文件选择 */}
          <div className="space-y-2">
            <Label htmlFor="file-upload">选择文件</Label>
            <div className="flex items-center gap-2">
              <Input
                id="file-upload"
                type="file"
                onChange={handleFileSelect}
                disabled={isUploading}
                className="flex-1"
                accept=".pdf,.mp4,.zip,.rar,.docx"
              />
              <Button variant="outline" size="icon" asChild disabled={isUploading}>
                <label htmlFor="file-upload" className="cursor-pointer">
                  <Upload className="w-4 h-4" />
                </label>
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              支持的格式：PDF、MP4、ZIP、RAR、DOCX
            </p>
          </div>

          {/* 文件信息预览 */}
          {selectedFile && (
            <div className="border rounded-lg p-4 space-y-2">
              <div className="flex items-center gap-3">
                <FileText className="w-8 h-8 text-muted-foreground" />
                <div className="flex-1">
                  <p className="font-medium text-sm">{selectedFile.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatFileSize(selectedFile.size)} • {selectedFile.type || '未知类型'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* 上传进度 */}
          {isUploading && progress && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">上传中...</span>
                <span className="font-mono">{progress.percentage}%</span>
              </div>
              <Progress value={progress.percentage} />
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isUploading}>
            取消
          </Button>
          <Button onClick={handleUpload} disabled={!selectedFile || isUploading}>
            {isUploading ? '上传中...' : '上传'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
