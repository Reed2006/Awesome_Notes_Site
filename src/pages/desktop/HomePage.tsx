import { useState } from 'react';
import { Sidebar, MobileSidebar, MobileHeader } from '@/components/desktop/Sidebar';
import { ContentArea } from '@/components/desktop/ContentArea';
import { findCourseById } from '@/lib/courseData';

export default function HomePage() {
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const selectedCourse = selectedCourseId ? findCourseById(selectedCourseId) : null;

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header */}
      <MobileHeader onMenuClick={() => setIsMobileMenuOpen(true)} />
      
      {/* Mobile Sidebar */}
      <MobileSidebar
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        selectedCourse={selectedCourseId}
        onSelectCourse={setSelectedCourseId}
      />
      
      {/* Main Layout */}
      <div className="flex">
        {/* Desktop Sidebar */}
        <Sidebar 
          selectedCourse={selectedCourseId}
          onSelectCourse={setSelectedCourseId}
        />
        
        {/* Content Area */}
        <main className="flex-1 lg:ml-0 pt-16 lg:pt-0">
          <ContentArea 
            course={selectedCourse ?? null}
            onSelectCourse={setSelectedCourseId}
          />
        </main>
      </div>
    </div>
  );
}
