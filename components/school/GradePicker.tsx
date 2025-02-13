import React, { useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Modal, 
  TouchableOpacity, 
  Dimensions, 
  TouchableWithoutFeedback, 
  Animated,
  Platform 
} from 'react-native';
import { Text } from '@/components/Themed';
import { getThemeColors } from '@/assets/theme/colors';
import { useColorScheme } from 'react-native';
import { X } from 'lucide-react-native';
import { Picker } from '@react-native-picker/picker';

const SCREEN_HEIGHT = Dimensions.get('window').height;

interface GradePickerProps {
  isVisible: boolean;
  onClose: () => void;
  onSelect: (grade: number) => void;
  selectedGrade: number;
  maxGrade: number;
}

export default function GradePicker({ 
  isVisible, 
  onClose, 
  onSelect,
  selectedGrade,
  maxGrade 
}: GradePickerProps) {
  const colorScheme = useColorScheme();
  const colors = getThemeColors(colorScheme === 'dark');
  const overlayOpacity = new Animated.Value(0);
  const modalPosition = new Animated.Value(SCREEN_HEIGHT);

  const grades = Array.from({ length: maxGrade }, (_, i) => i + 1);

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

  const handleSelect = (grade: string) => {
    if (onSelect) {
      onSelect(Number(grade));
    }
  };

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="none"
    >
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
              학년 선택
            </Text>
            <TouchableOpacity
              onPress={onClose}
              style={styles.closeButton}
            >
              <X size={24} color={colors.text.primary} />
            </TouchableOpacity>
          </View>
          <Picker
            selectedValue={String(selectedGrade)}
            onValueChange={handleSelect}
            style={[
              styles.picker,
              { color: colors.text.primary }
            ]}
          >
            {grades.map((grade) => (
              <Picker.Item
                key={grade}
                label={`${grade}학년`}
                value={String(grade)}
                color={colors.text.primary}
              />
            ))}
          </Picker>
        </Animated.View>
      </View>
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
    height: Platform.OS === 'ios' ? 300 : 200,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  closeButton: {
    padding: 4,
  },
  pickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  pickerButton: {
    fontSize: 16,
    fontWeight: '500',
  },
  picker: {
    flex: 1,
  },
});