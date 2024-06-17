# @mediajel/react-native-tracker

The Mediajel React Native Tracker is a React Native wrapper around the Snowplow React Native Tracker. It provides a simple way to track events in your React Native app and send them to our Snowplow collector.

## Quick start

From the root of your [React Native][react-native] project:

```sh
npm install --save @mediajel/react-native-tracker
npx pod-install
```

In your `ios/Podfile` file (unless using Expo Go), please add the `FMDB` dependency with `modular_headers` set to `true`. This is necessary to make the `FMDB` package generate module maps so that it can be used by the tracker:

```rb
pod 'FMDB', :modular_headers => true
```


Then, instrument the tracker in your app and start tracking events. For example:

```javascript
import { createMediajelTracker } from '@mediajel/react-native-tracker';

 // Replace with your App ID
const tracker = createMediajelTracker('AppIdHere');
```

Replace with your GAID or IDFA of the user
This is necessary for us to report on attributed transactions
We recommend this [library](https://www.npmjs.com/package/@sparkfabrik/react-native-idfa-aaid)  if you don't already have a way of capturing the user's GAID or IDFA

```javascript
tracker.setUserId("GAID-or-IDFA-Here"); 
```

Example with the `react-native-idfa-aaid` library

```javascript
import { createMediajelTracker } from '@mediajel/react-native-tracker';
import ReactNativeIdfaAaid, { AdvertisingInfoResponse } from '@sparkfabrik/react-native-idfa-aaid';

const MyComponent: React.FC = () => {
  const [idfa, setIdfa] = useState<string | null>();
  const tracker = createMediajelTracker('AppIdHere');

  useEffect(() => {
    ReactNativeIdfaAaid.getAdvertisingInfo()
      .then((res: AdvertisingInfoResponse) => !res.isAdTrackingLimited && tracker.setUserId(res.id))
  }, []);
}
```

Tracking a transaction event
```javascript
  tracker.trackEcommerceTransactionEvent({
    orderId: '1234',
    totalValue: 15,
    affiliation: 'Womens Apparel',
    taxValue: 1.5,
    shipping: 2.99,
    city: 'San Jose',
    state: 'California',
    country: 'USA',
    currency: 'USD',
    items: [
      {
        sku: 'DD44',
        name: 'T-Shirt',
        category: 'Green Medium',
        price: 15,
        quantity: 1,
        currency: 'USD',
      },
    ],
  });

```

The Snowplow React Native Tracker also provides first-class support for TypeScript, as it is fully typed.

See also our [DemoApp](example) for an example implementation.


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

