import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, TouchableOpacity, Platform } from 'react-native';
import { Text } from '@/components/Themed';
import MapView, { Polyline, Marker } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { getThemeColors } from '@/assets/theme/colors';
import { useColorScheme } from 'react-native';
import SaveRunningModal from '@/components/running/SaveRunningModal';
import { Stack, router } from 'expo-router';
import IconButton from "@/components/common/IconButton";

interface Coordinate {
  latitude: number;
  longitude: number;
}

// 테스트용 가상 경로 데이터 (동대구역 주변)
const TEST_ROUTE = [
  { latitude: 35.8776, longitude: 128.6284 },  // 동대구역
  { latitude: 35.8780, longitude: 128.6290 },  // 동대구역 동쪽
  { latitude: 35.8785, longitude: 128.6295 },  // 동대구로
  { latitude: 35.8790, longitude: 128.6300 },  // 신천동로
  { latitude: 35.8795, longitude: 128.6305 },  // 동부로
  { latitude: 35.8800, longitude: 128.6310 },  // 신천둔치
  { latitude: 35.8805, longitude: 128.6315 },  // 동대구로 북쪽
  { latitude: 35.8810, longitude: 128.6320 },  // 신천동
  { latitude: 35.8815, longitude: 128.6325 },  // 신천동 북쪽
  { latitude: 35.8820, longitude: 128.6330 },  // 신천동 공원
  { latitude: 35.8825, longitude: 128.6335 },  // 동구 신천동d
  { latitude: 35.8830, longitude: 128.6340 },  // 신천동 주거지역
  { latitude: 35.8835, longitude: 128.6345 },  // 동대구로 주변
];

export default function RunningScreen() {
  const colorScheme = useColorScheme();
  const colors = getThemeColors(colorScheme === 'dark');
  const [runningState, setRunningState] = useState({
    elapsed: 0,
    totalDistance: 0,
    averageSpeed: 0,
    coordinates: [] as Coordinate[],
    currentLocation: {
      latitude: 35.8776,
      longitude: 128.6284,
    },
    isTestMode: false,
    isSaveModalVisible: false,
    isRunning: false
  });

  const locationSubscription = useRef<any>(null);
  const timer = useRef<any>(null);
  const mapRef = useRef<MapView>(null);
  const testInterval = useRef<any>(null);
  const currentTestIndex = useRef(0);
  const [isInitializing, setIsInitializing] = useState(false);

  useEffect(() => {
    return () => stopTracking();
  }, []);

  const initializeLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('위치 권한이 거부되었습니다.');
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.BestForNavigation,
      });

      const initialLocation = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };

      handleLocationUpdate(initialLocation);
    } catch (error) {
      console.log('위치를 가져오는데 실패했습니다:', error);
    }
  };

  const calculateDistance = (coord1: Coordinate, coord2: Coordinate): number => {
    const R = 6371e3;
    const φ1 = (coord1.latitude * Math.PI) / 180;
    const φ2 = (coord2.latitude * Math.PI) / 180;
    const Δφ = ((coord2.latitude - coord1.latitude) * Math.PI) / 180;
    const Δλ = ((coord2.longitude - coord1.longitude) * Math.PI) / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  };

  const calculateTotalDistance = (coords: Coordinate[]): number => {
    let total = 0;
    for (let i = 1; i < coords.length; i++) {
      total += calculateDistance(coords[i - 1], coords[i]);
    }
    return total;
  };

  const handleLocationUpdate = (newCoord: Coordinate) => {
    console.log('위치 업데이트:', newCoord); // 디버깅용 로그 추가
    setRunningState(prev => {
      // 이전 좌표와 동일한 위치인지 확인
      const lastCoord = prev.coordinates[prev.coordinates.length - 1];
      if (lastCoord && 
          lastCoord.latitude === newCoord.latitude && 
          lastCoord.longitude === newCoord.longitude) {
        return prev; // 동일한 위치면 업데이트하지 않음
      }

      const newCoords = [...prev.coordinates, newCoord];
      console.log('새로운 좌표 배열 길이:', newCoords.length); // 디버깅용 로그 추가
      
      const newDistance = calculateTotalDistance(newCoords);
      const newAverageSpeed = prev.elapsed > 0 ? newDistance / prev.elapsed : 0;

      return {
        ...prev,
        coordinates: newCoords,
        totalDistance: newDistance,
        averageSpeed: newAverageSpeed,
        currentLocation: newCoord,
      };
    });

    // 지도를 현재 위치로 이동
    mapRef.current?.animateToRegion({
      ...newCoord,
      latitudeDelta: 0.005,
      longitudeDelta: 0.005,
    }, 1000);
  };

  const updateTimer = () => {
    setRunningState(prev => ({ ...prev, elapsed: prev.elapsed + 1 }));
  };

  const startTracking = async () => {
    setIsInitializing(true); // 로딩 시작
    try {
      console.log('위치 추적 시작...');
      
      // 위치 권한 요청
      const foregroundPermission = await Location.requestForegroundPermissionsAsync();
      console.log('위치 권한 상태:', foregroundPermission.status);
      
      if (foregroundPermission.status !== 'granted') {
        alert('위치 권한이 필요합니다.');
        setIsInitializing(false); // 권한 거부 시 로딩 종료
        return;
      }

      // 초기 위치 가져오기
      const initialLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.BestForNavigation,
      });
      
      const initialCoord = {
        latitude: initialLocation.coords.latitude,
        longitude: initialLocation.coords.longitude,
      };

      // 지도를 초기 위치로 이동
      mapRef.current?.animateToRegion({
        ...initialCoord,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      }, 1000);

      // 상태 업데이트 - coordinates에 초기 위치 추가
      setRunningState(prev => ({ 
        ...prev, 
        isRunning: true, 
        isTestMode: false,
        coordinates: [initialCoord], // 초기 위치를 배열에 추가
        currentLocation: initialCoord,
        elapsed: 0,
        totalDistance: 0,
        averageSpeed: 0,
      }));

      // 타이머 시작 (시간 측정용)
      timer.current = setInterval(updateTimer, 1000);

      // 위치 저장 타이머 시작 (5초마다 현재 위치 저장)
      locationSubscription.current = setInterval(async () => {
        try {
          const location = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.BestForNavigation,
          });
          
          handleLocationUpdate({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          });
        } catch (error) {
          console.error('위치 가져오기 실패:', error);
        }
      }, 5000);

      console.log('위치 추적 시작 완료');
      setIsInitializing(false); // 로딩 종료
    } catch (error) {
      console.error('위치 추적 시작 실패:', error);
      stopTracking();
      alert('위치 추적을 시작할 수 없습니다: ' + (error as Error).message);
      setIsInitializing(false); // 에러 발생 시 로딩 종료
    }
  };

  const startTestMode = () => {
    setRunningState(prev => ({ ...prev, isRunning: true, isTestMode: true }));
    currentTestIndex.current = 0;
    
    const initialTestLocation = TEST_ROUTE[0];
    handleLocationUpdate(initialTestLocation);

    timer.current = setInterval(updateTimer, 1000);

    testInterval.current = setInterval(() => {
      if (currentTestIndex.current < TEST_ROUTE.length - 1) {
        currentTestIndex.current += 1;
        const newCoord = TEST_ROUTE[currentTestIndex.current];
        handleLocationUpdate(newCoord);

        mapRef.current?.animateToRegion({
          ...newCoord,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        }, 1000);
      } else {
        clearInterval(testInterval.current);
      }
    }, 2000);
  };

  const stopTracking = () => {
    // 먼저 모든 타이머와 구독을 정리
    if (locationSubscription.current) {
      clearInterval(locationSubscription.current);
      locationSubscription.current = null;
    }
    if (timer.current) {
      clearInterval(timer.current);
      timer.current = null;
    }
    if (testInterval.current) {
      clearInterval(testInterval.current);
      testInterval.current = null;
    }

    // 그 다음 상태 초기화
    setRunningState(prev => ({
      ...prev,
      isRunning: false,
      elapsed: 0,
      totalDistance: 0,
      averageSpeed: 0,
      coordinates: [],
      isTestMode: false,
    }));
    
    currentTestIndex.current = 0;
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStopRunning = () => {
    // 모달만 표시하고 측정은 계속 진행
    setRunningState(prev => ({ 
      ...prev,
      isSaveModalVisible: true 
    }));
  };

  const handleSaveRunning = async (title: string) => {
    try {
      // 먼저 모든 타이머와 구독을 정리
      if (locationSubscription.current) {
        clearInterval(locationSubscription.current);
        locationSubscription.current = null;
      }
      if (timer.current) {
        clearInterval(timer.current);
        timer.current = null;
      }
      if (testInterval.current) {
        clearInterval(testInterval.current);
        testInterval.current = null;
      }

      const runningData = {
        title,
        distance: runningState.totalDistance,
        time: runningState.elapsed,
        averageSpeed: runningState.averageSpeed,
        coordinates: runningState.coordinates,
        date: new Date().toISOString(),
      };

      // API 호출
      const response = await fetch('YOUR_API_ENDPOINT/running', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(runningData),
      });

      if (!response.ok) {
        throw new Error('Failed to save running data');
      }

      // 성공적으로 저장 후 초기화 및 모달 닫기
      setRunningState(prev => ({
        ...prev,
        isRunning: false,
        isSaveModalVisible: false,
        elapsed: 0,
        totalDistance: 0,
        averageSpeed: 0,
        coordinates: [],
        currentLocation: { latitude: 35.8776, longitude: 128.6284 },
      }));

      router.back();
    } catch (error) {
      console.error('Error saving running:', error);
    }
  };

  const handleBack = () => {
    if (runningState.isRunning) {
      // 운동 중이라면 저장 모달 표시
      setRunningState(prev => ({ ...prev, isSaveModalVisible: true }));
    } else {
      // 운동 중이 아니라면 바로 뒤로가기
      router.back();
    }
  };

  const handleDelete = () => {
    // 삭제 시에만 모든 타이머와 구독을 정리
    if (locationSubscription.current) {
      clearInterval(locationSubscription.current);
      locationSubscription.current = null;
    }
    if (timer.current) {
      clearInterval(timer.current);
      timer.current = null;
    }
    if (testInterval.current) {
      clearInterval(testInterval.current);
      testInterval.current = null;
    }
    
    // 모달 닫기 및 상태 초기화
    setRunningState(prev => ({
      ...prev,
      isRunning: false,
      isSaveModalVisible: false,
      elapsed: 0,
      totalDistance: 0,
      averageSpeed: 0,
      coordinates: [],
      currentLocation: { latitude: 35.8776, longitude: 128.6284 },
    }));

    router.back();
  };

  return (
    <>
      <Stack.Screen 
        options={{
          headerShown: false,
        }}
      />
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        {/* 헤더 */}
        <View style={[styles.header, { 
          backgroundColor: colors.cardBackground,
          borderBottomColor: colors.border
        }]}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={handleBack}
          >
            <Ionicons name="chevron-back" size={24} color={colors.text.primary} />
            <Text style={[styles.headerTitle, { color: colors.text.primary }]}>뒤로</Text>
          </TouchableOpacity>
          <Text style={[styles.headerText, { color: colors.text.primary }]}>운동 기록</Text>
          <View style={styles.headerRight} />
        </View>

        {/* 상단 정보 패널 */}
        <View style={[styles.statsPanel, { backgroundColor: colors.cardBackground }]}>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: colors.text.primary }]}>
              {formatTime(runningState.elapsed)}
            </Text>
            <Text style={[styles.statLabel, { color: colors.text.secondary }]}>시간 (분:초)</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: colors.text.primary }]}>
              {Math.round(runningState.totalDistance)} m
            </Text>
            <Text style={[styles.statLabel, { color: colors.text.secondary }]}>거리</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: colors.text.primary }]}>
              {runningState.totalDistance > 0 && runningState.elapsed > 0 ? (runningState.totalDistance / runningState.elapsed).toFixed(1) : '0.0'} m/s
            </Text>
            <Text style={[styles.statLabel, { color: colors.text.secondary }]}>평균 속도</Text>
          </View>
        </View>

        {/* 지도 */}
        <View style={styles.mapContainer}>
          <MapView
            ref={mapRef}
            style={styles.map}
            initialRegion={{
              ...runningState.currentLocation,
              latitudeDelta: 0.005,
              longitudeDelta: 0.005,
            }}
            showsUserLocation={!runningState.isTestMode}
            followsUserLocation={!runningState.isTestMode}
            showsMyLocationButton={!runningState.isTestMode}
            showsCompass={true}
          >
            {runningState.coordinates.length > 1 && (
              <>
                <Polyline
                  coordinates={runningState.coordinates}
                  strokeColor={colors.primary}
                  strokeWidth={6}
                  lineDashPattern={[0]}
                />
                <Marker
                  coordinate={runningState.coordinates[0]}
                  title="시작 지점"
                  pinColor="green"
                />
                {runningState.isTestMode && (
                  <Marker
                    coordinate={runningState.currentLocation}
                    title="현재 위치"
                    pinColor="red"
                  />
                )}
              </>
            )}
          </MapView>
        </View>

        <View style={[styles.buttonContainer, { backgroundColor: colors.cardBackground }]}>
          {!runningState.isRunning ? (
            <IconButton onPress={startTracking} icons={"play"} colors={colors} buttonText={"시작하기"} disabled={isInitializing} />
          ) : (
            <IconButton onPress={handleStopRunning} icons={"stop"} colors={colors} buttonText={"종료하기"}/>
          )}
        </View>
      </View>
      <SaveRunningModal
        isVisible={runningState.isSaveModalVisible}
        onClose={() => setRunningState(prev => ({ ...prev, isSaveModalVisible: false }))}
        onSave={handleSaveRunning}
        onDelete={handleDelete}
        distance={runningState.totalDistance}
        time={runningState.elapsed}
        averageSpeed={runningState.averageSpeed}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    paddingBottom: 10,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'transparent',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 16,
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerRight: {
    width: 60,
  },
  statsPanel: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  statLabel: {
    fontSize: 14,
    marginTop: 4,
    textAlign: 'center',
  },
  mapContainer: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  buttonContainer: {
    padding: 20,
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
    flexDirection: 'row',
  },
  buttonBox: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    padding: 20
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 10,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
}); 