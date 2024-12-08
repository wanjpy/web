import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import './utils/i18n'
import Login from './Login.tsx';
import App from './App.tsx'
import { Admin } from './Admin.tsx';
import UserListPage from './userList.tsx';
import CaseResultsPage from './caseResult.tsx';


const router = createBrowserRouter([
  {
    path: "/",
    element: <App />
  },
  {
    path: "/admin",
    element: <Admin />,
    children: [
      {
        path: "user",
        element: <UserListPage />,

      },
    ]
  },
  {
    path: "/caseResult",
    element: <CaseResultsPage />
  },
  {
    path: "/login",
    element: <Login />
  },
], { basename: import.meta.env.BASE_URL });


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)