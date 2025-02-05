import { Tabs } from 'expo-router';
import { useColorScheme } from 'react-native';
import Colors from '@/constants/Colors';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';
import { Ionicons } from '@expo/vector-icons';
import { getThemeColors } from '@/assets/theme/colors';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const colors = getThemeColors(colorScheme === 'dark');

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        headerShown: useClientOnlyValue(false, true),
        tabBarShowLabel: true,
      }}>
      <Tabs.Screen
        name="events"
        options={{
          title: '이벤트',
          tabBarLabel: '이벤트',
          tabBarIcon: ({ color }) => <Ionicons name="gift-outline" size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="records"
        options={{
          title: '기록',
          tabBarLabel: '기록',
          tabBarIcon: ({ color }) => <Ionicons name="fitness-outline" size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: '홈',
          tabBarLabel: '홈',
          tabBarIcon: ({ color }) => <Ionicons name="home-outline" size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="announcements"
        options={{
          title: '대회공고',
          tabBarLabel: '대회',
          tabBarIcon: ({ color }) => <Ionicons name="trophy-outline" size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: '내정보',
          tabBarLabel: '내 정보',
          tabBarIcon: ({ color }) => <Ionicons name="person-outline" size={28} color={color} />,
        }}
      />
    </Tabs>
  );
}
