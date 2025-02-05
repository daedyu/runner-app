import React, { useState } from 'react';
import { Modal, View, TextInput, TouchableOpacity, StyleSheet, Platform } from 'react-native';
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

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={[styles.modalView, { backgroundColor: colors.cardBackground }]}>
          <Text style={[styles.modalTitle, { color: colors.text.primary }]}>운동 저장하기</Text>
          
          <View style={styles.statsContainer}>
            <Text style={[styles.statsText, { color: colors.text.secondary }]}>
              거리: {Math.round(distance)}m
            </Text>
            <Text style={[styles.statsText, { color: colors.text.secondary }]}>
              시간: {Math.floor(time / 60)}분 {time % 60}초
            </Text>
            <Text style={[styles.statsText, { color: colors.text.secondary }]}>
              평균 속도: {averageSpeed.toFixed(1)}m/s
            </Text>
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
              onPress={handleSave}
            >
              <Ionicons name="save" size={20} color={colors.text.inverse} />
              <Text style={[styles.buttonText, { color: colors.text.inverse }]}>저장</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: colors.primary }]}
              onPress={onClose}
            >
              <Ionicons name="close" size={20} color={colors.text.inverse} />
              <Text style={[styles.buttonText, { color: colors.text.inverse }]}>취소</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
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
  statsText: {
    fontSize: 16,
    marginBottom: 5,
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
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 10,
    minWidth: 100,
    justifyContent: 'center',
  },
  buttonText: {
    marginLeft: 5,
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 