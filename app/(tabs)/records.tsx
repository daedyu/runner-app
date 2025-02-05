import React, { useEffect, useState } from 'react';
import { StyleSheet, View, ActivityIndicator, ScrollView, Dimensions } from 'react-native';
import { Text } from '@/components/Themed';
import MapView, { Polyline, Marker } from 'react-native-maps';
import { useColorScheme } from 'react-native';
import { getThemeColors } from '@/assets/theme/colors';
import SafeContainer from '@/components/common/SafeContainer';

interface RunningRecord {
  id: string;
  title: string;
  distance: number;
  time: number;
  averageSpeed: number;
  coordinates: {
    latitude: number;
    longitude: number;
  }[];
  date: string;
}

const DUMMY_RECORDS: RunningRecord[] = [
  {
    id: '1',
    title: '아침 조깅',
    distance: 3500, // 3.5km
    time: 1200, // 20분
    averageSpeed: 2.91, // 약 10.5km/h
    coordinates: [
      { latitude: 35.8776, longitude: 128.6284 },
      { latitude: 35.8780, longitude: 128.6290 },
      { latitude: 35.8785, longitude: 128.6295 },
      { latitude: 35.8790, longitude: 128.6300 },
      { latitude: 35.8795, longitude: 128.6305 },
    ],
    date: '2024-03-10T06:30:00.000Z',
  },
  {
    id: '2',
    title: '저녁 달리기',
    distance: 5000, // 5km
    time: 1500, // 25분
    averageSpeed: 3.33, // 약 12km/h
    coordinates: [
      { latitude: 35.8800, longitude: 128.6310 },
      { latitude: 35.8805, longitude: 128.6315 },
      { latitude: 35.8810, longitude: 128.6320 },
      { latitude: 35.8815, longitude: 128.6325 },
      { latitude: 35.8820, longitude: 128.6330 },
    ],
    date: '2024-03-09T18:00:00.000Z',
  },
  {
    id: '3',
    title: '주말 마라톤',
    distance: 10000, // 10km
    time: 3600, // 60분
    averageSpeed: 2.77, // 약 10km/h
    coordinates: [
      { latitude: 35.8825, longitude: 128.6335 },
      { latitude: 35.8830, longitude: 128.6340 },
      { latitude: 35.8835, longitude: 128.6345 },
      { latitude: 35.8840, longitude: 128.6350 },
      { latitude: 35.8845, longitude: 128.6355 },
    ],
    date: '2024-03-08T09:00:00.000Z',
  },
];

export default function RecordsScreen() {
  const colorScheme = useColorScheme();
  const colors = getThemeColors(colorScheme === 'dark');
  const [records, setRecords] = useState<RunningRecord[]>(DUMMY_RECORDS);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // 실제 API 연동 시 사용할 함수
    // fetchRunningRecords();
  }, []);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}분 ${secs}초`;
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <SafeContainer>
      <ScrollView style={styles.scrollView}>
        {records.map((record) => (
          <View 
            key={record.id} 
            style={[styles.recordCard, { backgroundColor: colors.cardBackground }]}
          >
            <Text style={[styles.recordTitle, { color: colors.text.primary }]}>
              {record.title}
            </Text>
            <Text style={[styles.recordDate, { color: colors.text.secondary }]}>
              {formatDate(record.date)}
            </Text>
            
            <View style={styles.contentContainer}>
              {/* 지도 */}
              <View style={styles.mapContainer}>
                <MapView
                  style={styles.map}
                  initialRegion={{
                    ...record.coordinates[0],
                    latitudeDelta: 0.005,
                    longitudeDelta: 0.005,
                  }}
                  scrollEnabled={false}
                  zoomEnabled={false}
                >
                  <Polyline
                    coordinates={record.coordinates}
                    strokeColor={colors.primary}
                    strokeWidth={3}
                  />
                  <Marker
                    coordinate={record.coordinates[0]}
                    title="시작"
                    pinColor="green"
                  />
                  <Marker
                    coordinate={record.coordinates[record.coordinates.length - 1]}
                    title="종료"
                    pinColor="red"
                  />
                </MapView>
              </View>

              {/* 기록 정보 */}
              <View style={styles.statsContainer}>
                <View style={styles.statItem}>
                  <Text style={[styles.statLabel, { color: colors.text.secondary }]}>
                    거리
                  </Text>
                  <Text style={[styles.statValue, { color: colors.text.primary }]}>
                    {(record.distance / 1000).toFixed(2)}km
                  </Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={[styles.statLabel, { color: colors.text.secondary }]}>
                    시간
                  </Text>
                  <Text style={[styles.statValue, { color: colors.text.primary }]}>
                    {formatTime(record.time)}
                  </Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={[styles.statLabel, { color: colors.text.secondary }]}>
                    평균 속도
                  </Text>
                  <Text style={[styles.statValue, { color: colors.text.primary }]}>
                    {(record.averageSpeed * 3.6).toFixed(1)}km/h
                  </Text>
                </View>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  recordCard: {
    marginBottom: 16,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  recordTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  recordDate: {
    fontSize: 14,
    marginBottom: 12,
  },
  contentContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  mapContainer: {
    flex: 1,
    height: 150,
    borderRadius: 8,
    overflow: 'hidden',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  statsContainer: {
    flex: 1,
    justifyContent: 'center',
    gap: 12,
  },
  statItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 14,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '600',
  },
}); 