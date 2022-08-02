import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import App2 from './App_video';
import ActionAreaCard from './Card';
import GridView from './GridView';
import SearchTag from './SearchTag';
import SearchSong from './SearchSong';
import { HashResult } from './HashResult';


const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  // <App2 />
  // <GridView />
  // <SearchTag />
  // <SearchSong />
  <HashResult />
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
