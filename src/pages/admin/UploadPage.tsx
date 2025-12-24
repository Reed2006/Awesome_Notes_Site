import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { FileUploadDialog } from '@/components/FileUploadDialog';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Plus, ArrowLeft } from 'lucide-react';
import { categories } from '@/lib/courseData';
import { Link } from 'react-router-dom';

export default function UploadPage() {
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<{
    courseId: string;
    categoryId: string;
  } | null>(null);

  const handleOpenUpload = (categoryId: string, courseId: string) => {
    setSelectedCourse({ categoryId, courseId });
    setUploadDialogOpen(true);
  };

  const handleUploadSuccess = (url: string, file: File) => {
    console.log('文件上传成功:', {
      url,
      filename: file.name,
      size: file.size,
      type: file.type,
    });
    // 提示：在实际项目中，这里应该：
    // 1. 调用 API 更新数据库
    // 2. 或者更新 courseData.ts 文件
    // 3. 刷新页面数据
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex items-center gap-4 mb-4">
            <Link to="/">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <h1 className="font-serif text-3xl">文件管理</h1>
              <p className="text-sm text-muted-foreground">上传和管理课程学习资料</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-8 py-8 space-y-12">
        {categories.map((category) => (
          <div key={category.id} className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs text-muted-foreground">{category.code}</span>
              <h2 className="font-mono text-sm uppercase tracking-wider">
                {category.title}
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {category.courses.map((course) => (
                <Card
                  key={course.id}
                  className="hover:border-primary transition-colors"
                >
                  <CardHeader>
                    <div className="space-y-3">
                      <div>
                        <p className="font-mono text-xs text-muted-foreground mb-1">
                          {course.code}
                        </p>
                        <CardTitle className="text-lg font-serif">
                          {course.titleZh}
                        </CardTitle>
                        <CardDescription className="text-sm mt-1">
                          {course.title}
                        </CardDescription>
                      </div>
                      <div className="pt-2">
                        <p className="text-xs text-muted-foreground mb-2">
                          当前资源数: {course.resources.length}
                        </p>
                        <Button
                          size="sm"
                          className="w-full"
                          onClick={() => handleOpenUpload(category.id, course.id)}
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          上传文件
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* 上传对话框 */}
      {selectedCourse && (
        <FileUploadDialog
          open={uploadDialogOpen}
          onOpenChange={setUploadDialogOpen}
          courseId={selectedCourse.courseId}
          categoryId={selectedCourse.categoryId}
          onUploadSuccess={handleUploadSuccess}
        />
      )}
    </div>
  );
}
