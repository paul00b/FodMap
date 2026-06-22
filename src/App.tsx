import { useState } from 'react';
import { BottomNav, type Tab } from './components/layout/BottomNav';
import { SearchPage } from './pages/SearchPage';
import { PlannerPage } from './pages/PlannerPage';
import { JournalPage } from './pages/JournalPage';
import { ShoppingPage } from './pages/ShoppingPage';

export default function App() {
  const [tab, setTab] = useState<Tab>('search');

  return (
    <>
      {tab === 'search' && <SearchPage />}
      {tab === 'planner' && <PlannerPage onGoToShopping={() => setTab('shopping')} />}
      {tab === 'journal' && <JournalPage />}
      {tab === 'shopping' && <ShoppingPage />}
      <BottomNav active={tab} onChange={setTab} />
    </>
  );
}
