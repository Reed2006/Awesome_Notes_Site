import { motion } from 'framer-motion';
import { Download, FileText, Code, Video, Link as LinkIcon, ArrowRight } from 'lucide-react';
import { Course, Resource, categories } from '@/lib/courseData';
import { getExtensionFromMimeType, getExtensionFromFilename } from '@/lib/file-utils';
import { cn } from '@/lib/utils';
import { useFileDownload } from '@/hooks/useFileDownload';
import { FileInfoCard } from '@/components/FileInfoCard';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { MusicPlayer } from '@/components/desktop/MusicPlayer';

interface ContentAreaProps {
  course: Course | null;
  onSelectCourse: (courseId: string) => void;
}

function ResourceTypeIcon({ type }: { type: Resource['type'] }) {
  const iconProps = { className: "w-4 h-4" };
  switch (type) {
    case 'PDF': return <FileText {...iconProps} />;
    case 'CODE': return <Code {...iconProps} />;
    case 'VIDEO': return <Video {...iconProps} />;
    case 'LINK': return <LinkIcon {...iconProps} />;
    default: return <FileText {...iconProps} />;
  }
}

interface ResourceCardProps {
  resource: Resource;
  index: number;
}

function ResourceCard({ resource, index }: ResourceCardProps) {
  const { download, isDownloading, progress } = useFileDownload();
  const displayType = getResourceDisplayType(resource);

  const handleDownload = () => {
    if (!resource.downloadUrl) {
      toast.error('该资源暂无下载链接');
      return;
    }

    const filename = resource.downloadFilename ?? `${resource.title}.${getFileExtension(resource.type)}`;

    download({
      url: resource.downloadUrl,
      filename,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 + index * 0.05 }}
      className={cn(
        "group border border-border p-6 flex flex-col justify-between",
        "aspect-square transition-all duration-300",
        "hover:bg-card hover:border-primary"
      )}
    >
      {/* Top: Type tag */}
      <div className="flex items-center gap-2 text-muted-foreground">
        <ResourceTypeIcon type={resource.type} />
        <span className="text-xs font-mono tracking-wide">{displayType}</span>
      </div>

      {/* Middle: Title & Description */}
      <div className="flex-1 flex flex-col justify-center py-4">
        <h4 className="font-serif text-lg leading-snug mb-2">{resource.title}</h4>
        {resource.description && (
          <p className="text-sm text-muted-foreground">{resource.description}</p>
        )}

        {/* 文件信息卡片 */}
        <FileInfoCard
          fileSize={resource.fileSize}
          mimeType={resource.mimeType}
          uploadedAt={resource.uploadedAt}
        />
      </div>

      {/* Bottom: Download button with progress */}
      <div className="space-y-2">
        {isDownloading && progress && (
          <div className="space-y-1">
            <Progress value={progress.percentage} className="h-1" />
            <p className="text-xs text-center text-muted-foreground font-mono">
              {progress.percentage}%
            </p>
          </div>
        )}

        <div className="flex justify-end">
          <button
            onClick={handleDownload}
            disabled={isDownloading || !resource.downloadUrl}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-full text-sm",
              "bg-accent text-accent-foreground",
              "transition-all duration-200",
              "group-hover:px-6",
              "disabled:opacity-50 disabled:cursor-not-allowed"
            )}
          >
            <Download className="w-4 h-4" />
            <span className="hidden group-hover:inline">
              {isDownloading ? '下载中...' : resource.downloadUrl ? '下载' : '暂无文件'}
            </span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// 辅助函数：根据资源类型获取文件扩展名
function getFileExtension(type: Resource['type']): string {
  switch (type) {
    case 'PDF':
      return 'pdf';
    case 'VIDEO':
      return 'mp4';
    case 'CODE':
      return 'zip';
    case 'LINK':
      return 'html';
    default:
      return 'file';
  }
}

// 获取资源展示用的类型标签，优先使用 MIME 和文件扩展名来避免显示异常
function getResourceDisplayType(resource: Resource): string {
  const mimeLabel = getExtensionFromMimeType(resource.mimeType);
  if (mimeLabel) {
    return mimeLabel;
  }

  const filename =
    resource.downloadFilename ??
    (resource.downloadUrl ? extractFilenameFromUrl(resource.downloadUrl) : null);

  const fileLabel = getExtensionFromFilename(filename);
  if (fileLabel) {
    return fileLabel;
  }

  const defaultMap: Record<Resource['type'], string> = {
    PDF: 'pdf',
    VIDEO: 'mp4',
    CODE: 'zip',
    LINK: 'link',
  };

  return defaultMap[resource.type] ?? 'file';
}

function extractFilenameFromUrl(url: string): string | null {
  try {
    const pathname = new URL(url).pathname;
    const segment = pathname.split('/').pop();
    return segment ? decodeURIComponent(segment) : null;
  } catch {
    return null;
  }
}

function WelcomeContent({ onSelectCourse }: { onSelectCourse: (courseId: string) => void }) {
  const featuredTrack = {
    title: '俏郎君',
    artist: '张敬轩',
    src: 'https://afyuxngkeyapjrncfxsz.supabase.co/storage/v1/object/public/music/M500000Sehxx0DRoQl.mp3',
    cover: 'https://afyuxngkeyapjrncfxsz.supabase.co/storage/v1/object/public/music/photo.jpeg',
    description:
      '这是本人最喜欢的歌词，俏郎君是电影“往日情怀”的翻译，讲述的是一对情侣因为政治意见不合、家庭境况不合被迫分开。'
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen flex flex-col"
    >
      {/* Hero Section */}
      <div className="flex-1 flex flex-col justify-center px-8 lg:px-16 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="max-w-3xl"
        >
          <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-4">
            PREFACE
          </p>
          <h1 className="font-serif text-4xl lg:text-5xl font-light italic leading-tight mb-6">
            前言
          </h1>
          <div className="space-y-4 text-base lg:text-lg text-muted-foreground leading-relaxed">
            <p>
              我一直在想，有了AI之后，濒临崩溃的本科教育（语出上海交大生存手册）会往何处去？至少在已经过了一年的大二的我来看，人们不应该在所谓的考试里纠缠过久，当然，我承认复习在知识体系建构过程中的重要作用，这也是为什么我非常支持保留闭卷考试的形式。但是，我认为复习的前提应当是，基于对一个学期十六周所学知识的提炼与框架性梳理，并试图寻找到一条脉络。AI让人们有一种虚假的自信——课上没弄懂的，课下问AI，好像看懂了，好像没看懂。AI以低成本帮助构建了知识体系，尽管人们根本不知道这种知识体系牢固与否？真实与否？这种症候被称为“认知债务”。基于这一判断，我越来越觉得，在本科一二年级，人们不应该过早接触那些业界的、学界的、范式化的东西（尽管我说这话没什么说服力，也没什么作用），更应该沉下心上一门好课，培养自己的taste，或者就纯粹感受那些美，上到一门好课的欣喜在本科一二年级的边际效用是最大的。
            </p>
            <p>
              我上过很多课，计算机的、经济学的、数学的，每门课我基本不会缺席，第一是出于我从小受的“尊重老师劳动”的教育，第二是我始终怀念“old school”的面对面授课模式。坦白说，有的老师是很出色的学者，他们对逻辑的把握非常到位，但未必是一个好的授课者；有的老师是一个好的授课者，但是因为各种原因，可能学术上造诣并不高。我们要善于选择“倾听”“自学”“扩展”的不同模式，每次到第十六周结课，我都很感慨，原来我们学了这么多，尽管不是全部都掌握，但是确实学到了很多——未必是这门课，我想在并不繁忙的本科一二年级，能听到一些观点，我就很知足了。
            </p>
            <p>
              当然，我们承认时代压力下，每个人都不可能回到田园时代，如果可以，我也希望每天可以抽出几个小时，读那些好书、好论文，办workshop，研讨论辩。那么，对于志在业界的同学，只是想快速应付期末考试，我相信一些课程的往年题、我的考前速记notes都可以帮到你；对于只是对这门学科感兴趣的同学，我相信我公开的笔记、课程资料以及我自学课程的所思，也可以帮助到你；对于在科研上有兴趣的同学，我希望我开源的代码框架和数据可以帮到你。
            </p>
            <p>
              衷心祝愿来到过这个网站的人，都能找到自己的“边际最优选择”。
            </p>
            <p className="pt-4 font-mono text-sm text-muted-foreground/80">
              Reed<br />
              2025.12.24 于复旦
            </p>
          </div>
        </motion.div>
      </div>
      
      {/* Quick Access Grid */}
      <div className="border-t border-border">
        <div className="grid grid-cols-1 lg:grid-cols-3">
          {categories.map((category, categoryIndex) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + categoryIndex * 0.1 }}
              className={cn(
                "p-8 lg:p-12 border-b lg:border-b-0",
                categoryIndex < 2 && "lg:border-r border-border"
              )}
            >
              <div className="flex items-center gap-3 mb-6">
                <span className="font-mono text-xs text-muted-foreground">{category.code}</span>
                <span className="font-mono text-sm uppercase tracking-wider">{category.title}</span>
              </div>
              <ul className="space-y-3">
                {category.courses.slice(0, 3).map(course => (
                  <li key={course.id}>
                    <button
                      onClick={() => onSelectCourse(course.id)}
                      className="group flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <ArrowRight className="w-3 h-3 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                      <span className="text-sm">{course.titleZh}</span>
                    </button>
                  </li>
                ))}
                {category.courses.length > 3 && (
                  <li className="text-xs text-muted-foreground font-mono pt-2">
                    +{category.courses.length - 3} more
                  </li>
                )}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Music Player Section */}
      <div className="border-t border-border bg-muted/30">
        <div className="px-8 lg:px-16 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-4 space-y-3"
            >
              <p className="font-mono text-xs tracking-widest text-muted-foreground">今日荐歌</p>
              <h3 className="font-serif text-2xl">学习间隙听一首歌</h3>
              <p className="text-sm text-muted-foreground">
                我终身志愿，为所爱认命，或为所信分开，原无法可兼有。
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.25 }}
              className="lg:col-span-8"
            >
              <MusicPlayer track={featuredTrack} />
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function ContentArea({ course, onSelectCourse }: ContentAreaProps) {
  if (!course) {
    return <WelcomeContent onSelectCourse={onSelectCourse} />;
  }

  return (
    <motion.div
      key={course.id}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen"
    >
      {/* Hero Section */}
      <div className="relative px-8 lg:px-16 py-16 lg:py-24 border-b border-border overflow-hidden">
        {/* Background Course Code */}
        <div className="absolute -right-8 top-1/2 -translate-y-1/2 pointer-events-none select-none">
          <span className="font-serif text-[180px] lg:text-[280px] font-light text-muted/30 leading-none">
            {course.code.split('-')[1] || course.code}
          </span>
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="relative z-10"
        >
          <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-4">
            {course.code}
          </p>
          <h1 className="font-serif text-4xl lg:text-6xl font-light italic mb-4">
            {course.title}
          </h1>
          <p className="font-mono text-sm uppercase tracking-wider text-muted-foreground">
            {course.subtitle}
          </p>
        </motion.div>
      </div>
      
      {/* Course Info Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 border-b border-border">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-3 px-8 lg:px-16 py-8 border-b lg:border-b-0 lg:border-r border-border"
        >
          <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
            COURSE INFO
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25 }}
          className="lg:col-span-9 px-8 lg:px-16 py-8"
        >
          <p className="font-serif text-lg leading-relaxed text-foreground/90 max-w-2xl">
            {course.description}
          </p>
        </motion.div>
      </div>
      
      {/* Resources Section */}
      <div className="px-8 lg:px-16 py-12">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-2">
            RESOURCES
          </p>
          <h2 className="font-serif text-2xl">推荐资料</h2>
        </motion.div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {course.resources.map((resource, index) => (
            <ResourceCard key={resource.id} resource={resource} index={index} />
          ))}
        </div>
      </div>
    </motion.div>
  );
}
