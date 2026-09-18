import ImageViewer from "@/components/ImageViewer";
import { StyleSheet, View } from "react-native";


const PlaceholderImage = require("@/assets/images/background-image.png");
export default function Index() {
  return (
    <View
      style={styles.container}
    >
     <View style={styles.imageContainer}>
      <ImageViewer imageSource={PlaceholderImage} />
     </View>
      
    </View>
  );
}

const styles = StyleSheet.create({
  container:{
    backgroundColor: "#25292e",
    flex: 1,
    alignItems: "center",
  },
  text:{
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  imageContainer:{
    flex: 1,
   
  },
  
})
