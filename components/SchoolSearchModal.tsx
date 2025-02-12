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
  Animated
} from 'react-native';
import { Text } from '@/components/Themed';
import { getThemeColors } from '@/assets/theme/colors';
import { useColorScheme } from 'react-native';
import { Search, X } from 'lucide-react-native';

const SCREEN_HEIGHT = Dimensions.get('window').height;

interface SchoolSearchModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSelect: (school: string) => void;
}

const DUMMY_SCHOOLS = [
  '대구소프트웨어마이스터고등학교',
  '광주소프트웨어마이스터고등학교',
  '대전소프트웨어마이스터고등학교',
  '부산소프트웨어마이스터고등학교',
  '울산소프트웨어마이스터고등학교',
  '경남소프트웨어마이스터고등학교',
  '경북소프트웨어마이스터고등학교',
  '전남소프트웨어마이스터고등학교',
  '전북소프트웨어마이스터고등학교',
  
];

export default function SchoolSearchModal({ 
  isVisible, 
  onClose, 
  onSelect 
}: SchoolSearchModalProps) {
  const colorScheme = useColorScheme();
  const colors = getThemeColors(colorScheme === 'dark');
  
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState(DUMMY_SCHOOLS);
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
    // 실제로는 API 호출로 대체되어야 함
    const filtered = DUMMY_SCHOOLS.filter(school => 
      school.toLowerCase().includes(text.toLowerCase())
    );
    setSearchResults(filtered);
  };

  const handleSelect = (school: string) => {
    onSelect(school);
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
              {
                opacity: overlayOpacity,
              }
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
                학교 검색
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
                placeholder="학교명을 입력하세요"
                placeholderTextColor={colors.text.secondary}
              />
            </View>

            <FlatList
              data={searchResults}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.schoolItem, { borderBottomColor: colors.border }]}
                  onPress={() => handleSelect(item)}
                >
                  <Text style={{ color: colors.text.primary }}>{item}</Text>
                </TouchableOpacity>
              )}
              style={styles.schoolList}
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
  schoolList: {
    flex: 1,
  },
  schoolItem: {
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
}); 