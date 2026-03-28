import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import AppRoutes from './routes/AppRoutes';
import FloatingChatbot from './components/ui/FloatingChatbot';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster position="top-right" />
        <AppRoutes />
        <FloatingChatbot />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
