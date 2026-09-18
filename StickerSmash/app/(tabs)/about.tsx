import { Link } from 'expo-router'
import { StyleSheet, Text, View } from 'react-native'


const about = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>about</Text>
     
    </View>
  )
}

export default about

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

})