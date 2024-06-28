import './global-styles.css';

import { PostsPage } from '../pages/posts-page/posts-page.tsx';
import { Provider } from 'react-redux';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { store } from './store.ts';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <Provider store={store}>
            <PostsPage />
        </Provider>
    </React.StrictMode>
);
