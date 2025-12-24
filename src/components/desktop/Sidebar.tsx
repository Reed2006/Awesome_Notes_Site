import { useState } from 'react';
import { ChevronDown, Menu, X, BookOpen } from 'lucide-react';
import { categories, Category, Course } from '@/lib/courseData';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface SidebarProps {
  selectedCourse: string | null;
  onSelectCourse: (courseId: string) => void;
}

interface CategorySectionProps {
  category: Category;
  selectedCourse: string | null;
  onSelectCourse: (courseId: string) => void;
  isExpanded: boolean;
  onToggle: () => void;
}

function CategorySection({ 
  category, 
  selectedCourse, 
  onSelectCourse, 
  isExpanded, 
  onToggle 
}: CategorySectionProps) {
  return (
    <div className="border-b border-border">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-6 py-4 hover:bg-secondary/50 transition-colors"
      >
        <div className="flex items-center gap-4">
          <span className="text-xs text-muted-foreground font-mono">{category.code}</span>
          <span className="text-sm font-mono uppercase tracking-wider">{category.title}</span>
        </div>
        <ChevronDown 
          className={cn(
            "w-4 h-4 text-muted-foreground transition-transform duration-200",
            isExpanded && "rotate-180"
          )} 
        />
      </button>
      
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            {category.courses.map((course, index) => (
              <CourseItem
                key={course.id}
                course={course}
                index={index}
                isSelected={selectedCourse === course.id}
                onSelect={() => onSelectCourse(course.id)}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface CourseItemProps {
  course: Course;
  index: number;
  isSelected: boolean;
  onSelect: () => void;
}

function CourseItem({ course, index, isSelected, onSelect }: CourseItemProps) {
  return (
    <button
      onClick={onSelect}
      className={cn(
        "w-full text-left px-6 py-3 pl-16 border-l-2 transition-all duration-200",
        "hover:bg-secondary/50",
        isSelected 
          ? "border-l-accent bg-secondary/30 text-foreground" 
          : "border-l-transparent text-muted-foreground"
      )}
    >
      <div className="flex items-center gap-3">
        <span className="text-xs font-mono opacity-50">
          {(index + 1).toString().padStart(2, '0')}
        </span>
        <span className="text-sm">{course.titleZh}</span>
      </div>
    </button>
  );
}

export function Sidebar({ selectedCourse, onSelectCourse }: SidebarProps) {
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['econ', 'ai', 'project']);

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => 
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  return (
    <aside className="hidden lg:flex flex-col w-80 border-r border-border bg-card h-screen sticky top-0">
      {/* Logo */}
      <div className="px-6 py-6 border-b border-border">
        <div className="flex items-center gap-3">
          <BookOpen className="w-5 h-5 text-primary" />
          <span className="font-mono text-sm uppercase tracking-widest">Knowledge Base</span>
        </div>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto">
        {categories.map(category => (
          <CategorySection
            key={category.id}
            category={category}
            selectedCourse={selectedCourse}
            onSelectCourse={onSelectCourse}
            isExpanded={expandedCategories.includes(category.id)}
            onToggle={() => toggleCategory(category.id)}
          />
        ))}
      </nav>
      
      {/* Footer */}
      <div className="px-6 py-4 border-t border-border">
        <p className="text-xs text-muted-foreground font-mono">
          CURATED RESOURCES
        </p>
      </div>
    </aside>
  );
}

// Mobile Sidebar
interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCourse: string | null;
  onSelectCourse: (courseId: string) => void;
}

export function MobileSidebar({ isOpen, onClose, selectedCourse, onSelectCourse }: MobileSidebarProps) {
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['econ', 'ai', 'project']);

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => 
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleSelectCourse = (courseId: string) => {
    onSelectCourse(courseId);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-40 lg:hidden"
          />
          
          {/* Drawer */}
          <motion.aside
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 left-0 w-80 max-w-[85vw] bg-primary text-primary-foreground z-50 lg:hidden flex flex-col"
          >
            {/* Header */}
            <div className="px-6 py-6 border-b border-primary-foreground/20 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <BookOpen className="w-5 h-5" />
                <span className="font-mono text-sm uppercase tracking-widest">Knowledge Base</span>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-primary-foreground/10 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto">
              {categories.map(category => (
                <div key={category.id} className="border-b border-primary-foreground/10">
                  <button
                    onClick={() => toggleCategory(category.id)}
                    className="w-full flex items-center justify-between px-6 py-4 hover:bg-primary-foreground/5 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-xs opacity-60 font-mono">{category.code}</span>
                      <span className="text-sm font-mono uppercase tracking-wider">{category.title}</span>
                    </div>
                    <ChevronDown 
                      className={cn(
                        "w-4 h-4 opacity-60 transition-transform duration-200",
                        expandedCategories.includes(category.id) && "rotate-180"
                      )} 
                    />
                  </button>
                  
                  <AnimatePresence>
                    {expandedCategories.includes(category.id) && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        {category.courses.map((course, index) => (
                          <button
                            key={course.id}
                            onClick={() => handleSelectCourse(course.id)}
                            className={cn(
                              "w-full text-left px-6 py-3 pl-16 border-l-2 transition-all duration-200",
                              "hover:bg-primary-foreground/5",
                              selectedCourse === course.id 
                                ? "border-l-accent bg-primary-foreground/10" 
                                : "border-l-transparent opacity-80"
                            )}
                          >
                            <div className="flex items-center gap-3">
                              <span className="text-xs font-mono opacity-50">
                                {(index + 1).toString().padStart(2, '0')}
                              </span>
                              <span className="text-sm">{course.titleZh}</span>
                            </div>
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </nav>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

// Mobile Header
interface MobileHeaderProps {
  onMenuClick: () => void;
}

export function MobileHeader({ onMenuClick }: MobileHeaderProps) {
  return (
    <header className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-card border-b border-border z-30 flex items-center px-4">
      <button 
        onClick={onMenuClick}
        className="p-2 hover:bg-secondary rounded transition-colors"
      >
        <Menu className="w-5 h-5" />
      </button>
      <div className="flex items-center gap-3 ml-3">
        <BookOpen className="w-5 h-5 text-primary" />
        <span className="font-mono text-sm uppercase tracking-widest">Knowledge Base</span>
      </div>
    </header>
  );
}
