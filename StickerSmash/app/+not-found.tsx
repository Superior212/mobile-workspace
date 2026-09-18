import { Link, Stack } from 'expo-router'
import { StyleSheet, Text, View } from 'react-native'


export default function NotFound() {
  return (
    <>
    <Stack.Screen options={{ title: "Not Found", headerShown: false }} />
    <View style={styles.container}>
      <Text style={styles.text}>Not Found</Text>
      <Link  href="/" style={styles.button}>Home</Link>
    </View>
    </>
  )
}

const styles = StyleSheet.create({
  container:{
    backgroundColor: "#25292e",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text:{
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  button:{
    backgroundColor: "white",
    color: "black",
    fontSize: 20,
    fontWeight: "bold",
    padding: 10,
    borderRadius: 5,
  }
})