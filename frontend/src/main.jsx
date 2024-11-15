import './index.css';
import App from './App.jsx'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import store from "./store/store.js"
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import ChatPage from './components/Chats/ChatPage.jsx';
import Register from './components/Authentication/Register.jsx';
import Login from './components/Authentication/Login.jsx';
import ChatBody from './components/Chats/ChatBody.jsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <ChatPage /> // ChatPage loads at root path
      },
      {
        path: "/chat/:chatId",
        element: <ChatPage /> // ChatPage also loads for specific chat paths
      },
      {
        path: "/register",
        element: <Register />
      },
      {
        path: "/login",
        element: <Login />
      },
    ]
  }
]);


createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>,
)
