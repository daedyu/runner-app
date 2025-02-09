import { StyleSheet, View, Dimensions, TouchableOpacity, useColorScheme } from 'react-native';
import { Text } from '@/components/Themed';
import MapView from 'react-native-maps';
import * as Progress from 'react-native-progress';
import { Ionicons } from '@expo/vector-icons';
import { getThemeColors } from '@/assets/theme/colors';
import SafeContainer from '@/components/common/SafeContainer';
import { useState, useEffect, useRef } from 'react';
import * as Location from 'expo-location';
import { router } from 'expo-router';

const SCREEN_WIDTH = Dimensions.get('window').width;

interface LocationType {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const colors = getThemeColors(colorScheme === 'dark');
  const [location, setLocation] = useState<LocationType | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const mapRef = useRef<MapView>(null);

  useEffect(() => {
    let locationSubscription: any;

    const getLocation = async () => {
      try {
        // 위치 권한 요청
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setErrorMsg('위치 권한이 거부되었습니다.');
          return;
        }

        // 마지막 알려진 위치를 먼저 가져옴 (빠른 초기 위치)
        const lastKnownPosition = await Location.getLastKnownPositionAsync({});
        if (lastKnownPosition) {
          setLocation({
            latitude: lastKnownPosition.coords.latitude,
            longitude: lastKnownPosition.coords.longitude,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          });
        }

        // 실시간 위치 업데이트 구독
        locationSubscription = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.Balanced,
            timeInterval: 1000,
            distanceInterval: 1,
          },
          (currentLocation) => {
            const newLocation = {
              latitude: currentLocation.coords.latitude,
              longitude: currentLocation.coords.longitude,
              latitudeDelta: 0.005,
              longitudeDelta: 0.005,
            };
            setLocation(newLocation);
            
            // 지도 중심 이동
            mapRef.current?.animateToRegion(newLocation, 1000);
          }
        );
      } catch (error) {
        setErrorMsg('위치를 가져올 수 없습니다.');
      }
    };

    getLocation();

    // 컴포넌트 언마운트 시 구독 해제
    return () => {
      if (locationSubscription) {
        locationSubscription.remove();
      }
    };
  }, []);

  return (
    <SafeContainer>
      <View style={[
        styles.measureWidget,
        {
          backgroundColor: colors.cardBackground,
          shadowColor: colors.shadow
        }
      ]}>
        <Text style={[styles.widgetTitle, {color: colors.text.primary}]}>측정하기</Text>
        <View style={styles.mapContainer}>
          {errorMsg ? (
            <Text style={styles.errorText}>{errorMsg}</Text>
          ) : location ? (
            <MapView
              ref={mapRef}
              style={styles.map}
              initialRegion={location}
              showsUserLocation={true}
              showsMyLocationButton={true}
              followsUserLocation={true}
            />
          ) : (
            <Text style={[styles.loadingText, {color: colors.text.secondary}]}>위치를 가져오는 중...</Text>
          )}
        </View>
        <TouchableOpacity 
          style={[styles.startButton, {backgroundColor: colors.primary}]}
          onPress={() => router.push('/running')}
        >
          <Ionicons name="play" size={24} color={colors.text.inverse} />
          <Text style={[styles.buttonText, {color: colors.text.inverse}]}>달리기 시작</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity 
        style={[styles.goalWidget, {backgroundColor: colors.cardBackground, shadowColor: colors.shadow}]}
        onPress={() => router.push('/stats')}
      >
        <Text style={styles.widgetTitle}>이번 달 목표 달성률</Text>
        <View style={styles.goalStats}>
          <View style={styles.goalItem}>
            <Text style={[styles.goalLabel, {color: colors.text.secondary}]}>거리</Text>
            <Progress.Bar 
              progress={0.7} 
              width={SCREEN_WIDTH * 0.7} 
              height={15}
              color={colors.progress.fill}
              unfilledColor={colors.progress.background}
              borderWidth={0}
            />
            <Text style={styles.goalText}>70% (35/50km)</Text>
          </View>
          <View style={styles.goalItem}>
            <Text style={[styles.goalLabel, {color: colors.text.secondary}]}>시간</Text>
            <Progress.Bar 
              progress={0.5} 
              width={SCREEN_WIDTH * 0.7} 
              height={15}
              color={colors.progress.fill}
              unfilledColor={colors.progress.background}
              borderWidth={0}
            />
            <Text style={[styles.goalText, {color: colors.text.secondary}]}>50% (5/10시간)</Text>
          </View>
        </View>
      </TouchableOpacity>
    </SafeContainer>
  );
}

const styles = StyleSheet.create({
  measureWidget: {
    borderRadius: 15,
    padding: 16,
    marginBottom: 16,
    elevation: 3,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  widgetTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  mapContainer: {
    height: 200,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 10,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  goalWidget: {
    borderRadius: 15,
    padding: 16,
    elevation: 3,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  goalStats: {
    gap: 16,
  },
  goalItem: {
    gap: 8,
  },
  goalLabel: {
    fontSize: 14
  },
  goalText: {
    fontSize: 14,
    textAlign: 'right',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    padding: 10,
  },
  loadingText: {
    textAlign: 'center',
    padding: 10,
  }
});