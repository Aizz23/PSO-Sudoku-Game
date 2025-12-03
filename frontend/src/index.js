import ReactDOM from 'react-dom/client';
import { AppInsightsContext } from '@microsoft/applicationinsights-react-js';
import { reactPlugin } from './services/appInsights';
import App from './App';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <AppInsightsContext.Provider value={reactPlugin}>
    <App />
  </AppInsightsContext.Provider>
);
