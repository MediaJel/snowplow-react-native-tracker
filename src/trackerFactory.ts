import { RNSnowplowTracker } from './native';

export function createTrackerInstance(namespace: string) {
  return RNSnowplowTracker.createTracker(namespace);
}
