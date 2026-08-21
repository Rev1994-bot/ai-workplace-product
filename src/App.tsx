import { useState } from 'react';
import { Sidebar, type ViewId } from '@/components/Shell';
import { Dashboard } from '@/views/Dashboard';
import { EmailView } from '@/views/EmailView';
import { MeetingView } from '@/views/MeetingView';
import { PlannerView } from '@/views/PlannerView';
import { ResearchView } from '@/views/ResearchView';
import { ChatView } from '@/views/ChatView';

function App() {
  const [view, setView] = useState<ViewId>('dashboard');

  return (
    <div className="min-h-screen bg-ink-50 flex">
      <Sidebar active={view} onNavigate={setView} />
      <main className="flex-1 min-w-0">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
          {view === 'dashboard' && <Dashboard onNavigate={setView} />}
          {view === 'email' && <EmailView />}
          {view === 'meeting' && <MeetingView />}
          {view === 'planner' && <PlannerView />}
          {view === 'research' && <ResearchView />}
          {view === 'chat' && <ChatView />}
        </div>
      </main>
    </div>
  );
}

export default App;
