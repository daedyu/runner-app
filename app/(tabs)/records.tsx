import { StyleSheet, View } from 'react-native';
import { Text } from '@/components/Themed';

export default function RecordsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>달리기기록</Text>
      <View style={styles.separator} />
      <Text>여러분의 달리기 기록이 이곳에 표시됩니다.</Text>
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