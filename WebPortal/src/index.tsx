import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import {Providers} from "./Providers";

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
    <Providers></Providers>
);