import { StyleSheet, SafeAreaView, ScrollView, ViewStyle } from 'react-native';
import { useColorScheme } from 'react-native';
import { getThemeColors } from '@/assets/theme/colors';

interface SafeContainerProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export default function SafeContainer({ children, style }: SafeContainerProps) {
  const colorScheme = useColorScheme();
  const colors = getThemeColors(colorScheme === 'dark');

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        style={[styles.scrollView, style]}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {children}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 16,
  },
}); 