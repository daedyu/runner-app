import React from 'react';
import {StyleSheet, Text} from 'react-native';
import { WebView } from 'react-native-webview';
import { Stack } from 'expo-router';
import SafeContainer from '@/components/common/SafeContainer';

export default function PrivacyPolicyScreen() {
  const NOTION_URL = "https://branched-desk-f3e.notion.site/93b942e53b314c7683368c07a8d44892?pvs=74";

  return (
    <SafeContainer>
      <WebView 
        source={{ uri: NOTION_URL }}
        style={styles.webview}
        startInLoadingState={true}
        scalesPageToFit={true}
      />
    </SafeContainer>
  );
}

const styles = StyleSheet.create({
  webview: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
}); 