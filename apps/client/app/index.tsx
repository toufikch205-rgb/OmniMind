import { StyleSheet, Text, View } from "react-native";

export default function HomeScreen() {
  return <View style={styles.container}>
    <Text style={styles.eyebrow}>OMNIMIND · FOUNDATION</Text>
    <Text style={styles.title}>Your mind,{"\\n"}in one place.</Text>
    <Text style={styles.description}>A calm workspace for planning, knowledge, learning and focused work.</Text>
    <Text style={styles.status}>Foundation workspace initialized</Text>
  </View>;
}

const styles = StyleSheet.create({
  container:{flex:1,justifyContent:"center",alignItems:"flex-start",paddingHorizontal:28,backgroundColor:"#F5F6F4"},
  eyebrow:{color:"#64736B",fontSize:11,fontWeight:"700",letterSpacing:2},
  title:{marginTop:18,color:"#1E293B",fontSize:42,lineHeight:48,fontWeight:"700"},
  description:{maxWidth:420,marginTop:16,color:"#64736B",fontSize:16,lineHeight:25},
  status:{marginTop:32,color:"#496B5A",fontSize:12,fontWeight:"600"}
});
