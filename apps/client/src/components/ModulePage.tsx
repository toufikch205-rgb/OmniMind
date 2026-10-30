import { StyleSheet, Text, View } from "react-native";
import { PageFrame } from "./PageFrame";

export function ModulePage({ name, eyebrow, description, icon }: { name: string; eyebrow: string; description: string; icon: string }) {
  return <PageFrame>
    <View style={s.moduleHeading}>
      <Text style={s.moduleEyebrow}>{eyebrow}</Text>
      <Text style={s.moduleTitle}>{name}</Text>
      <Text style={s.moduleDescription}>{description}</Text>
    </View>
    <View style={s.moduleCard}>
      <View style={s.moduleIcon}><Text style={{ color: C.blue, fontSize: 25 }}>{icon}</Text></View>
      <Text style={s.moduleStatus}>قيد التطوير</Text>
      <Text style={s.moduleCardTitle}>نعمل على تجهيز قسم {name}</Text>
      <Text style={s.moduleDescription}>سيتم بناء وظائف هذا القسم وربطها ببقية مساحة العمل ضمن مراحل التطوير المعتمدة.</Text>
    </View>
  </PageFrame>;
}

const C = { ink: "#172033", muted: "#8491A4", blue: "#397DEB", blueSoft: "#E8F1FF", border: "#E9EDF3", white: "#FFFFFF" };
const s = StyleSheet.create({
  moduleHeading: { alignItems: "flex-end", marginBottom: 22 },
  moduleEyebrow: { color: C.blue, fontSize: 10, fontWeight: "800" },
  moduleTitle: { color: C.ink, fontSize: 29, fontWeight: "800", marginTop: 8, textAlign: "right" },
  moduleDescription: { color: C.muted, fontSize: 13, lineHeight: 21, marginTop: 8, textAlign: "right" },
  moduleCard: { backgroundColor: C.white, borderWidth: 1, borderColor: C.border, borderRadius: 19, padding: 22, alignItems: "flex-end" },
  moduleIcon: { width: 52, height: 52, borderRadius: 16, backgroundColor: C.blueSoft, alignItems: "center", justifyContent: "center", marginBottom: 15 },
  moduleStatus: { color: C.blue, backgroundColor: C.blueSoft, borderRadius: 7, overflow: "hidden", paddingHorizontal: 10, paddingVertical: 6, fontSize: 10, fontWeight: "800" },
  moduleCardTitle: { color: C.ink, fontSize: 18, fontWeight: "800", marginTop: 13, textAlign: "right" },
});
