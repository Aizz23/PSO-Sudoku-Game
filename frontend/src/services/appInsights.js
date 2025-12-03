import { ApplicationInsights } from '@microsoft/applicationinsights-web';
import { ReactPlugin } from '@microsoft/applicationinsights-react-js';

const reactPlugin = new ReactPlugin();

const appInsights = new ApplicationInsights({
  config: {
    // eslint-disable-next-line no-undef
    connectionString: process.env.REACT_APP_APPINSIGHTS_CONNECTION_STRING,
    extensions: [reactPlugin],
    enableAutoRouteTracking: true,
    enableRequestHeaderTracking: true,
    enableResponseHeaderTracking: true,
    enableCorsCorrelation: true,
    enableUnhandledPromiseRejectionTracking: true,
    disableFetchTracking: false,
    disableAjaxTracking: false,
    autoTrackPageVisitTime: true,
  },
});

// eslint-disable-next-line no-undef
if (process.env.REACT_APP_APPINSIGHTS_CONNECTION_STRING) {
  appInsights.loadAppInsights();
  console.log('✅ Application Insights initialized for React');
} else {
  console.warn('⚠️  React App Insights connection string not found');
}

// Export for custom tracking
export const trackEvent = (name, properties) => {
  appInsights.trackEvent({ name }, properties);
};

export const trackException = (error, properties) => {
  appInsights.trackException({ exception: error, properties });
};

export { appInsights, reactPlugin };
