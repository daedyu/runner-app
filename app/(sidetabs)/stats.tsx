import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, ScrollView, Dimensions, Platform } from 'react-native';
import { Text } from '@/components/Themed';
import { useColorScheme } from 'react-native';
import { getThemeColors } from '@/assets/theme/colors';
import SafeContainer from '@/components/common/SafeContainer';
import { Stack } from 'expo-router';
import * as Progress from 'react-native-progress';
import { Picker } from '@react-native-picker/picker';
import { ChevronDown } from 'lucide-react-native';
import { router } from 'expo-router';

const SCREEN_WIDTH = Dimensions.get('window').width;

type Period = 'day' | 'month' | 'year' | 'custom';

interface Stats {
  distance: number;
  targetDistance: number;
  time: number;
  targetTime: number;
}

// 임시 데이터를 더 다양하게 생성
const generateDummyStats = (year: string): Stats => {
  const currentYear = new Date().getFullYear().toString();
  const multiplier = year === currentYear ? 1 : 0.8; // 이전 년도는 80% 수준

  return {
    distance: Math.round(420 * multiplier),
    targetDistance: 600,
    time: Math.round(3600 * multiplier),
    targetTime: 7200,
  };
};

const DUMMY_STATS = {
  day: {
    distance: 3.5,
    targetDistance: 5,
    time: 25,
    targetTime: 30,
  },
  month: {
    distance: 35,
    targetDistance: 50,
    time: 300,
    targetTime: 600,
  },
  year: generateDummyStats(new Date().getFullYear().toString()),
};

export default function StatsScreen() {
  const colorScheme = useColorScheme();
  const colors = getThemeColors(colorScheme === 'dark');
  const [selectedPeriod, setSelectedPeriod] = useState<Period>('month');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
  const [showYearPicker, setShowYearPicker] = useState(false);
  const [stats, setStats] = useState(DUMMY_STATS.month);
  const [isLoading, setIsLoading] = useState(false);

  // 최근 10년 생성
  const years = Array.from(
    { length: 10 }, 
    (_, i) => (new Date().getFullYear() - i).toString()
  );

  // 통계 데이터 가져오기 (더미)
  const fetchStats = async (period: Period, year?: string) => {
    setIsLoading(true);
    
    // 실제 API 호출을 시뮬레이션하기 위한 지연
    await new Promise(resolve => setTimeout(resolve, 500));

    let newStats;
    if (period === 'year') {
      newStats = generateDummyStats(year || selectedYear);
    } else if (period === 'day' || period === 'month') {
      newStats = DUMMY_STATS[period];
    } else {
      // custom 기간의 경우 기본값 사용
      newStats = {
        distance: 0,
        targetDistance: 0, 
        time: 0,
        targetTime: 0
      };
    }

    setStats(newStats);
    setIsLoading(false);
  };

  // 기간 변경 시 통계 업데이트
  React.useEffect(() => {
    fetchStats(selectedPeriod);
  }, [selectedPeriod]);

  // 년도 변경 시 통계 업데이트
  React.useEffect(() => {
    if (selectedPeriod === 'year') {
      fetchStats('year', selectedYear);
    }
  }, [selectedYear]);

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}시간 ${mins}분`;
    }
    return `${mins}분`;
  };

  const renderPeriodSelector = () => {
    const periods: { key: Period; label: string }[] = [
      { key: 'day', label: '오늘' },
      { key: 'month', label: '이번 달' },
      { key: 'year', label: '년도' },
    ];

    return (
      <View style={styles.periodSelectorContainer}>
        <View style={styles.periodSelector}>
          {periods.map(({ key, label }) => (
            <TouchableOpacity
              key={key}
              style={[
                styles.periodButton,
                { 
                  backgroundColor: selectedPeriod === key ? colors.primary : colors.cardBackground,
                  borderColor: selectedPeriod === key ? colors.primary : colors.border,
                }
              ]}
              onPress={() => setSelectedPeriod(key)}
            >
              <Text
                style={[
                  styles.periodButtonText,
                  { color: selectedPeriod === key ? colors.text.inverse : colors.text.primary }
                ]}
              >
                {label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        
        {selectedPeriod === 'year' && (
          <View style={styles.yearSelectorContainer}>
            <TouchableOpacity 
              style={[styles.yearSelector, { borderColor: colors.border }]}
              onPress={() => setShowYearPicker(!showYearPicker)}
            >
              <Text style={[styles.yearText, { color: colors.text.primary }]}>
                {selectedYear}년
              </Text>
              <ChevronDown 
                size={20} 
                color={colors.text.primary}
                style={[
                  styles.yearIcon,
                  showYearPicker && styles.yearIconRotate
                ]}
              />
            </TouchableOpacity>
            
            {showYearPicker && (
              <View style={[styles.yearPickerContainer, { backgroundColor: colors.cardBackground }]}>
                <Picker
                  selectedValue={selectedYear}
                  onValueChange={(itemValue) => {
                    setSelectedYear(itemValue);
                    setShowYearPicker(false);
                  }}
                  style={[styles.yearPicker, { color: colors.text.primary }]}
                  itemStyle={{ fontSize: 16 }}
                >
                  {years.map((year) => (
                    <Picker.Item 
                      key={year} 
                      label={`${year}년`} 
                      value={year}
                    />
                  ))}
                </Picker>
              </View>
            )}
          </View>
        )}
      </View>
    );
  };

  const distanceProgress = stats.distance / stats.targetDistance;
  const timeProgress = stats.time / stats.targetTime;

  return (
    <SafeContainer>
      <Stack.Screen
        options={{
          title: '통계',
          headerShown: true,
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <Text>뒤로</Text>
            </TouchableOpacity>
          )
        }}
      />
      
      <ScrollView 
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
      >
        {renderPeriodSelector()}

        <View style={[styles.card, { backgroundColor: colors.cardBackground }]}>
          <Text style={[styles.cardTitle, { color: colors.text.primary }]}>거리</Text>
          <View style={styles.progressContainer}>
            <Progress.Bar 
              progress={isLoading ? 0 : distanceProgress}
              width={SCREEN_WIDTH - 112}
              height={15}
              color={colors.progress.fill}
              unfilledColor={colors.progress.background}
              borderWidth={0}
              animated={true}
            />
            <View style={styles.statsInfo}>
              {isLoading ? (
                <Text style={[styles.loadingText, { color: colors.text.secondary }]}>
                  로딩 중...
                </Text>
              ) : (
                <>
                  <Text style={[styles.currentValue, { color: colors.text.primary }]}>
                    {stats.distance.toLocaleString()}km
                  </Text>
                  <Text style={[styles.targetValue, { color: colors.text.secondary }]}>
                    / {stats.targetDistance.toLocaleString()}km
                  </Text>
                </>
              )}
            </View>
          </View>
        </View>

        <View style={[styles.card, { backgroundColor: colors.cardBackground }]}>
          <Text style={[styles.cardTitle, { color: colors.text.primary }]}>시간</Text>
          <View style={styles.progressContainer}>
            <Progress.Bar 
              progress={isLoading ? 0 : timeProgress}
              width={SCREEN_WIDTH - 112}
              height={15}
              color={colors.progress.fill}
              unfilledColor={colors.progress.background}
              borderWidth={0}
              animated={true}
            />
            <View style={styles.statsInfo}>
              {isLoading ? (
                <Text style={[styles.loadingText, { color: colors.text.secondary }]}>
                  로딩 중...
                </Text>
              ) : (
                <>
                  <Text style={[styles.currentValue, { color: colors.text.primary }]}>
                    {formatTime(stats.time)}
                  </Text>
                  <Text style={[styles.targetValue, { color: colors.text.secondary }]}>
                    / {formatTime(stats.targetTime)}
                  </Text>
                </>
              )}
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  periodSelectorContainer: {
    marginBottom: 20,
  },
  periodSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  periodButton: {
    flex: 1,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    marginHorizontal: 4,
  },
  periodButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  card: {
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  progressContainer: {
    width: '100%',
  },
  statsInfo: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: 8,
    alignSelf: 'flex-start',
  },
  currentValue: {
    fontSize: 24,
    fontWeight: '600',
  },
  targetValue: {
    fontSize: 16,
    marginLeft: 4,
  },
  yearSelectorContainer: {
    marginTop: 12,
    position: 'relative',
  },
  yearSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    borderWidth: 1,
    borderRadius: 8,
  },
  yearText: {
    fontSize: 16,
    fontWeight: '500',
    marginRight: 4,
  },
  yearIcon: {
    transform: [{ rotate: '0deg' }],
  },
  yearIconRotate: {
    transform: [{ rotate: '180deg' }],
  },
  yearPickerContainer: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    marginTop: 4,
    borderRadius: 8,
    overflow: 'hidden',
    zIndex: 1,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    ...(Platform.OS === 'ios' && {
      borderWidth: 1,
      borderColor: '#eee',
    }),
  },
  yearPicker: {
    width: '100%',
    height: Platform.OS === 'ios' ? 180 : 50,
  },
  loadingText: {
    fontSize: 16,
    fontWeight: '500',
  },
}); 