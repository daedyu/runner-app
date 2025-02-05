import { StyleSheet, View } from 'react-native';
import { Text } from '@/components/Themed';

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>내정보</Text>
      <View style={styles.separator} />
      <Text>사용자 프로필 정보가 이곳에 표시됩니다.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
    backgroundColor: '#eee',
  },
}); 