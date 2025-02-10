import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { AppStore } from './store/AppStore.ts';
import { StoreProvider } from './context/StoreContext.ts';
import { setupStoreReactions } from './service/AppService.ts';

import App from './App.tsx';
import './assets/styles/index.css';

const store = new AppStore();
setupStoreReactions(store);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <StoreProvider value={store}>
      <App />
    </StoreProvider>
  </StrictMode>,
);
