/* eslint-disable @typescript-eslint/no-unused-vars */

'use strict';

import ReactNativeIdfaAaid from '@sparkfabrik/react-native-idfa-aaid';

import * as api from './api';
import { errorHandler, safeWait, safeWaitCallback } from './utils';

import type { AdvertisingInfoResponse } from '@sparkfabrik/react-native-idfa-aaid';

// import { getWebViewCallback } from './webViewInterface';

import type {
  NetworkConfiguration,
  TrackerControllerConfiguration,
  ReactNativeTracker,
} from './types';
/**
 * Creates a React Native Tracker object
 *
 * @param namespace {string} - The tracker namespace
 * @param networkConfig {Object} - The network configuration
 * @param control {Array} - The tracker controller configuration
 * @returns The tracker object
 */
function createTracker(
  namespace: string,
  networkConfig: NetworkConfiguration,
  controllerConfig: TrackerControllerConfiguration = {}
): ReactNativeTracker {
  // initTrackerPromise
  const initTrackerPromise: Promise<void> = Promise.resolve(
    api.createTracker({
      namespace,
      networkConfig,
      ...controllerConfig,
    })
  );

  // mkMethod creates methods subscribed to the initTrackerPromise
  const mkMethod = safeWait(initTrackerPromise, errorHandler);

  // mkCallback creates callbacks subscribed to the initTrackerPromise
  const mkCallback = safeWaitCallback(initTrackerPromise, errorHandler);

  // track methods
  const trackSelfDescribingEvent = mkMethod(
    api.trackSelfDescribingEvent(namespace)
  );
  const trackScreenViewEvent = mkMethod(api.trackScreenViewEvent(namespace));
  const trackScrollChangedEvent = mkMethod(
    api.trackScrollChangedEvent(namespace)
  );
  const trackListItemViewEvent = mkMethod(
    api.trackListItemViewEvent(namespace)
  );
  const trackStructuredEvent = mkMethod(api.trackStructuredEvent(namespace));
  const trackPageViewEvent = mkMethod(api.trackPageViewEvent(namespace));
  const trackTimingEvent = mkMethod(api.trackTimingEvent(namespace));
  const trackConsentGrantedEvent = mkMethod(
    api.trackConsentGrantedEvent(namespace)
  );
  const trackConsentWithdrawnEvent = mkMethod(
    api.trackConsentWithdrawnEvent(namespace)
  );
  const trackEcommerceTransactionEvent = mkMethod(
    api.trackEcommerceTransactionEvent(namespace)
  );
  const trackDeepLinkReceivedEvent = mkMethod(
    api.trackDeepLinkReceivedEvent(namespace)
  );
  const trackMessageNotificationEvent = mkMethod(
    api.trackMessageNotificationEvent(namespace)
  );
  // Global Contexts
  const removeGlobalContexts = mkMethod(api.removeGlobalContexts(namespace));
  const addGlobalContexts = mkMethod(api.addGlobalContexts(namespace));
  // setters
  const setUserId = mkMethod(api.setUserId(namespace));
  const setNetworkUserId = mkMethod(api.setNetworkUserId(namespace));
  const setDomainUserId = mkMethod(api.setDomainUserId(namespace));
  const setIpAddress = mkMethod(api.setIpAddress(namespace));
  const setUseragent = mkMethod(api.setUseragent(namespace));
  const setTimezone = mkMethod(api.setTimezone(namespace));
  const setLanguage = mkMethod(api.setLanguage(namespace));
  const setScreenResolution = mkMethod(api.setScreenResolution(namespace));
  const setScreenViewport = mkMethod(api.setScreenViewport(namespace));
  const setColorDepth = mkMethod(api.setColorDepth(namespace));
  const setSubjectData = mkMethod(api.setSubjectData(namespace));

  // callbacks
  const getSessionUserId = mkCallback(api.getSessionUserId(namespace));
  const getSessionId = mkCallback(api.getSessionId(namespace));
  const getSessionIndex = mkCallback(api.getSessionIndex(namespace));
  const getIsInBackground = mkCallback(api.getIsInBackground(namespace));
  const getBackgroundIndex = mkCallback(api.getBackgroundIndex(namespace));
  const getForegroundIndex = mkCallback(api.getForegroundIndex(namespace));

  return Object.freeze({
    trackSelfDescribingEvent,
    trackScreenViewEvent,
    trackScrollChangedEvent,
    trackListItemViewEvent,
    trackStructuredEvent,
    trackPageViewEvent,
    trackTimingEvent,
    trackConsentGrantedEvent,
    trackConsentWithdrawnEvent,
    trackEcommerceTransactionEvent,
    trackDeepLinkReceivedEvent,
    trackMessageNotificationEvent,
    removeGlobalContexts,
    addGlobalContexts,
    setUserId,
    setNetworkUserId,
    setDomainUserId,
    setIpAddress,
    setUseragent,
    setTimezone,
    setLanguage,
    setScreenResolution,
    setScreenViewport,
    setColorDepth,
    setSubjectData,
    getSessionUserId,
    getSessionId,
    getSessionIndex,
    getIsInBackground,
    getBackgroundIndex,
    getForegroundIndex,
  });
}

/**
 * Creates a Mediajel React Native Tracker object
 *
 * @param appId {string} - The unique app ID
 * @returns The tracker object
 */

async function createMediajelTracker(
  appId: string
): Promise<ReactNativeTracker> {
  const tracker = createTracker(
    'react-native',
    {
      endpoint: 'https://collector.dmp.cnna.io',
      method: 'post',
    },
    {
      trackerConfig: {
        appId,
        base64Encoding: false,
        devicePlatform: 'mob',
        screenViewAutotracking: true,
        installAutotracking: true,
      },
    }
  );

  await ReactNativeIdfaAaid.getAdvertisingInfo().then(
    (res: AdvertisingInfoResponse) => {
      if (res.isAdTrackingLimited) {
        console.log(`Found ID: ${res.id}`);
        return tracker.setUserId(res.id);
      }

      console.log('No ID available');
      return;
    }
  );

  return tracker;
}

export { createMediajelTracker };

export type {
  ReactNativeTracker,
  TrackerControllerConfiguration,
  NetworkConfiguration,
  TrackerConfiguration,
  SessionConfiguration,
  EmitterConfiguration,
  SubjectConfiguration,
  GdprConfiguration,
  GCConfiguration,
  SelfDescribing,
  EventContext,
  ScreenViewProps,
  StructuredProps,
  PageViewProps,
  TimingProps,
  ConsentGrantedProps,
  ConsentWithdrawnProps,
  EcommerceTransactionProps,
  DeepLinkReceivedProps,
  MessageNotificationProps,
  EcommerceItem,
  ConsentDocument,
  GlobalContext,
  HttpMethod,
  DevicePlatform,
  LogLevel,
  Basis,
  BufferOption,
  ScreenSize,
  Trigger,
} from './types';
