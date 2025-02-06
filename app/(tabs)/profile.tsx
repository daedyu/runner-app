import React, { useState } from 'react';
import { StyleSheet, View, Image, TouchableOpacity, ScrollView } from 'react-native';
import { Text } from '@/components/Themed';
import { useColorScheme } from 'react-native';
import { getThemeColors } from '@/assets/theme/colors';
import SafeContainer from '@/components/common/SafeContainer';
import { Pencil, Settings } from 'lucide-react-native';
import { Stack, router } from 'expo-router';
import TeamSearchModal from '@/components/TeamSearchModal';

interface UserProfile {
  name: string;
  school: string;
  grade: number;
  imageUrl: string;
  team?: {
    name: string;
    role: string;
    totalDistance: number;  // km 단위
    memberCount: number;
  };
}

const DUMMY_PROFILE: UserProfile = {
  name: "김민규",
  school: "대구소프트웨어마이스터고등학교",
  grade: 2,
  imageUrl: "https://picsum.photos/800",
  // team: {
  //   name: "달리기 크루",
  //   role: "팀원",
  //   totalDistance: 142.5,
  //   memberCount: 8
  // }
};

export default function ProfileScreen() {
  const colorScheme = useColorScheme();
  const colors = getThemeColors(colorScheme === 'dark');
  const [isTeamModalVisible, setIsTeamModalVisible] = useState(false);

  const handleEditProfile = () => {
    router.push('/edit');
  };

  const handleSettings = () => {
    // 설정 페이지로 이동
    router.push('/settings');
  };

  const handleJoinTeam = () => {
    setIsTeamModalVisible(true);
  };

  const handleTeamSelect = (teamId: string) => {
    // TODO: 팀 가입 API 호출
    console.log('Selected team:', teamId);
  };

  return (
    <SafeContainer>
      <Stack.Screen
        options={{
          title: '내 정보',
          headerRight: () => (
            <TouchableOpacity 
              onPress={handleSettings}
              style={styles.headerButton}
            >
              <Settings size={24} color={colors.text.primary} />
            </TouchableOpacity>
          ),
        }}
      />
      
      <ScrollView 
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
      >
        {/* 프로필 이미지 */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: DUMMY_PROFILE.imageUrl }}
            style={styles.profileImage}
            defaultSource={{ uri: "https://picsum.photos/200" }}
          />
        </View>

        {/* 프로필 정보 */}
        <View style={[styles.card, { backgroundColor: colors.cardBackground }]}>
          <View style={styles.nameContainer}>
            <Text style={[styles.name, { color: colors.text.primary }]}>
              {DUMMY_PROFILE.name}
            </Text>
            <TouchableOpacity 
              onPress={handleEditProfile}
              style={styles.editButton}
            >
              <Pencil size={20} color={colors.text.secondary} />
            </TouchableOpacity>
          </View>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          <View style={styles.detailsContainer}>
            <View style={styles.detailRow}>
              <Text style={[styles.label, { color: colors.text.secondary }]}>
                학교
              </Text>
              <Text style={[styles.value, { color: colors.text.primary }]}>
                {DUMMY_PROFILE.school}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={[styles.label, { color: colors.text.secondary }]}>
                학년
              </Text>
              <Text style={[styles.value, { color: colors.text.primary }]}>
                {DUMMY_PROFILE.grade}학년
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={[styles.label, { color: colors.text.secondary }]}>
                팀
              </Text>
              {DUMMY_PROFILE.team ? (
                <View style={styles.teamInfo}>
                  <Text style={[styles.value, { color: colors.text.primary }]}>
                    {DUMMY_PROFILE.team.name}
                  </Text>
                  <Text style={[styles.teamRole, { color: colors.text.secondary }]}>
                    ({DUMMY_PROFILE.team.role})
                  </Text>
                </View>
              ) : (
                <TouchableOpacity
                  onPress={handleJoinTeam}
                  style={[styles.joinButton, { backgroundColor: colors.primary }]}
                >
                  <Text style={[styles.joinButtonText, { color: colors.text.inverse }]}>
                    팀 가입하기
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>

        {/* 팀 정보 */}
        {DUMMY_PROFILE.team && (
          <View style={[styles.card, styles.teamCard, { backgroundColor: colors.cardBackground }]}>
            <View style={styles.teamHeader}>
              <Text style={[styles.teamName, { color: colors.text.primary }]}>
                {DUMMY_PROFILE.team.name}
              </Text>
              <Text style={[styles.teamRole, { color: colors.text.secondary }]}>
                {DUMMY_PROFILE.team.role}
              </Text>
            </View>

            <View style={styles.teamStats}>
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: colors.text.primary }]}>
                  {DUMMY_PROFILE.team.totalDistance.toLocaleString()}km
                </Text>
                <Text style={[styles.statLabel, { color: colors.text.secondary }]}>
                  총 달린 거리
                </Text>
              </View>

              <View style={[styles.statDivider, { backgroundColor: colors.border }]} />

              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: colors.text.primary }]}>
                  {DUMMY_PROFILE.team.memberCount}명
                </Text>
                <Text style={[styles.statLabel, { color: colors.text.secondary }]}>
                  멤버
                </Text>
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      <TeamSearchModal
        isVisible={isTeamModalVisible}
        onClose={() => setIsTeamModalVisible(false)}
        onSelect={handleTeamSelect}
      />
    </SafeContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 20,
  },
  headerButton: {
    marginRight: 16,
  },
  imageContainer: {
    marginBottom: 20,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  card: {
    width: '90%',
    borderRadius: 12,
    padding: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 0.,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    position: 'relative',
    width: '100%',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  editButton: {
    padding: 8,
    position: 'absolute',
    right: 0,
  },
  divider: {
    height: 1,
    width: '100%',
    marginBottom: 20,
  },
  detailsContainer: {
    gap: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
  },
  value: {
    fontSize: 16,
    fontWeight: '500',
  },
  teamInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  teamCard: {
    marginTop: 16,
  },
  teamHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  teamName: {
    fontSize: 20,
    fontWeight: '600',
  },
  teamRole: {
    fontSize: 14,
  },
  teamStats: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
  },
  statDivider: {
    width: 1,
    height: 40,
  },
  joinButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  joinButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
}); 