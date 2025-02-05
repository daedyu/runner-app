import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, ScrollView, Image } from 'react-native';
import { Text } from '@/components/Themed';
import { useColorScheme } from 'react-native';
import { getThemeColors } from '@/assets/theme/colors';
import SafeContainer from '@/components/common/SafeContainer';
import { Trophy } from 'lucide-react-native';

interface Event {
  id: string;
  title: string;
  description: string;
  goal: string;
  reward: string;
  endDate: string;
  type: 'school' | 'other';
  imageUrl: string;
  participants: number;
  progress?: number; // 진행률 (0-100)
}

const DUMMY_EVENTS: Event[] = [
  {
    id: '1',
    title: '2024 연간 달리기 챌린지',
    description: '1년 동안 1,000km 달성하고 상품 받아가세요!',
    goal: '1,000km 달성',
    reward: '문화상품권 5만원',
    endDate: '2024-12-31T23:59:59.000Z',
    type: 'school',
    imageUrl: 'https://picsum.photos/300',
    participants: 150,
    progress: 45,
  },
  {
    id: '2',
    title: '봄맞이 30일 러닝',
    description: '30일 연속 5km 이상 달리기',
    goal: '30일 연속 5km',
    reward: '스타벅스 기프티콘',
    endDate: '2024-04-30T23:59:59.000Z',
    type: 'other',
    imageUrl: 'https://picsum.photos/200',
    participants: 500,
    progress: 70,
  },
  {
    id: '3',
    title: '교내 단체 달리기',
    description: '친구들과 함께 달리기 누적거리 도전',
    goal: '팀당 500km 달성',
    reward: '체육복 지원',
    endDate: '2024-06-30T23:59:59.000Z',
    type: 'school',
    imageUrl: 'https://picsum.photos/250',
    participants: 300,
    progress: 25,
  },
];

type FilterType = 'all' | 'school' | 'other';

export default function EventsScreen() {
  const colorScheme = useColorScheme();
  const colors = getThemeColors(colorScheme === 'dark');
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [events, setEvents] = useState<Event[]>(DUMMY_EVENTS);

  const filteredEvents = events.filter(event => {
    return activeFilter === 'all' || event.type === activeFilter;
  });

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <SafeContainer>
      {/* 필터 버튼 */}
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[
            styles.filterButton,
            activeFilter === 'all' && { backgroundColor: colors.primary }
          ]}
          onPress={() => setActiveFilter('all')}
        >
          <Text style={[
            styles.filterText,
            { color: activeFilter === 'all' ? colors.text.inverse : colors.text.primary }
          ]}>
            전체
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterButton,
            activeFilter === 'school' && { backgroundColor: colors.primary }
          ]}
          onPress={() => setActiveFilter('school')}
        >
          <Text style={[
            styles.filterText,
            { color: activeFilter === 'school' ? colors.text.inverse : colors.text.primary }
          ]}>
            우리학교
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterButton,
            activeFilter === 'other' && { backgroundColor: colors.primary }
          ]}
          onPress={() => setActiveFilter('other')}
        >
          <Text style={[
            styles.filterText,
            { color: activeFilter === 'other' ? colors.text.inverse : colors.text.primary }
          ]}>
            기타
          </Text>
        </TouchableOpacity>
      </View>

      {/* 이벤트 목록 */}
      <ScrollView style={styles.eventList}>
        {filteredEvents.map((event) => (
          <TouchableOpacity
            key={event.id}
            style={[styles.eventCard, { backgroundColor: colors.cardBackground }]}
          >
            <View style={styles.eventImageContainer}>
              <Image
                source={{ uri: event.imageUrl }}
                style={styles.eventImage}
                defaultSource={{ uri: "https://picsum.photos/200" }}
              />
              {event.progress !== undefined && (
                <View style={[styles.progressBar, { backgroundColor: colors.progress.background }]}>
                  <View 
                    style={[
                      styles.progressFill, 
                      { 
                        backgroundColor: colors.progress.fill,
                        width: `${event.progress}%` 
                      }
                    ]} 
                  />
                </View>
              )}
            </View>
            <View style={styles.eventContent}>
              <Text style={[styles.eventTitle, { color: colors.text.primary }]}>
                {event.title}
              </Text>
              <Text style={[styles.eventDescription, { color: colors.text.secondary }]}>
                {event.description}
              </Text>
              <View style={styles.eventDetails}>
                <View style={styles.detailRow}>
                  <Trophy size={16} color={colors.text.secondary} />
                  <Text style={[styles.detailText, { color: colors.text.secondary }]}>
                    목표: {event.goal}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={[styles.detailText, { color: colors.text.secondary }]}>
                    보상: {event.reward}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={[styles.detailText, { color: colors.text.secondary }]}>
                    마감일: {formatDate(event.endDate)}
                  </Text>
                </View>
                <Text style={[styles.eventParticipants, { color: colors.text.secondary }]}>
                  👥 {event.participants}명 참여중
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeContainer>
  );
}

const styles = StyleSheet.create({
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    marginVertical: 16,
    paddingHorizontal: 16,
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600',
  },
  eventList: {
    flex: 1,
  },
  eventCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  eventImageContainer: {
    height: 150,
    position: 'relative',
  },
  eventImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  progressBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 4,
  },
  progressFill: {
    height: '100%',
  },
  eventContent: {
    padding: 16,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  eventDescription: {
    fontSize: 14,
    marginBottom: 12,
  },
  eventDetails: {
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 14,
  },
  eventParticipants: {
    fontSize: 14,
    marginTop: 8,
  },
}); 