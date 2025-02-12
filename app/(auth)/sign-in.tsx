import React from 'react';
import { StyleSheet, View, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { Text } from '@/components/Themed';
import { useColorScheme } from 'react-native';
import { getThemeColors } from '@/assets/theme/colors';
import SafeContainer from '@/components/common/SafeContainer';
import { router } from 'expo-router';
import useSignIn from '@/hooks/auth/UseSignIn';

export default function SignInScreen() {
  const colorScheme = useColorScheme();
  const colors = getThemeColors(colorScheme === 'dark');
  const {
    signInData,
    submit,
    loading,
    setEmail,
    setPassword,
  } = useSignIn();

  return (
    <SafeContainer>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <View style={styles.content}>
          <Text style={[styles.title, { color: colors.text.primary }]}>
            로그인
          </Text>

          <View style={styles.form}>
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
                value={signInData.email}
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
                value={signInData.password}
                onChangeText={setPassword}
                placeholder="비밀번호를 입력하세요"
                placeholderTextColor={colors.text.secondary}
                secureTextEntry
              />
            </View>
            <TouchableOpacity
              style={[
                styles.signInButton,
                { 
                  backgroundColor: colors.primary,
                  opacity: loading ? 0.7 : 1
                }
              ]}
              onPress={submit}
              disabled={loading}
            >
              <Text style={[styles.signInButtonText, { color: colors.text.inverse }]}>
                {loading ? '로그인 중...' : '로그인'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.signUpButton}
              onPress={() => router.push('/(auth)/sign-up')}
            >
              <Text style={[styles.signUpButtonText, { color: colors.text.secondary }]}>
                계정이 없으신가요? 회원가입
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
  signInButton: {
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  signInButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  signUpButton: {
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  signUpButtonText: {
    fontSize: 14,
  },
}); 