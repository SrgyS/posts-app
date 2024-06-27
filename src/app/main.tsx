import './global-styles.css';

import { PostsList } from '../modules/posts/posts-list.tsx';
import { Provider } from 'react-redux';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { store } from './store.ts';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <Provider store={store}>
            <PostsList />
        </Provider>
    </React.StrictMode>
);
