import './global-styles.css';

import { RouterProvider, createBrowserRouter } from 'react-router-dom';

import { PostsPage } from '../pages/posts-page/posts-page.tsx';
import { Provider } from 'react-redux';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { store } from './store.ts';

const router = createBrowserRouter([
    {
        path: '/',
        element: <PostsPage />,
    },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <Provider store={store}>
            <RouterProvider router={router} />
        </Provider>
    </React.StrictMode>
);
