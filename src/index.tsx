import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './Pages/App/App';
import './reset.scss';

const rootElement = document.getElementById('root') as HTMLElement;
ReactDOM.createRoot(rootElement).render(
	<React.StrictMode>
		<App />
	</React.StrictMode>
);
