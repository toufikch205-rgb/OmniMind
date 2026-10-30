import { useState } from "react";
import { ScrollView, StyleSheet, Text, Pressable, View, useWindowDimensions } from "react-native";

type Tab = "home" | "tasks" | "knowledge";

const palette = {
  canvas: "#F4F6F3",
  surface: "#FFFFFF",
  ink: "#1E293B",
  muted: "#718078",
  accent: "#426B5A",
  accentSoft: "#E8F0EA",
  line: "#E5EAE5",
  amber: "#B7793D",
};

function Label({ children }: { children: string }) {
  return <Text style={styles.label}>{children}</Text>;
}

function Metric({ value, caption }: { value: string; caption: string }) {
  return <View style={styles.metric}><Text style={styles.metricValue}>{value}</Text><Text style={styles.muted}>{caption}</Text></View>;
}

export default function HomeScreen() {
  const [tab, setTab] = useState<Tab>("home");
  const { width } = useWindowDimensions();
  const wide = width >= 900;
  const medium = width >= 640;
  const title = tab === "home" ? "Good to have you here." : tab === "tasks" ? "Your tasks" : "Your knowledge";

  return (
    <View style={styles.app}>
      <View style={styles.topbar}>
        <View style={styles.brandMark}><Text style={styles.brandMarkText}>O</Text></View>
        <View style={styles.brandCopy}><Text style={styles.brand}>OmniMind</Text><Text style={styles.brandSub}>YOUR PERSONAL WORKSPACE</Text></View>
        {wide ? <View style={styles.topHint}><View style={styles.onlineDot} /><Text style={styles.muted}>Personal workspace</Text></View> : null}
        <Pressable accessibilityRole="button" style={styles.avatar}><Text style={styles.avatarText}>Y</Text></Pressable>
      </View>

      <View style={[styles.body, wide && styles.bodyWide]}>
        {wide ? <View style={styles.sidebar}>
          <Label>WORKSPACE</Label>
          <NavItem text="Command center" active={tab === "home"} onPress={() => setTab("home")} />
          <NavItem text="Tasks & goals" active={tab === "tasks"} onPress={() => setTab("tasks")} />
          <NavItem text="Knowledge" active={tab === "knowledge"} onPress={() => setTab("knowledge")} />
          <View style={styles.sidebarFoot}><Text style={styles.mutedSmall}>A little more clarity, every day.</Text></View>
        </View> : null}

        <ScrollView contentContainerStyle={[styles.content, wide && styles.contentWide]} showsVerticalScrollIndicator={false}>
          <View style={styles.welcomeRow}>
            <View style={{ flex: 1 }}><Text style={styles.eyebrow}>YOUR COMMAND CENTER</Text><Text style={[styles.heading, !medium && styles.headingSmall]}>{title}</Text><Text style={styles.subtitle}>A calm space to think clearly and move forward.</Text></View>
            <View style={styles.datePill}><Text style={styles.dateText}>PERSONAL SPACE</Text></View>
          </View>

          {tab === "home" ? <>
            <View style={[styles.metrics, !medium && styles.metricsStack]}>
              <Metric value="—" caption="Tasks in progress" />
              <Metric value="—" caption="Goals this month" />
              <Metric value="—" caption="Focus time" />
            </View>
            <View style={[styles.columns, !medium && styles.columnsStack]}>
              <View style={[styles.panel, styles.mainPanel]}>
                <View style={styles.panelHeader}><View><Label>GET STARTED</Label><Text style={styles.panelTitle}>Make this space yours</Text></View><Text style={styles.sparkle}>✳</Text></View>
                <Text style={styles.bodyText}>Your workspace is ready for its first ideas, plans and priorities. We’ll build each part carefully, without getting in your way.</Text>
                <View style={styles.actionRow}><View style={styles.actionIcon}><Text style={styles.actionIconText}>＋</Text></View><View style={{ flex: 1 }}><Text style={styles.actionTitle}>Start with one clear priority</Text><Text style={styles.muted}>Add your first task when the task module is ready.</Text></View></View>
              </View>
              <View style={[styles.panel, styles.sidePanel]}>
                <Label>WORKSPACE PRINCIPLES</Label>
                <Principle number="01" title="Clarity first" detail="Show what matters, when it matters." />
                <Principle number="02" title="Your pace" detail="Plans adapt when life changes." />
                <Principle number="03" title="You stay in control" detail="AI suggestions never act without consent." />
              </View>
            </View>
            <View style={styles.footerNote}><View style={styles.onlineDot} /><Text style={styles.mutedSmall}>Foundation workspace · Your data modules will appear here as they are connected.</Text></View>
          </> : <View style={styles.emptyPanel}><Text style={styles.emptyIcon}>{tab === "tasks" ? "✓" : "◇"}</Text><Text style={styles.panelTitle}>{tab === "tasks" ? "A thoughtful task system is on its way" : "Your second brain starts here"}</Text><Text style={styles.bodyText}>This area will be activated in its roadmap phase. Nothing is being simulated or saved yet.</Text></View>}
        </ScrollView>
      </View>

      {!wide ? <View style={styles.bottomNav}>
        <BottomItem label="Home" icon="⌂" active={tab === "home"} onPress={() => setTab("home")} />
        <BottomItem label="Tasks" icon="✓" active={tab === "tasks"} onPress={() => setTab("tasks")} />
        <BottomItem label="Knowledge" icon="◇" active={tab === "knowledge"} onPress={() => setTab("knowledge")} />
      </View> : null}
    </View>
  );
}

function NavItem({ text, active, onPress }: { text: string; active: boolean; onPress: () => void }) {
  return <Pressable onPress={onPress} style={[styles.navItem, active && styles.navItemActive]}><Text style={[styles.navText, active && styles.navTextActive]}>{text}</Text></Pressable>;
}
function BottomItem({ label, icon, active, onPress }: { label: string; icon: string; active: boolean; onPress: () => void }) {
  return <Pressable onPress={onPress} accessibilityRole="button" style={styles.bottomItem}><Text style={[styles.bottomIcon, active && styles.bottomActive]}>{icon}</Text><Text style={[styles.bottomLabel, active && styles.bottomActive]}>{label}</Text></Pressable>;
}
function Principle({ number, title, detail }: { number: string; title: string; detail: string }) {
  return <View style={styles.principle}><Text style={styles.principleNumber}>{number}</Text><View style={{ flex: 1 }}><Text style={styles.actionTitle}>{title}</Text><Text style={styles.muted}>{detail}</Text></View></View>;
}

const styles = StyleSheet.create({
  app: { flex: 1, backgroundColor: palette.canvas },
  topbar: { height: 76, paddingHorizontal: 24, backgroundColor: palette.surface, borderBottomWidth: 1, borderBottomColor: palette.line, flexDirection: "row", alignItems: "center" },
  brandMark: { width: 38, height: 38, borderRadius: 13, backgroundColor: palette.accent, alignItems: "center", justifyContent: "center" },
  brandMarkText: { color: "#FFFFFF", fontSize: 22, fontWeight: "700" },
  brandCopy: { marginLeft: 11 },
  brand: { color: palette.ink, fontSize: 17, fontWeight: "700", letterSpacing: 0.2 },
  brandSub: { color: palette.muted, fontSize: 8, letterSpacing: 1.5, marginTop: 2, fontWeight: "700" },
  topHint: { marginLeft: "auto", flexDirection: "row", alignItems: "center", gap: 8 },
  onlineDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: "#6B9A79" },
  avatar: { marginLeft: "auto", width: 36, height: 36, borderRadius: 18, backgroundColor: palette.accentSoft, alignItems: "center", justifyContent: "center" },
  avatarText: { color: palette.accent, fontWeight: "700" },
  body: { flex: 1, flexDirection: "row" },
  bodyWide: { maxWidth: 1440, width: "100%", alignSelf: "center" },
  sidebar: { width: 230, padding: 24, borderRightWidth: 1, borderRightColor: palette.line, backgroundColor: "#F8F9F7" },
  label: { color: palette.muted, fontSize: 10, fontWeight: "700", letterSpacing: 1.4 },
  navItem: { paddingVertical: 12, paddingHorizontal: 13, borderRadius: 10, marginTop: 8 },
  navItemActive: { backgroundColor: palette.accentSoft },
  navText: { color: palette.muted, fontSize: 13, fontWeight: "600" },
  navTextActive: { color: palette.accent },
  sidebarFoot: { marginTop: "auto", paddingTop: 24 },
  content: { padding: 24, paddingBottom: 42, width: "100%", maxWidth: 900, alignSelf: "center" },
  contentWide: { paddingHorizontal: 42, paddingTop: 42, maxWidth: 1040 },
  welcomeRow: { flexDirection: "row", alignItems: "center", marginBottom: 28, gap: 12 },
  eyebrow: { color: palette.accent, fontSize: 10, fontWeight: "700", letterSpacing: 1.7 },
  heading: { color: palette.ink, fontSize: 32, fontWeight: "700", letterSpacing: -0.8, marginTop: 9 },
  headingSmall: { fontSize: 27 },
  subtitle: { color: palette.muted, fontSize: 13, marginTop: 8, lineHeight: 20 },
  datePill: { paddingHorizontal: 12, paddingVertical: 9, borderRadius: 20, backgroundColor: palette.surface, borderWidth: 1, borderColor: palette.line },
  dateText: { color: palette.muted, fontSize: 9, fontWeight: "700", letterSpacing: 0.8 },
  metrics: { flexDirection: "row", gap: 12, marginBottom: 16 },
  metricsStack: { flexDirection: "column" },
  metric: { flex: 1, minHeight: 88, padding: 17, borderRadius: 14, backgroundColor: palette.surface, borderWidth: 1, borderColor: palette.line, justifyContent: "center" },
  metricValue: { color: palette.ink, fontSize: 23, fontWeight: "700", marginBottom: 5 },
  muted: { color: palette.muted, fontSize: 11, lineHeight: 17 },
  mutedSmall: { color: palette.muted, fontSize: 10, lineHeight: 16 },
  columns: { flexDirection: "row", gap: 16, alignItems: "stretch" },
  columnsStack: { flexDirection: "column" },
  panel: { padding: 21, borderRadius: 16, backgroundColor: palette.surface, borderWidth: 1, borderColor: palette.line },
  mainPanel: { flex: 1.25, minHeight: 250 },
  sidePanel: { flex: 1, minHeight: 250 },
  panelHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  panelTitle: { color: palette.ink, fontSize: 18, fontWeight: "700", marginTop: 8, lineHeight: 25 },
  sparkle: { color: palette.accent, fontSize: 25 },
  bodyText: { color: palette.muted, fontSize: 12, lineHeight: 20, marginTop: 13 },
  actionRow: { flexDirection: "row", alignItems: "center", gap: 12, paddingTop: 19, marginTop: 18, borderTopWidth: 1, borderTopColor: palette.line },
  actionIcon: { width: 34, height: 34, borderRadius: 11, backgroundColor: palette.accentSoft, alignItems: "center", justifyContent: "center" },
  actionIconText: { color: palette.accent, fontSize: 22 },
  actionTitle: { color: palette.ink, fontSize: 12, fontWeight: "700", marginBottom: 4 },
  principle: { flexDirection: "row", gap: 12, marginTop: 19, alignItems: "flex-start" },
  principleNumber: { color: palette.amber, fontSize: 10, fontWeight: "700", paddingTop: 2 },
  footerNote: { flexDirection: "row", alignItems: "center", gap: 8, marginTop: 18 },
  emptyPanel: { padding: 28, backgroundColor: palette.surface, borderRadius: 16, borderWidth: 1, borderColor: palette.line, alignItems: "flex-start" },
  emptyIcon: { color: palette.accent, fontSize: 30, marginBottom: 10 },
  bottomNav: { height: 66, backgroundColor: palette.surface, borderTopWidth: 1, borderTopColor: palette.line, flexDirection: "row", justifyContent: "space-around", alignItems: "center", paddingBottom: 4 },
  bottomItem: { alignItems: "center", justifyContent: "center", minWidth: 70 },
  bottomIcon: { color: palette.muted, fontSize: 19, marginBottom: 3 },
  bottomLabel: { color: palette.muted, fontSize: 9, fontWeight: "600" },
  bottomActive: { color: palette.accent, fontWeight: "700" },
});
