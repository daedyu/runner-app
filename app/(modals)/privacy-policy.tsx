import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { WebView } from 'react-native-webview';
import { Stack, router } from 'expo-router';
import SafeContainer from '@/components/common/SafeContainer';
import { Text } from '@/components/Themed';
import { useColorScheme } from 'react-native';
import { getThemeColors } from '@/assets/theme/colors';
import { ChevronLeft } from 'lucide-react-native';

export default function PrivacyPolicyScreen() {
  const colorScheme = useColorScheme();
  const colors = getThemeColors(colorScheme === 'dark');
  const NOTION_URL = "https://branched-desk-f3e.notion.site/93b942e53b314c7683368c07a8d44892?pvs=74";

  return (
    <SafeContainer>
      <Stack.Screen
        options={{
          headerShown: true,
          title: '개인정보 처리방침',
          headerLeft: () => (
            <TouchableOpacity 
              onPress={() => router.back()}
              style={styles.headerButton}
            >
              <ChevronLeft size={24} color={colors.text.primary} />
            </TouchableOpacity>
          ),
          headerStyle: {
            backgroundColor: colors.background,
          },
          headerTintColor: colors.text.primary,
          headerShadowVisible: false,
          presentation: 'modal',
        }}
      />
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
  headerButton: {
    marginLeft: 8,
    padding: 4,
  },
}); 