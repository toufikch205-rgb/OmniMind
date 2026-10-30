import { Pressable, StyleSheet, Text, View } from "react-native";
import { AppIcon } from "../AppIcon";

const C = { blue: "#397DEB", purple: "#9658E8" };

export function WorkspaceHeader() {
  return (
    <View style={s.header}>
      <Pressable accessibilityRole="button" accessibilityLabel="فتح القائمة" style={s.menuButton}>
        <Text style={s.menuGlyph}>☰</Text>
      </Pressable>
      <View style={s.brandRow}>
        <View style={s.logo}><Text style={s.logoText}>O</Text></View>
        <Text style={s.brand}><Text style={{ color: C.blue }}>Omni</Text><Text style={{ color: C.purple }}>Mind</Text></Text>
      </View>
      <View style={s.headerRight}>
        <View style={s.bellWrap}><AppIcon name="bell" color="#526174" size={23} /><View style={s.notificationDot} /></View>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  header: { height: 66, paddingHorizontal: 18, backgroundColor: "#FFFFFF", borderBottomWidth: 1, borderBottomColor: "#E9EDF3", flexDirection: "row", alignItems: "center", gap: 15 },
  menuButton: { width: 30, height: 38, alignItems: "center", justifyContent: "center" },
  menuGlyph: { color: "#526174", fontSize: 25, fontWeight: "700" },
  brandRow: { flexDirection: "row", alignItems: "center", gap: 5 },
  logo: { width: 30, height: 30, borderRadius: 15, borderWidth: 3, borderColor: "#78A4F5", alignItems: "center", justifyContent: "center" },
  logoText: { color: C.blue, fontSize: 16, fontWeight: "900" },
  brand: { fontSize: 20, fontWeight: "900", letterSpacing: -0.7 },
  headerRight: { marginLeft: "auto", alignItems: "center", justifyContent: "center" },
  bellWrap: { width: 34, height: 38, alignItems: "center", justifyContent: "center" },
  notificationDot: { position: "absolute", top: 6, right: 4, width: 8, height: 8, borderRadius: 4, backgroundColor: "#F18B8B" },
});
