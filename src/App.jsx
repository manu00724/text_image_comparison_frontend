import { useCallback, useEffect, useState } from 'react';
import { EditorPage } from './pages/EditorPage';
import { HomePage } from './pages/HomePage';

export default function App() {
  const [location, setLocation] = useState(() => ({ path: window.location.pathname, state: window.history.state }));

  useEffect(() => {
    const handlePopState = (event) => setLocation({ path: window.location.pathname, state: event.state });
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = useCallback((path, state = null) => {
    window.history.pushState(state, '', path);
    setLocation({ path, state });
  }, []);

  if (location.path === '/editor') return <EditorPage initialReview={location.state?.review} onBack={() => navigate('/')} />;
  return <HomePage onReviewReady={(review) => navigate('/editor', { review })} />;
}
