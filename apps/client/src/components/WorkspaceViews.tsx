import { ReactNode } from "react";
import { useRouter } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from "react-native";

const C = {
  bg: "#F8FAFC", white: "#FFFFFF", ink: "#172033", muted: "#8491A4",
  border: "#E9EDF3", blue: "#397DEB", blueSoft: "#E8F1FF",
  green: "#35BE62", greenSoft: "#E7F8EC", purple: "#9658E8",
  purpleSoft: "#F1E8FF", teal: "#20AAA6", tealSoft: "#E3F7F6",
};

type MetricProps = { icon: string; label: string; value: string; hint: string; color: string; tint: string; wide: boolean };

export function AppIcon({ name, color, size = 28 }: { name: string; color: string; size?: number }) {
  const stroke = Math.max(2, Math.round(size * 0.075));
  const line = { position: "absolute" as const, backgroundColor: color, borderRadius: 3 };
  if (name === "home") return <View style={{ width: size * .7, height: size * .62, alignItems: "center", justifyContent: "flex-end" }}><View style={{ position: "absolute", top: size * .03, width: size * .48, height: size * .48, borderLeftWidth: stroke + 1, borderTopWidth: stroke + 1, borderColor: color, transform: [{ rotate: "45deg" }] }} /><View style={{ width: size * .53, height: size * .34, borderWidth: stroke + 1, borderColor: color, borderTopWidth: 0, borderBottomLeftRadius: 3, borderBottomRightRadius: 3 }} /></View>;
  if (name === "bell") return <View style={{ width: size * .62, height: size * .65, borderWidth: stroke, borderColor: color, borderTopLeftRadius: size * .3, borderTopRightRadius: size * .3, borderBottomLeftRadius: size * .08, borderBottomRightRadius: size * .08, alignItems: "center", justifyContent: "flex-end" }}><View style={{ width: size * .18, height: size * .08, borderRadius: size, backgroundColor: color, marginBottom: -size * .13 }} /></View>;
  if (name === "check") return <View style={{ width: size * .62, height: size * .62, borderWidth: stroke, borderColor: color, borderRadius: size * .14, alignItems: "center", justifyContent: "center" }}><Text style={{ color, fontSize: size * .52, lineHeight: size * .62, fontWeight: "800" }}>✓</Text></View>;
  if (name === "calendar") return <View style={{ width: size * .68, height: size * .64, borderWidth: stroke, borderColor: color, borderRadius: size * .12, marginTop: size * .08 }}><View style={{ height: stroke * 1.5, backgroundColor: color, marginTop: size * .18 }} /><View style={{ position: "absolute", top: -size * .14, left: size * .13, width: stroke * 1.5, height: size * .22, borderRadius: 2, backgroundColor: color }} /><View style={{ position: "absolute", top: -size * .14, right: size * .13, width: stroke * 1.5, height: size * .22, borderRadius: 2, backgroundColor: color }} /></View>;
  if (name === "bulb") return <View style={{ alignItems: "center", width: size * .7 }}><View style={{ width: size * .55, height: size * .55, borderWidth: stroke, borderColor: color, borderRadius: size, borderBottomLeftRadius: size * .2, borderBottomRightRadius: size * .2 }} /><View style={{ width: size * .24, height: stroke, backgroundColor: color, marginTop: 2 }} /><View style={{ width: size * .18, height: stroke, backgroundColor: color, marginTop: 3 }} /></View>;
  if (name === "clock") return <View style={{ width: size * .72, height: size * .72, borderWidth: stroke + 1, borderColor: color, borderRadius: size, alignItems: "center", justifyContent: "center" }}><View style={{ position: "absolute", width: stroke, height: size * .23, backgroundColor: color, top: size * .13, borderRadius: 2 }} /><View style={{ position: "absolute", width: size * .2, height: stroke, backgroundColor: color, top: size * .33, left: size * .35, transform: [{ rotate: "25deg" }], borderRadius: 2 }} /></View>;
  if (name === "book") return <View style={{ flexDirection: "row", gap: 1 }}><View style={{ width: size * .29, height: size * .58, borderWidth: stroke, borderColor: color, borderTopLeftRadius: 4, borderBottomLeftRadius: 4 }} /><View style={{ width: size * .29, height: size * .58, borderWidth: stroke, borderColor: color, borderTopRightRadius: 4, borderBottomRightRadius: 4 }} /></View>;
  if (name === "projects") return <View style={{ width: size * .68, height: size * .52, borderWidth: stroke, borderColor: color, borderRadius: size * .1, marginTop: size * .1 }}><View style={{ position: "absolute", width: size * .28, height: size * .13, borderWidth: stroke, borderColor: color, borderBottomWidth: 0, top: -size * .17, left: size * .13, borderTopLeftRadius: 3, borderTopRightRadius: 3 }} /></View>;
  return <View style={{ width: size * .68, height: size * .68, borderWidth: stroke, borderColor: color, borderRadius: size, alignItems: "center", justifyContent: "center" }}><View style={{ width: size * .27, height: stroke, backgroundColor: color, transform: [{ rotate: "-45deg" }] }} /></View>;
}

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
        <Metric icon="check" label="المهام المكتملة" value="12" hint="من 18" color={C.green} tint={C.greenSoft} wide={wide} />
        <Metric icon="calendar" label="أهداف هذا الشهر" value="3" hint="من 5" color={C.purple} tint={C.purpleSoft} wide={wide} />
        <Metric icon="bulb" label="محادثات AI" value="8" hint="هذا الأسبوع" color={C.blue} tint={C.blueSoft} wide={wide} />
        <Metric icon="clock" label="إجمالي الوقت" value="3" hint="هذا الأسبوع" color={C.teal} tint={C.tealSoft} wide={wide} />
      </View>

      <Text style={s.sectionTitle}>أقسام التطبيق</Text>
      <View style={[s.sections, wide && s.sectionsWide]}>
        <SectionCard icon="check" title="المهام" color={C.blue} tint={C.blueSoft} wide={wide} route="/(workspace)/tasks" />
        <SectionCard icon="calendar" title="التخطيط" color={C.purple} tint={C.purpleSoft} wide={wide} route="/(workspace)/planning" />
        
      </View>
    </PageFrame>
  );
}

function Metric({ icon, label, value, hint, color, tint, wide }: MetricProps) {
  return (
    <View style={[s.metric, wide && s.metricWide]}>
      <View style={[s.metricIcon, { backgroundColor: tint }]}><AppIcon name={icon} color={color} size={31} /></View>
      <View style={s.metricCopy}>
        <Text style={s.metricLabel}>{label}</Text>
        <View style={s.metricValueRow}><Text style={[s.metricValue, { color }]}>{value}</Text><Text style={s.metricHint}>{hint}</Text></View>
      </View>
    </View>
  );
}

function SectionCard({ icon, title, color, tint, wide, route }: { icon: string; title: string; color: string; tint: string; wide: boolean; route: "/(workspace)/tasks" | "/(workspace)/planning" }) {
  const router = useRouter();
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={`فتح قسم ${title}`} onPress={() => router.push(route)} style={({ pressed }) => [s.sectionCard, wide && s.sectionCardWide, pressed && s.sectionCardPressed]}>
      <View style={[s.sectionIcon, { backgroundColor: tint }]}><AppIcon name={icon} color={color} size={32} /></View>
      <Text style={s.sectionCardTitle}>{title}</Text>
    </Pressable>
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
  content: { width: "100%", maxWidth: 920, alignSelf: "center", paddingTop: 12, paddingBottom: 12 },
  welcome: { alignItems: "flex-end", marginBottom: 14, paddingHorizontal: 2 },
  welcomeTitle: { color: C.ink, fontSize: 24, fontWeight: "800", textAlign: "right" },
  welcomeSubtitle: { color: C.muted, fontSize: 13, fontWeight: "600", marginTop: 5, textAlign: "right" },
  metrics: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", rowGap: 9 },
  metricsWide: { rowGap: 12 },
  metric: { minHeight: 78, width: "48.5%", backgroundColor: C.white, borderWidth: 1, borderColor: C.border, borderRadius: 15, paddingHorizontal: 10, paddingVertical: 9, flexDirection: "row", alignItems: "center", gap: 8, shadowColor: "#24344D", shadowOpacity: 0.035, shadowRadius: 9, shadowOffset: { width: 0, height: 3 }, elevation: 1 },
  metricWide: { width: "48.5%" },
  metricIcon: { width: 42, height: 42, borderRadius: 22, flexShrink: 0, alignItems: "center", justifyContent: "center" },
  
  metricCopy: { flex: 1, alignItems: "flex-end" },
  metricLabel: { color: "#536176", fontSize: 11, fontWeight: "700", textAlign: "right" },
  metricValueRow: { flexDirection: "row", alignItems: "baseline", gap: 6, marginTop: 1 },
  metricValue: { fontSize: 23, fontWeight: "800" },
  metricHint: { color: C.muted, fontSize: 10, fontWeight: "600" },
  sectionTitle: { color: C.ink, fontSize: 18, fontWeight: "800", textAlign: "right", marginTop: 17, marginBottom: 9 },
  sections: { flexDirection: "row", flexWrap: "nowrap", justifyContent: "space-between", columnGap: 10 },
  sectionsWide: { justifyContent: "space-between", gap: 0 },
  sectionCard: { width: "48.5%", minHeight: 108, backgroundColor: C.white, borderWidth: 1, borderColor: C.border, borderRadius: 18, alignItems: "center", justifyContent: "center", padding: 14, shadowColor: "#24344D", shadowOpacity: 0.035, shadowRadius: 9, shadowOffset: { width: 0, height: 3 }, elevation: 1 },
  sectionCardPressed: { opacity: 0.72, transform: [{ scale: 0.98 }] },
  sectionCardWide: { width: "48.5%" },
  sectionIcon: { width: 48, height: 48, borderRadius: 24, alignItems: "center", justifyContent: "center", marginBottom: 7 },
  
  sectionCardTitle: { color: "#536176", fontSize: 14, fontWeight: "800" },
  moduleHeading: { alignItems: "flex-end", marginBottom: 22 },
  moduleEyebrow: { color: C.blue, fontSize: 10, fontWeight: "800" },
  moduleTitle: { color: C.ink, fontSize: 29, fontWeight: "800", marginTop: 8, textAlign: "right" },
  moduleDescription: { color: C.muted, fontSize: 13, lineHeight: 21, marginTop: 8, textAlign: "right" },
  moduleCard: { backgroundColor: C.white, borderWidth: 1, borderColor: C.border, borderRadius: 19, padding: 22, alignItems: "flex-end" },
  moduleIcon: { width: 52, height: 52, borderRadius: 16, backgroundColor: C.blueSoft, alignItems: "center", justifyContent: "center", marginBottom: 15 },
  moduleStatus: { color: C.blue, backgroundColor: C.blueSoft, borderRadius: 7, overflow: "hidden", paddingHorizontal: 10, paddingVertical: 6, fontSize: 10, fontWeight: "800" },
  moduleCardTitle: { color: C.ink, fontSize: 18, fontWeight: "800", marginTop: 13, textAlign: "right" },
});
