# @mediajel/react-native-tracker

The Mediajel React Native Tracker is a React Native wrapper around the Snowplow React Native Tracker. It provides a simple way to track events in your React Native app and send them to our Snowplow collector.

## Quick start

From the root of your [React Native][react-native] project:

```sh
npm install --save @snowplow/react-native-tracker
npx pod-install
```

In your `ios/Podfile` file (unless using Expo Go), please add the `FMDB` dependency with `modular_headers` set to `true`. This is necessary to make the `FMDB` package generate module maps so that it can be used by the tracker:

```rb
pod 'FMDB', :modular_headers => true
```


### iOS configuration

For `native` apps, in `info.plist` make sure to add:

```xml
<key>NSUserTrackingUsageDescription</key>
<string>...</string>
```

For `Expo` apps, in `app.json` make sure to add:

```json
{
  "expo": {
    "plugins": [
      [
        "expo-tracking-transparency",
        {
          "userTrackingPermission": "..."
        }
      ]
    ]
  }
}
```


Then, instrument the tracker in your app and start tracking events. For example:

```javascript
import { createMediajelTracker } from '@mediajel/react-native-tracker';

const tracker = createMediajelTracker('AppIdHere'); // Replace with your App ID

tracker.trackScreenViewEvent({ name: 'myScreenName' });
```

The Snowplow React Native Tracker also provides first-class support for TypeScript, as it is fully typed.

See also our [DemoApp](example) for an example implementation.

## Find out more

| Technical Docs                    | Setup Guide                 |
|-----------------------------------|-----------------------------|
| [![i1][techdocs-image]][techdocs] | [![i2][setup-image]][setup] |
| [Technical Docs][techdocs]        | [Setup Guide][setup]        |

## Maintainer quick start

Assuming a [react-native environment][react-native-environment] is set up, from the root of the repository:

```bash
yarn
```

### Unit tests

To run the unit tests, simply execute:

```sh
yarn test
```

### Launching the example app

Replace "placeholder" with the URI for your Snowplow Mini or other Snowplow collector in `DemoApp/App.js`.

**For Android:**

```bash
yarn example android
```
_Note_: Linux users who want to run the DemoApp for Android, would also need to run `yarn start` in a separate terminal.

**For iOS:**

```bash
yarn example ios
```

### End-to-end tests

Snowplow React-Native Tracker is being end-to-end tested using [Snowplow Micro][snowplow-micro] and [Detox][detox]. To run these tests locally:

#### Testing

1. Start your [Snowplow Micro][snowplow-micro] instance locally.
2. Replace the `placeholder` value for the `collectorEndpoint` variable in `example/src/App.js` (use the network IP address of your computer or ngrok).
3. Start the end-to-end tests:
   * On Android, run `yarn e2e:android`
   * On iOS, run `yarn e2e:ios`

