import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { Toaster } from "react-hot-toast";
import store from './redux/store.js';
import { Provider } from "react-redux"
// import {Provider} from "./redux/store.js"
import { PersistGate } from 'redux-persist/integration/react'
import { persistStore } from 'redux-persist';

let persistor = persistStore(store);

// export const BASE_URL="http://localhost:8080"

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <App />
        <Toaster />
      </PersistGate>
    </Provider>
  </React.StrictMode>
);
