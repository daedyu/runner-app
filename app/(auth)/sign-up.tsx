import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { Text } from '@/components/Themed';
import { useColorScheme } from 'react-native';
import { getThemeColors } from '@/assets/theme/colors';
import SafeContainer from '@/components/common/SafeContainer';
import { router } from 'expo-router';
import { useSignUp } from '@/hooks/auth/UseSignUp';

export default function SignUpScreen() {
  const colorScheme = useColorScheme();
  const colors = getThemeColors(colorScheme === 'dark');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  
  const { signUp, isLoading, error } = useSignUp();

  const handleSignUp = async () => {
    if (password !== confirmPassword) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }

    try {
      await signUp({ email, password, name });
      router.replace('/(tabs)');
    } catch (error) {
      console.error('회원가입 실패:', error);
    }
  };

  return (
    <SafeContainer>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <View style={styles.content}>
          <Text style={[styles.title, { color: colors.text.primary }]}>
            회원가입
          </Text>

          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: colors.text.secondary }]}>
                이름
              </Text>
              <TextInput
                style={[styles.input, { 
                  color: colors.text.primary,
                  borderColor: colors.border,
                  backgroundColor: colors.cardBackground,
                }]}
                value={name}
                onChangeText={setName}
                placeholder="이름을 입력하세요"
                placeholderTextColor={colors.text.secondary}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: colors.text.secondary }]}>
                이메일
              </Text>
              <TextInput
                style={[styles.input, { 
                  color: colors.text.primary,
                  borderColor: colors.border,
                  backgroundColor: colors.cardBackground,
                }]}
                value={email}
                onChangeText={setEmail}
                placeholder="이메일을 입력하세요"
                placeholderTextColor={colors.text.secondary}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: colors.text.secondary }]}>
                비밀번호
              </Text>
              <TextInput
                style={[styles.input, { 
                  color: colors.text.primary,
                  borderColor: colors.border,
                  backgroundColor: colors.cardBackground,
                }]}
                value={password}
                onChangeText={setPassword}
                placeholder="비밀번호를 입력하세요"
                placeholderTextColor={colors.text.secondary}
                secureTextEntry
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: colors.text.secondary }]}>
                비밀번호 확인
              </Text>
              <TextInput
                style={[styles.input, { 
                  color: colors.text.primary,
                  borderColor: colors.border,
                  backgroundColor: colors.cardBackground,
                }]}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="비밀번호를 다시 입력하세요"
                placeholderTextColor={colors.text.secondary}
                secureTextEntry
              />
            </View>

            {error && (
              <Text style={[styles.errorText, { color: colors.error }]}>
                {error}
              </Text>
            )}

            <TouchableOpacity
              style={[
                styles.signUpButton,
                { 
                  backgroundColor: colors.primary,
                  opacity: isLoading ? 0.7 : 1
                }
              ]}
              onPress={handleSignUp}
              disabled={isLoading}
            >
              <Text style={[styles.signUpButtonText, { color: colors.text.inverse }]}>
                {isLoading ? '가입 중...' : '가입하기'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.signInButton}
              onPress={() => router.back()}
            >
              <Text style={[styles.signInButtonText, { color: colors.text.secondary }]}>
                이미 계정이 있으신가요? 로그인
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 32,
    textAlign: 'center',
  },
  form: {
    gap: 16,
  },
  inputContainer: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  errorText: {
    fontSize: 14,
    textAlign: 'center',
  },
  signUpButton: {
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  signUpButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  signInButton: {
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  signInButtonText: {
    fontSize: 14,
  },
}); 