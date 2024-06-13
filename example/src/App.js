/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Button,
  Dimensions,
} from 'react-native';
import { WebView } from 'react-native-webview';

import { Colors, Header } from 'react-native/Libraries/NewAppScreen';

import {createMediajelTracker} from '@snowplow/react-native-tracker';

/**
 * URI of the Snowplow collector (e.g., Micro, Mini, or BDP) to send events to
 */
const collectorEndpoint = 'placeholder';

/**
 * URI of a website to load in the webview component
 */
const webViewEndpoint = '';

const Section = ({ children, title }) => {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}
      >
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}
      >
        {children}
      </Text>
    </View>
  );
};

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const [sessionContext, setSessionContext] = React.useState(null);

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const tracker = createMediajelTracker('test-post');

  // const prod = createTracker(
  //   'sp1',
  //   {
  //     endpoint: 'https://collector.dmp.cnna.io',
  //   },
  //   {
  //     trackerConfig: {
  //       appId: 'MediajelReactNative',
  //       base64Encoding: false, // true if you want to send events to the collector in base64 encoded format
  //       devicePlatform: 'mob', // Should be mob for mobile apps
  //       screenViewAutotracking: true, // for tests predictability
  //       installAutotracking: true,
  //     },
  //   },
  // );

  const onPressTrackSelfDescribingEvent = () => {
    tracker.trackSelfDescribingEvent({
      schema: 'iglu:com.snowplowanalytics.snowplow/link_click/jsonschema/1-0-1',
      data: { targetUrl: 'test.test' },
    });

    // prod.trackSelfDescribingEvent({
    //   schema: 'iglu:com.snowplowanalytics.snowplow/link_click/jsonschema/1-0-1',
    //   data: {targetUrl: 'test.test'},
    // });
  };

  const onPressTrackMJSelfDescribingEvent = () => {
    tracker.trackSelfDescribingEvent({
      schema: 'iglu:com.mediajel.events/record/jsonschema/1-0-2',
      data: {
        appId: 'MediajelReactNative',
        cart: 'example',
        version: 'latest',
      },
    });

    // prod.trackSelfDescribingEvent({
    //   schema: 'iglu:com.mediajel.events/record/jsonschema/1-0-2',
    //   data: {
    //     appId: 'MediajelReactNative',
    //     cart: 'example',
    //     version: 'latest',
    //   },
    // });
  };

  const onPressTrackTransaction = () => {
    tracker.trackEcommerceTransactionEvent({
      orderId: '0000',
      totalValue: 10,
      items: [
        {
          sku: '123',
          price: 5,
          quantity: 2,
        },
      ],
    });

    // prod.trackEcommerceTransactionEvent({
    //   orderId: '0000',
    //   totalValue: 10,
    //   items: [
    //     {
    //       sku: '123',
    //       price: 5,
    //       quantity: 2,
    //     },
    //   ],
    // });
  };

  const onPressLogSessionData = async () => {
    try {
      const sessionUserId = await tracker.getSessionUserId();
      const sessionId = await tracker.getSessionId();
      const sessionIdx = await tracker.getSessionIndex();
      const isInBg = await tracker.getIsInBackground();
      const bgIndex = await tracker.getBackgroundIndex();
      const fgIndex = await tracker.getForegroundIndex();

      const sessionData = {
        userId: sessionUserId,
        sessionId: sessionId,
        sessionIndex: sessionIdx,
        isInBackground: isInBg,
        backgroundIndex: bgIndex,
        foregroundIndex: fgIndex,
      };

      setSessionContext(sessionData);
    } catch (e) {
      console.log(e.message);
    }
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <ScrollView
        testID="scrollView"
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}
      >
        <Header />
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
          }}>
          <Section title="Self-Describing Events">
            <Button
              onPress={onPressTrackSelfDescribingEvent}
              title="Track Self-Describing Events"
              color="#841584"
              accessibilityLabel="testSelfDesc"
            />
          </Section>
          <Section title="MJ Custom Events">
            <Button
              onPress={onPressTrackMJSelfDescribingEvent}
              title="Track MJ schema Events"
              color="#841584"
              accessibilityLabel="testMJSchema"
            />
          </Section>
          <Section title="Transaction Event">
            <Button
              onPress={onPressTrackTransaction}
              title="Track Transaction Events"
              color="#841584"
              accessibilityLabel="testTransaction"
            />
          </Section>
          <Section title="SessionData">
            <Button
              onPress={onPressLogSessionData}
              title="Show me session data"
              color="#f6bd3b"
              accessibilityLabel="testSessionData"
            />
            {'\n'}
            {'\n'}

            {sessionContext && (
              <>
                <Text>User Id: {sessionContext.userId}</Text>
                {'\n'}
                {'\n'}
                <Text>Session Id: {sessionContext.sessionId}</Text>
                {'\n'}
                {'\n'}
                <Text>Session Index: {sessionContext.sessionIndex}</Text>
              </>
            )}
          </Section>
          <Section title="Web view">
            {webViewEndpoint ? (
              <WebView
                onMessage={getWebViewCallback()}
                source={{ uri: webViewEndpoint }}
                style={{
                  height: 400,
                  width:
                    Dimensions.get('window').width -
                    styles.sectionContainer.paddingHorizontal,
                }}
              />
            ) : null}
          </Section>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    marginBottom: 16,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
