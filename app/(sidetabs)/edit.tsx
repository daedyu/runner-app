import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, ScrollView, Platform, ActionSheetIOS } from 'react-native';
import { Text } from '@/components/Themed';
import { useColorScheme } from 'react-native';
import { getThemeColors } from '@/assets/theme/colors';
import SafeContainer from '@/components/common/SafeContainer';
import { Stack, router } from 'expo-router';
import { TextInput } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import SchoolSearchModal from "@/components/SchoolSearchModal";
import {SchoolResponse} from "@/types/school/school.types";

export default function EditProfileScreen() {
  const colorScheme = useColorScheme();
  const colors = getThemeColors(colorScheme === 'dark');

  const [originalValues] = useState({
    name: '김민규',
    grade: '2',
    school: {
      id: 1,
      name: '대구소프트웨어마이스터고등학교',
      location: '',
      website: '',
      grade: 3
    }
  });
  
  const [name, setName] = useState(originalValues.name);
  const [grade, setGrade] = useState(originalValues.grade);
  const [school, setSchool] = useState<SchoolResponse>(originalValues.school);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isSchoolModalVisible, setIsSchoolModalVisible] = useState(false);

  const isChanged = name !== originalValues.name || 
                   grade !== originalValues.grade || 
                   school !== originalValues.school ||
                   (currentPassword !== '' && newPassword !== '');

  const handleSave = () => {
    if (!isChanged) return;
    
    if (newPassword && !currentPassword) {
      alert('현재 비밀번호를 입력해주세요.');
      return;
    }

    if (currentPassword && !newPassword) {
      alert('새 비밀번호를 입력해주세요.');
      return;
    }

    // TODO: 서버에 변경사항 저장 로직 구현
    router.back();
  };

  const showGradePicker = () => {
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ['취소', '1학년', '2학년', '3학년', '4학년'],
          cancelButtonIndex: 0,
          title: '학년 선택',
        },
        (buttonIndex) => {
          if (buttonIndex > 0) {
            setGrade(buttonIndex.toString());
          }
        }
      );
    }
  };

  const renderGradePicker = () => {
    if (Platform.OS === 'ios') {
      return (
        <TouchableOpacity
          style={[
            styles.input,
            {
              borderColor: colors.border,
              justifyContent: 'center'
            }
          ]}
          onPress={showGradePicker}
        >
          <Text style={{ color: colors.text.primary }}>{grade}학년</Text>
        </TouchableOpacity>
      );
    }

    return (
      <View 
        style={[
          styles.input,
          { 
            padding: 0,
            borderColor: colors.border
          }
        ]}
      >
        <Picker
          selectedValue={grade}
          onValueChange={(itemValue) => setGrade(itemValue)}
          style={{ 
            color: colors.text.primary,
            height: 44,
            width: '100%',
          }}
          dropdownIconColor={colors.text.primary}
        >
          <Picker.Item label="1학년" value="1" />
          <Picker.Item label="2학년" value="2" />
          <Picker.Item label="3학년" value="3" />
          <Picker.Item label="4학년" value="4" />
        </Picker>
      </View>
    );
  };

  return (
    <SafeContainer>
      <Stack.Screen
        options={{
          title: '내 정보 수정',
          headerShown: true,
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <Text>뒤로</Text>
            </TouchableOpacity>
          )
        }}
      />
      
      <ScrollView style={styles.container}>
        <View style={[styles.card, { backgroundColor: colors.cardBackground }]}>
          <View style={styles.section}>
            <Text style={[styles.label, { color: colors.text.secondary }]}>이름</Text>
            <TextInput
              style={[styles.input, { 
                color: colors.text.primary,
                borderColor: colors.border,
              }]}
              value={name}
              onChangeText={setName}
              placeholder="이름을 입력하세요"
              placeholderTextColor={colors.text.secondary}
            />
          </View>

          <View style={styles.section}>
            <Text style={[styles.label, { color: colors.text.secondary }]}>학교</Text>
            <TouchableOpacity
              style={[styles.input, { 
                borderColor: colors.border,
                justifyContent: 'center'
              }]}
              onPress={() => setIsSchoolModalVisible(true)}
            >
              <Text style={{ color: colors.text.primary }}>
                {school.name || '학교를 선택하세요'}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.section}>
            <Text style={[styles.label, { color: colors.text.secondary }]}>학년</Text>
            {renderGradePicker()}
          </View>
        </View>

        <View style={[styles.card, { backgroundColor: colors.cardBackground, marginTop: 16 }]}>
          <View style={styles.section}>
            <Text style={[styles.label, { color: colors.text.secondary }]}>현재 비밀번호</Text>
            <TextInput
              style={[styles.input, { 
                color: colors.text.primary,
                borderColor: colors.border,
              }]}
              value={currentPassword}
              onChangeText={setCurrentPassword}
              secureTextEntry
              placeholder="현재 비밀번호를 입력하세요"
              placeholderTextColor={colors.text.secondary}
            />
          </View>

          <View style={[styles.section, { marginBottom: 0 }]}>
            <Text style={[styles.label, { color: colors.text.secondary }]}>새 비밀번호</Text>
            <TextInput
              style={[styles.input, { 
                color: colors.text.primary,
                borderColor: colors.border,
              }]}
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry
              placeholder="새 비밀번호를 입력하세요"
              placeholderTextColor={colors.text.secondary}
            />
          </View>
        </View>
      </ScrollView>

      <SchoolSearchModal
        isVisible={isSchoolModalVisible}
        onClose={() => setIsSchoolModalVisible(false)}
        onSelect={setSchool}
      />

      <View style={styles.bottomContainer}>
        <TouchableOpacity 
          style={[
            styles.saveButton,
            { 
              backgroundColor: isChanged ? colors.primary : colors.border,
              opacity: isChanged ? 1 : 0.5
            }
          ]}
          onPress={handleSave}
          disabled={!isChanged}
        >
          <Text style={[styles.saveButtonText, { color: colors.text.inverse }]}>
            변경사항 저장
          </Text>
        </TouchableOpacity>
      </View>
    </SafeContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  card: {
    borderRadius: 12,
    padding: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  section: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    width: '100%',
    height: 44,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    borderWidth: 1,
  },
  bottomContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  saveButton: {
    width: '100%',
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
}); 