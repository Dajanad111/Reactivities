import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './app/layout/styles.css'
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import 'react-toastify/dist/ReactToastify.css';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { RouterProvider } from 'react-router';
import { router } from './app/router/Routes.tsx';
import { store, StoreContext } from './lib/stores/store.ts';
import { ToastContainer } from 'react-toastify';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render( // Kreira React root i renderuje aplikaciju u HTML element sa id="root"
  <StrictMode>  {/* React mod za otkrivanje potencijalnih bugova u development-u */}
    <StoreContext.Provider value={store}>
      <QueryClientProvider client={queryClient}>   {/* Omogućava React Query funkcionalnost u celoj aplikaciji */}
        <ReactQueryDevtools />   {/* Developer alat za debugovanje React Query (cache, queries, mutations) */}
           <ToastContainer position='bottom-right' hideProgressBar theme='colored' />
        <RouterProvider router={router} />  {/* Pokreće React Router i omogućava navigaciju između stranica , router pokazuje na app*/}
      </QueryClientProvider>
    </StoreContext.Provider>


  </StrictMode>,
)
