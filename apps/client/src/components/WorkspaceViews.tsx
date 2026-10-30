import { ReactNode } from "react";
import { ScrollView, StyleSheet, Text, View, useWindowDimensions } from "react-native";

const C = {
  bg: "#F8FAFC", white: "#FFFFFF", ink: "#172033", muted: "#8491A4",
  border: "#E9EDF3", blue: "#397DEB", blueSoft: "#E8F1FF",
  green: "#35BE62", greenSoft: "#E7F8EC", purple: "#9658E8",
  purpleSoft: "#F1E8FF", teal: "#20AAA6", tealSoft: "#E3F7F6",
};

type MetricProps = { icon: string; label: string; value: string; hint: string; color: string; tint: string };

export function PageFrame({ children }: { children: ReactNode }) {
  const { width } = useWindowDimensions();
  return <ScrollView style={s.scroll} contentContainerStyle={[s.content, { paddingHorizontal: width >= 900 ? 34 : 18 }]} showsVerticalScrollIndicator={false}>{children}</ScrollView>;
}

export function Dashboard() {
  const { width } = useWindowDimensions();
  const wide = width >= 760;
  return (
    <PageFrame>
      <View style={s.welcome} >
        <Text style={s.welcomeTitle}>مرحباً بك</Text>
        <Text style={s.welcomeSubtitle}>استمر في رحلتك نحو أهدافك</Text>
      </View>

      <View style={[s.metrics, wide && s.metricsWide]}>
        <Metric icon="✓" label="المهام المكتملة" value="12" hint="من 18" color={C.green} tint={C.greenSoft} />
        <Metric icon="▣" label="أهداف هذا الشهر" value="3" hint="من 5" color={C.purple} tint={C.purpleSoft} />
        <Metric icon="♧" label="محادثات AI" value="8" hint="هذا الأسبوع" color={C.blue} tint={C.blueSoft} />
        <Metric icon="◷" label="إجمالي الوقت" value="3" hint="هذا الأسبوع" color={C.teal} tint={C.tealSoft} />
      </View>

      <Text style={s.sectionTitle}>أقسام التطبيق</Text>
      <View style={[s.sections, wide && s.sectionsWide]}>
        <SectionCard icon="▣" title="المهام" color={C.blue} tint={C.blueSoft} />
        <SectionCard icon="▦" title="التخطيط" color={C.purple} tint={C.purpleSoft} />
        <SectionCard icon="◫" title="المعرفة" color={C.teal} tint={C.tealSoft} />
        <SectionCard icon="▤" title="المشاريع" color={C.green} tint={C.greenSoft} />
      </View>
      <Text style={s.note}>الأرقام المعروضة حالياً تجريبية، وسيتم ربطها ببياناتك الفعلية تدريجياً.</Text>
    </PageFrame>
  );
}

function Metric({ icon, label, value, hint, color, tint }: MetricProps) {
  return (
    <View style={s.metric}>
      <View style={[s.metricIcon, { backgroundColor: tint }]}><Text style={[s.metricIconText, { color }]}>{icon}</Text></View>
      <View style={s.metricCopy}>
        <Text style={s.metricLabel}>{label}</Text>
        <View style={s.metricValueRow}><Text style={[s.metricValue, { color }]}>{value}</Text><Text style={s.metricHint}>{hint}</Text></View>
      </View>
    </View>
  );
}

function SectionCard({ icon, title, color, tint }: { icon: string; title: string; color: string; tint: string }) {
  return (
    <View style={s.sectionCard}>
      <View style={[s.sectionIcon, { backgroundColor: tint }]}><Text style={[s.sectionIconText, { color }]}>{icon}</Text></View>
      <Text style={s.sectionCardTitle}>{title}</Text>
    </View>
  );
}

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

const s = StyleSheet.create({
  scroll: { flex: 1 },
  content: { width: "100%", maxWidth: 920, alignSelf: "center", paddingTop: 23, paddingBottom: 28 },
  welcome: { alignItems: "flex-end", marginBottom: 25, paddingHorizontal: 2 },
  welcomeTitle: { color: C.ink, fontSize: 27, fontWeight: "800", textAlign: "right" },
  welcomeSubtitle: { color: C.muted, fontSize: 15, fontWeight: "600", marginTop: 9, textAlign: "right" },
  metrics: { gap: 12 },
  metricsWide: { flexDirection: "row", flexWrap: "wrap" },
  metric: { minHeight: 112, width: "100%", backgroundColor: C.white, borderWidth: 1, borderColor: C.border, borderRadius: 19, paddingHorizontal: 17, paddingVertical: 15, flexDirection: "row", alignItems: "center", gap: 14, shadowColor: "#24344D", shadowOpacity: 0.035, shadowRadius: 9, shadowOffset: { width: 0, height: 3 }, elevation: 1 },
  metricIcon: { width: 66, height: 66, borderRadius: 33, alignItems: "center", justifyContent: "center" },
  metricIconText: { fontSize: 29, fontWeight: "800" },
  metricCopy: { flex: 1, alignItems: "flex-end" },
  metricLabel: { color: "#536176", fontSize: 14, fontWeight: "700", textAlign: "right" },
  metricValueRow: { flexDirection: "row", alignItems: "baseline", gap: 8, marginTop: 4 },
  metricValue: { fontSize: 31, fontWeight: "800" },
  metricHint: { color: C.muted, fontSize: 12, fontWeight: "600" },
  sectionTitle: { color: C.ink, fontSize: 21, fontWeight: "800", textAlign: "right", marginTop: 29, marginBottom: 14 },
  sections: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", rowGap: 12 },
  sectionsWide: { justifyContent: "flex-start", gap: 14 },
  sectionCard: { width: "48.3%", minHeight: 142, backgroundColor: C.white, borderWidth: 1, borderColor: C.border, borderRadius: 18, alignItems: "center", justifyContent: "center", padding: 14, shadowColor: "#24344D", shadowOpacity: 0.035, shadowRadius: 9, shadowOffset: { width: 0, height: 3 }, elevation: 1 },
  sectionIcon: { width: 67, height: 67, borderRadius: 34, alignItems: "center", justifyContent: "center", marginBottom: 10 },
  sectionIconText: { fontSize: 29, fontWeight: "800" },
  sectionCardTitle: { color: "#536176", fontSize: 15, fontWeight: "800" },
  note: { color: "#9AA5B4", fontSize: 10, textAlign: "center", marginTop: 18, lineHeight: 16 },
  moduleHeading: { alignItems: "flex-end", marginBottom: 22 },
  moduleEyebrow: { color: C.blue, fontSize: 10, fontWeight: "800" },
  moduleTitle: { color: C.ink, fontSize: 29, fontWeight: "800", marginTop: 8, textAlign: "right" },
  moduleDescription: { color: C.muted, fontSize: 13, lineHeight: 21, marginTop: 8, textAlign: "right" },
  moduleCard: { backgroundColor: C.white, borderWidth: 1, borderColor: C.border, borderRadius: 19, padding: 22, alignItems: "flex-end" },
  moduleIcon: { width: 52, height: 52, borderRadius: 16, backgroundColor: C.blueSoft, alignItems: "center", justifyContent: "center", marginBottom: 15 },
  moduleStatus: { color: C.blue, backgroundColor: C.blueSoft, borderRadius: 7, overflow: "hidden", paddingHorizontal: 10, paddingVertical: 6, fontSize: 10, fontWeight: "800" },
  moduleCardTitle: { color: C.ink, fontSize: 18, fontWeight: "800", marginTop: 13, textAlign: "right" },
});
