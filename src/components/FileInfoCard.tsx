import { Card, CardContent } from '@/components/ui/card';
import { FileText, Calendar, HardDrive } from 'lucide-react';
import { formatFileSize, getExtensionFromMimeType } from '@/lib/file-utils';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';

interface FileInfoCardProps {
  fileSize?: number;
  mimeType?: string;
  uploadedAt?: string;
}

export function FileInfoCard({ fileSize, mimeType, uploadedAt }: FileInfoCardProps) {
  // 如果没有任何文件信息，不显示卡片
  if (!fileSize && !mimeType && !uploadedAt) {
    return null;
  }

  return (
    <Card className="mt-2">
      <CardContent className="p-3 space-y-1.5">
        {fileSize && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <HardDrive className="w-3.5 h-3.5" />
            <span>大小: {formatFileSize(fileSize)}</span>
          </div>
        )}
        {mimeType && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <FileText className="w-3.5 h-3.5" />
            <span>
              类型: {getExtensionFromMimeType(mimeType) ?? mimeType}
            </span>
          </div>
        )}
        {uploadedAt && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Calendar className="w-3.5 h-3.5" />
            <span>
              上传于: {format(new Date(uploadedAt), 'PPP', { locale: zhCN })}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
