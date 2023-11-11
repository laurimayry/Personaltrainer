import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
//import Personaltrainer from './components/personaltrainer.jsx';
import './index.css';
import App from './App.jsx';
import Customers from './components/Customers.jsx';
import Practises from './components/Practises.jsx';
//import Customers from './components/Customers.jsx';


const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/customers",
        element: <Customers />,
      },
      {
        path: "/practises",
        element: <Practises />,
      },
    ]   
  }
]);
 

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
