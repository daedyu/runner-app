import React, { useState } from 'react';
import { 
  Modal, 
  StyleSheet, 
  View, 
  TouchableOpacity, 
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { Text } from '@/components/Themed';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from 'react-native';
import { getThemeColors } from '@/assets/theme/colors';

interface SaveRunningModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSave: (title: string) => void;
  distance: number;
  time: number;
  averageSpeed: number;
}

export default function SaveRunningModal({
  isVisible,
  onClose,
  onSave,
  distance,
  time,
  averageSpeed,
}: SaveRunningModalProps) {
  const [title, setTitle] = useState('');
  const colorScheme = useColorScheme();
  const colors = getThemeColors(colorScheme === 'dark');

  const handleSave = () => {
    if (title.trim()) {
      onSave(title);
      setTitle('');
    }
  };

  const handleOverlayPress = () => {
    onClose();
  };

  const handleModalPress = (e: any) => {
    e.stopPropagation();
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={handleOverlayPress}>
        <View style={styles.overlay}>
          <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.keyboardView}
          >
            <TouchableWithoutFeedback onPress={handleModalPress}>
              <View style={[styles.modalView, { backgroundColor: colors.cardBackground }]}>
                <Text style={[styles.modalTitle, { color: colors.text.primary }]}>운동 저장하기</Text>
                
                <View style={styles.statsContainer}>
                  <View style={styles.statItem}>
                    <Text style={[styles.statLabel, { color: colors.text.secondary }]}>거리</Text>
                    <Text style={[styles.statValue, { color: colors.text.primary }]}>
                      {Math.round(distance)}m
                    </Text>
                  </View>
                  <View style={styles.statItem}>
                    <Text style={[styles.statLabel, { color: colors.text.secondary }]}>시간</Text>
                    <Text style={[styles.statValue, { color: colors.text.primary }]}>
                      {Math.floor(time / 60)}:{(time % 60).toString().padStart(2, '0')}
                    </Text>
                  </View>
                  <View style={styles.statItem}>
                    <Text style={[styles.statLabel, { color: colors.text.secondary }]}>평균 속도</Text>
                    <Text style={[styles.statValue, { color: colors.text.primary }]}>
                      {averageSpeed.toFixed(1)}m/s
                    </Text>
                  </View>
                </View>

                <TextInput
                  style={[styles.input, { 
                    backgroundColor: colors.background,
                    color: colors.text.primary,
                    borderColor: colors.border
                  }]}
                  placeholder="운동 제목을 입력하세요"
                  placeholderTextColor={colors.text.secondary}
                  value={title}
                  onChangeText={setTitle}
                />

                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    style={[styles.button, { backgroundColor: colors.primary }]}
                    onPress={onClose}
                  >
                    <Text style={[styles.buttonText, { color: colors.text.primary }]}>취소</Text>

                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.button, { backgroundColor: colors.primary }]}
                    onPress={() => onSave(title)}
                  >
                    <Text style={[styles.buttonText, { color: colors.text.inverse }]}>저장</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </KeyboardAvoidingView>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  keyboardView: {
    width: '100%',
    alignItems: 'center',
  },
  modalView: {
    width: '80%',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  statsContainer: {
    width: '100%',
    marginBottom: 20,
  },
  statItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 16,
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  input: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 20,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    minWidth: 100,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 