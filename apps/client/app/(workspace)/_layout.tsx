import { Stack, usePathname, useRouter } from "expo-router";
import { AppIcon } from "../../src/components/WorkspaceViews";
import { Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from "react-native";

const C = { bg: "#F8FAFC", surface: "#FFFFFF", ink: "#172033", muted: "#8491A4", border: "#E9EDF3", blue: "#397DEB", blueSoft: "#E8F1FF", purple: "#9658E8" };
const items = [
  { path: "/(workspace)", label: "الرئيسية", short: "الرئيسية", icon: "home" },
  { path: "/(workspace)/tasks", label: "المهام", short: "المهام", icon: "tasks" },
  { path: "/(workspace)/planning", label: "التخطيط", short: "التخطيط", icon: "calendar" },
  { path: "/(workspace)/knowledge", label: "المعرفة", short: "المعرفة", icon: "book" },
  { path: "/(workspace)/projects", label: "المشاريع", short: "المشاريع", icon: "projects" },
];

function NavItem({ item, active, compact, onPress }: { item: typeof items[number]; active: boolean; compact?: boolean; onPress: () => void }) {
  return (
    <Pressable accessibilityRole="button" accessibilityState={{ selected: active }} onPress={onPress} style={[compact ? s.mobileItem : s.navItem, active && (compact ? s.mobileActive : s.navActive)]}>
      <View style={compact ? s.mobileIcon : s.navIcon}><AppIcon name={item.icon} color={active ? C.blue : "#8793A3"} size={compact ? 23 : 21} /></View>
      <Text numberOfLines={1} style={[compact ? s.mobileLabel : s.navLabel, active && s.activeText]}>{item.label}</Text>
      {!compact && active ? <View style={s.rail} /> : null}
    </Pressable>
  );
}

export default function WorkspaceLayout() {
  const { width } = useWindowDimensions();
  const router = useRouter();
  const pathname = usePathname();
  const desktop = width >= 1024;
  const tablet = width >= 700 && width < 1024;
  const immersive = pathname.endsWith("/tasks");
  const selected = pathname.endsWith("/tasks") ? items[1].path : pathname.endsWith("/planning") ? items[2].path : pathname.endsWith("/knowledge") ? items[3].path : pathname.endsWith("/projects") ? items[4].path : items[0].path;
  const go = (path: string) => router.push(path as never);

  return (
    <View style={s.app}>
      {!immersive ? <View style={s.header}>
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
      </View> : null}

      {!immersive && tablet ? <View style={s.tablet}><ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.tabletInner}>{items.map(i => <NavItem key={i.path} item={i} active={selected === i.path} onPress={() => go(i.path)} />)}</ScrollView></View> : null}

      <View style={s.body}>
        {desktop && !immersive ? <View style={s.sidebar}><Text style={s.section}>مساحة العمل</Text>{items.map(i => <NavItem key={i.path} item={i} active={selected === i.path} onPress={() => go(i.path)} />)}</View> : null}
        <View style={s.page}><Stack screenOptions={{ headerShown: false, animation: "fade", contentStyle: { backgroundColor: C.bg } }} /></View>
      </View>

      {!desktop && !tablet ? <View style={s.bottom}>{items.map(i => <NavItem key={i.path} item={i} compact active={selected === i.path} onPress={() => go(i.path)} />)}</View> : null}
    </View>
  );
}

const s = StyleSheet.create({
  app: { flex: 1, backgroundColor: C.bg },
  header: { height: 66, paddingHorizontal: 18, backgroundColor: C.surface, borderBottomWidth: 1, borderBottomColor: C.border, flexDirection: "row", alignItems: "center", gap: 15 },
  menuButton: { width: 30, height: 38, alignItems: "center", justifyContent: "center" },
  menuGlyph: { color: "#526174", fontSize: 25, fontWeight: "700" },
  brandRow: { flexDirection: "row", alignItems: "center", gap: 5 },
  logo: { width: 30, height: 30, borderRadius: 15, borderWidth: 3, borderColor: "#78A4F5", alignItems: "center", justifyContent: "center" },
  logoText: { color: C.blue, fontSize: 16, fontWeight: "900" },
  brand: { fontSize: 20, fontWeight: "900", letterSpacing: -0.7 },
  headerRight: { marginLeft: "auto", alignItems: "center", justifyContent: "center" },
  bellWrap: { width: 34, height: 38, alignItems: "center", justifyContent: "center" },
  bell: { color: "#526174", fontSize: 25, fontWeight: "700" },
  notificationDot: { position: "absolute", top: 6, right: 4, width: 8, height: 8, borderRadius: 4, backgroundColor: "#F18B8B" },
  body: { flex: 1, flexDirection: "row", width: "100%", maxWidth: 1600, alignSelf: "center" },
  sidebar: { width: 230, paddingHorizontal: 17, paddingTop: 28, borderRightWidth: 1, borderRightColor: C.border, backgroundColor: "#FBFCFE" },
  section: { color: C.muted, fontSize: 11, fontWeight: "800", textAlign: "right", marginRight: 12, marginBottom: 14 },
  navItem: { minHeight: 47, borderRadius: 11, paddingHorizontal: 12, marginBottom: 5, flexDirection: "row-reverse", alignItems: "center", gap: 12, position: "relative" },
  navActive: { backgroundColor: C.blueSoft },
  navIcon: { width: 24, height: 27, alignItems: "center", justifyContent: "center" },
  navLabel: { color: "#64748B", fontSize: 12, fontWeight: "600", textAlign: "right" },
  activeText: { color: C.blue },
  rail: { position: "absolute", right: 0, top: 10, bottom: 10, width: 3, borderRadius: 4, backgroundColor: C.blue },
  page: { flex: 1, minWidth: 0 },
  tablet: { height: 58, backgroundColor: C.surface, borderBottomWidth: 1, borderBottomColor: C.border },
  tabletInner: { alignItems: "center", paddingHorizontal: 16, gap: 7 },
  bottom: { height: 76, paddingHorizontal: 4, paddingBottom: 5, backgroundColor: C.surface, borderTopWidth: 1, borderTopColor: C.border, flexDirection: "row", justifyContent: "space-around", alignItems: "center" },
  mobileItem: { minWidth: 58, flex: 1, height: 66, flexDirection: "column", gap: 5, justifyContent: "center", alignItems: "center" },
  mobileActive: { backgroundColor: "transparent" },
  mobileIcon: { height: 28, alignItems: "center", justifyContent: "center" },
  mobileLabel: { color: "#7D899A", fontSize: 10, fontWeight: "700", letterSpacing: 0.1 },
});
