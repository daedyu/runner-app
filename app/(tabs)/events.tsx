import React, { useState } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, ScrollView, Image } from 'react-native';
import { Text } from '@/components/Themed';
import { useColorScheme } from 'react-native';
import { getThemeColors } from '@/assets/theme/colors';
import SafeContainer from '@/components/common/SafeContainer';
import { Search } from 'lucide-react-native';

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  type: 'school' | 'other';
  imageUrl: string;
  participants: number;
}

const DUMMY_EVENTS: Event[] = [
  {
    id: '1',
    title: '교내 마라톤 대회',
    description: '2024 봄맞이 교내 마라톤 대회',
    date: '2024-04-15T09:00:00.000Z',
    location: '대구대학교 운동장',
    type: 'school',
    imageUrl: 'https://picsum.photos/300',
    participants: 150,
  },
  {
    id: '2',
    title: '대구시 달리기 대회',
    description: '제 5회 대구시 달리기 대회',
    date: '2024-05-01T08:00:00.000Z',
    location: '대구 스타디움',
    type: 'other',
    imageUrl: 'https://picsum.photos/200',
    participants: 500,
  },
  // ... 더 많은 더미 데이터
];

type FilterType = 'all' | 'school' | 'other';

export default function EventsScreen() {
  const colorScheme = useColorScheme();
  const colors = getThemeColors(colorScheme === 'dark');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [events, setEvents] = useState<Event[]>(DUMMY_EVENTS);

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === 'all' || event.type === activeFilter;
    return matchesSearch && matchesFilter;
  });

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long',
    });
  };

  return (
    <SafeContainer>
      {/* 검색바 */}
      <View style={[styles.searchContainer, { backgroundColor: colors.cardBackground }]}>
        <Search size={20} color={colors.text.secondary} />
        <TextInput
          style={[styles.searchInput, { color: colors.text.primary }]}
          placeholder="이벤트 검색"
          placeholderTextColor={colors.text.secondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

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
            </View>
            <View style={styles.eventContent}>
              <Text style={[styles.eventTitle, { color: colors.text.primary }]}>
                {event.title}
              </Text>
              <Text style={[styles.eventDescription, { color: colors.text.secondary }]}>
                {event.description}
              </Text>
              <Text style={[styles.eventDate, { color: colors.text.secondary }]}>
                {formatDate(event.date)}
              </Text>
              <Text style={[styles.eventLocation, { color: colors.text.secondary }]}>
                📍 {event.location}
              </Text>
              <Text style={[styles.eventParticipants, { color: colors.text.secondary }]}>
                👥 {event.participants}명 참가
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeContainer>
  );
}

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 10,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    padding: 8,
  },
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
  },
  eventImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
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
    marginBottom: 8,
  },
  eventDate: {
    fontSize: 14,
    marginBottom: 4,
  },
  eventLocation: {
    fontSize: 14,
    marginBottom: 4,
  },
  eventParticipants: {
    fontSize: 14,
  },
}); 