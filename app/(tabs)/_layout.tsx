import { Tabs } from 'expo-router';
import { useColorScheme } from 'react-native';
import Colors from '@/constants/Colors';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: useClientOnlyValue(false, true),
        tabBarShowLabel: false,
      }}>
      <Tabs.Screen
        name="events"
        options={{
          title: '이벤트',
          tabBarIcon: ({ color }) => <Ionicons name="star-outline" size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="records"
        options={{
          title: '달리기기록',
          tabBarIcon: ({ color }) => <Ionicons name="fitness-outline" size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: '홈',
          tabBarIcon: ({ color }) => <Ionicons name="home-outline" size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="competitions"
        options={{
          title: '대회공고',
          tabBarIcon: ({ color }) => <Ionicons name="trophy-outline" size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: '내정보',
          tabBarIcon: ({ color }) => <Ionicons name="person-outline" size={28} color={color} />,
        }}
      />
    </Tabs>
  );
}
