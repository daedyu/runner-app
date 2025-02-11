import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Text } from '@/components/Themed';
import { useColorScheme } from 'react-native';
import { getThemeColors } from '@/assets/theme/colors';
import SafeContainer from '@/components/common/SafeContainer';
import { Stack } from 'expo-router';
import { ChevronRight, LogOut, Users2, FileText } from 'lucide-react-native';
import { useRouter } from 'expo-router';

export default function SettingsScreen() {
  const colorScheme = useColorScheme();
  const colors = getThemeColors(colorScheme === 'dark');
  const router = useRouter();

  const handleLogout = () => {
    router.dismissAll()
    router.replace('/(auth)/sign-in');
  };

  const handleLeaveTeam = () => {
    // 팀 탈퇴 로직
  };

  const handlePrivacyPolicy = () => {
    router.push('/privacy-policy');
  };

  const SettingItem = ({ icon, title, onPress, color = colors.text.primary }: { icon: React.ReactNode, title: string, onPress: () => void, color?: string }) => (
    <TouchableOpacity 
      style={[styles.settingItem, { borderBottomColor: colors.border }]} 
      onPress={onPress}
    >
      <View style={styles.settingItemLeft}>
        {icon}
        <Text style={[styles.settingItemText, { color }]}>{title}</Text>
      </View>
      <ChevronRight size={20} color={colors.text.secondary} />
    </TouchableOpacity>
  );

  return (
    <SafeContainer>
      <Stack.Screen
        options={{
          title: '설정',
          headerBackTitle: '뒤로',
        }}
      />
      
      <View style={styles.container}>
        <View style={[styles.section, { backgroundColor: colors.cardBackground }]}>
          <SettingItem
            icon={<LogOut size={20} color={colors.error} />}
            title="로그아웃"
            onPress={handleLogout}
            color={colors.error}
          />
          <SettingItem
            icon={<Users2 size={20} color={colors.error} />}
            title="팀 탈퇴"
            onPress={handleLeaveTeam}
            color={colors.error}
          />
        </View>

        <View style={[styles.section, { backgroundColor: colors.cardBackground }]}>
          <SettingItem
            icon={<FileText size={20} color={colors.text.primary} />}
            title="개인정보 처리방침"
            onPress={handlePrivacyPolicy}
          />
        </View>
      </View>
    </SafeContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 20,
    padding: 16,
  },
  section: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
  },
  settingItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  settingItemText: {
    fontSize: 16,
  },
}); 