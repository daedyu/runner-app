import React, { useState } from 'react';
import { 
  Modal, 
  StyleSheet, 
  View, 
  TouchableOpacity, 
  TextInput,
  TouchableWithoutFeedback,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { Text } from '@/components/Themed';
import { useColorScheme } from 'react-native';
import { getThemeColors } from '@/assets/theme/colors';

interface SaveRunningModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSave: (title: string) => void;
  onDelete: () => void;
  distance: number;
  time: number;
  averageSpeed: number;
}

export default function SaveRunningModal({
  isVisible,
  onClose,
  onSave,
  onDelete,
  distance,
  time,
  averageSpeed,
}: SaveRunningModalProps) {
  const [title, setTitle] = useState('');
  const colorScheme = useColorScheme();
  const colors = getThemeColors(colorScheme === 'dark');

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}분 ${secs}초`;
  };

  const handleModalPress = (e: any) => {
    e.stopPropagation();
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.keyboardView}
          >
            <TouchableWithoutFeedback onPress={handleModalPress}>
              <View style={[styles.modalView, { backgroundColor: colors.cardBackground }]}>
                <Text style={[styles.modalTitle, { color: colors.text.primary }]}>
                  운동 기록 저장
                </Text>
                
                <View style={styles.statsContainer}>
                  <View style={styles.statRow}>
                    <Text style={[styles.statLabel, { color: colors.text.secondary }]}>
                      총 거리
                    </Text>
                    <Text style={[styles.statValue, { color: colors.text.primary }]}>
                      {(distance / 1000).toFixed(2)}km
                    </Text>
                  </View>
                  <View style={styles.statRow}>
                    <Text style={[styles.statLabel, { color: colors.text.secondary }]}>
                      운동 시간
                    </Text>
                    <Text style={[styles.statValue, { color: colors.text.primary }]}>
                      {formatTime(time)}
                    </Text>
                  </View>
                  <View style={styles.statRow}>
                    <Text style={[styles.statLabel, { color: colors.text.secondary }]}>
                      평균 속도
                    </Text>
                    <Text style={[styles.statValue, { color: colors.text.primary }]}>
                      {(averageSpeed * 3.6).toFixed(1)}km/h
                    </Text>
                  </View>
                </View>

                <TextInput
                  style={[styles.input, { 
                    backgroundColor: colors.background,
                    color: colors.text.primary,
                    borderColor: colors.border
                  }]}
                  placeholder="운동 제목"
                  placeholderTextColor={colors.text.secondary}
                  value={title}
                  onChangeText={setTitle}
                />

                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    style={[styles.button, styles.deleteButton, { borderColor: colors.error }]}
                    onPress={onDelete}
                  >
                    <Text style={[styles.buttonText, { color: colors.error }]}>삭제</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.button, styles.saveButton, { backgroundColor: colors.primary }]}
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
    width: '85%',
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
    marginBottom: 20,
  },
  statsContainer: {
    width: '100%',
    marginBottom: 20,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  statLabel: {
    fontSize: 16,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  input: {
    width: '100%',
    padding: 15,
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 20,
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: 10,
  },
  button: {
    flex: 1,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteButton: {
    borderWidth: 1,
  },
  saveButton: {
    elevation: 2,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 