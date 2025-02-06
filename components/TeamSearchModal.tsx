import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Modal, 
  TouchableOpacity, 
  TextInput,
  FlatList,
  Dimensions,
  TouchableWithoutFeedback,
  Keyboard,
  Animated,
  Image
} from 'react-native';
import { Text } from '@/components/Themed';
import { getThemeColors } from '@/assets/theme/colors';
import { useColorScheme } from 'react-native';
import { Search, X } from 'lucide-react-native';

const SCREEN_HEIGHT = Dimensions.get('window').height;

interface TeamSearchModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSelect: (teamId: string) => void;
}

interface Team {
  id: string;
  name: string;
  memberCount: number;
  description: string;
  imageUrl: string;
}

// 임시 데이터
const DUMMY_TEAMS: Team[] = [
  {
    id: '1',
    name: '달리기 크루',
    memberCount: 8,
    description: '매일 아침 달리기 하는 모임입니다.',
    imageUrl: 'https://picsum.photos/200',
  },
  {
    id: '2',
    name: '마라톤 준비팀',
    memberCount: 12,
    description: '대구 국제마라톤 준비하는 팀입니다.',
    imageUrl: 'https://picsum.photos/201',
  },
  {
    id: '3',
    name: '조깅 러버',
    memberCount: 5,
    description: '가볍게 조깅하면서 건강을 챙기는 모임입니다.',
    imageUrl: 'https://picsum.photos/202',
  },
];

export default function TeamSearchModal({ 
  isVisible, 
  onClose, 
  onSelect 
}: TeamSearchModalProps) {
  const colorScheme = useColorScheme();
  const colors = getThemeColors(colorScheme === 'dark');
  
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState(DUMMY_TEAMS);
  const overlayOpacity = new Animated.Value(0);
  const modalPosition = new Animated.Value(SCREEN_HEIGHT);

  useEffect(() => {
    if (isVisible) {
      Animated.parallel([
        Animated.timing(overlayOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(modalPosition, {
          toValue: 0,
          damping: 500,
          mass: 3,
          stiffness: 1000,
          useNativeDriver: true,
        })
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(overlayOpacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(modalPosition, {
          toValue: SCREEN_HEIGHT,
          damping: 500,
          mass: 3,
          stiffness: 1000,
          useNativeDriver: true,
        })
      ]).start();
    }
  }, [isVisible]);

  const handleSearch = (text: string) => {
    setSearchText(text);
    const filtered = DUMMY_TEAMS.filter(team => 
      team.name.toLowerCase().includes(text.toLowerCase()) ||
      team.description.toLowerCase().includes(text.toLowerCase())
    );
    setSearchResults(filtered);
  };

  const handleSelect = (teamId: string) => {
    onSelect(teamId);
    onClose();
    setSearchText('');
  };

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="none"
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <Animated.View 
            style={[
              styles.modalOverlay,
              { opacity: overlayOpacity }
            ]}
          >
            <TouchableWithoutFeedback onPress={onClose}>
              <View style={styles.overlayTouchable} />
            </TouchableWithoutFeedback>
          </Animated.View>
          
          <Animated.View 
            style={[
              styles.modalContent,
              { 
                backgroundColor: colors.cardBackground,
                transform: [{ translateY: modalPosition }]
              }
            ]}
          >
            <View style={styles.header}>
              <Text style={[styles.title, { color: colors.text.primary }]}>
                팀 찾기
              </Text>
              <TouchableOpacity 
                onPress={onClose}
                style={styles.closeButton}
              >
                <X size={24} color={colors.text.primary} />
              </TouchableOpacity>
            </View>

            <View style={[styles.searchContainer, { backgroundColor: colors.background }]}>
              <Search size={20} color={colors.text.secondary} />
              <TextInput
                style={[styles.searchInput, { color: colors.text.primary }]}
                value={searchText}
                onChangeText={handleSearch}
                placeholder="팀 이름이나 설명을 검색하세요"
                placeholderTextColor={colors.text.secondary}
              />
            </View>

            <FlatList
              data={searchResults}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.teamItem, { borderBottomColor: colors.border }]}
                  onPress={() => handleSelect(item.id)}
                >
                  <Image 
                    source={{ uri: item.imageUrl }} 
                    style={styles.teamImage}
                  />
                  <View style={styles.teamInfo}>
                    <View style={styles.teamHeader}>
                      <Text style={[styles.teamName, { color: colors.text.primary }]}>
                        {item.name}
                      </Text>
                      <Text style={[styles.memberCount, { color: colors.text.secondary }]}>
                        멤버 {item.memberCount}명
                      </Text>
                    </View>
                    <Text 
                      style={[styles.teamDescription, { color: colors.text.secondary }]}
                      numberOfLines={2}
                    >
                      {item.description}
                    </Text>
                  </View>
                </TouchableOpacity>
              )}
              style={styles.teamList}
            />
          </Animated.View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  modalOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  overlayTouchable: {
    flex: 1,
  },
  modalContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: SCREEN_HEIGHT * 0.7,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  closeButton: {
    padding: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    height: 44,
    borderRadius: 8,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
  },
  teamList: {
    flex: 1,
  },
  teamItem: {
    flexDirection: 'row',
    padding: 12,
    borderBottomWidth: 1,
    gap: 12,
  },
  teamImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  teamInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  teamHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  teamName: {
    fontSize: 16,
    fontWeight: '600',
  },
  memberCount: {
    fontSize: 12,
  },
  teamDescription: {
    fontSize: 14,
    lineHeight: 18,
  },
}); 