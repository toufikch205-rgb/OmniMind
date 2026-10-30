import { Slot, usePathname, useRouter } from "expo-router";
import { WorkspaceHeader } from "../../src/components/workspace/WorkspaceHeader";
import { NavItem, workspaceNavigation } from "../../src/components/navigation/WorkspaceNavigation";
import { Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from "react-native";

const C = { bg: "#F8FAFC", surface: "#FFFFFF", ink: "#172033", muted: "#8491A4", border: "#E9EDF3", blue: "#397DEB", blueSoft: "#E8F1FF", purple: "#9658E8" };
export default function WorkspaceLayout() {
  const { width } = useWindowDimensions();
  const router = useRouter();
  const pathname = usePathname();
  const desktop = width >= 1024;
  const tablet = width >= 700 && width < 1024;
  const immersive = pathname.endsWith("/tasks");
  const selected = pathname.endsWith("/tasks") ? workspaceNavigation[1].path : pathname.endsWith("/planning") ? workspaceNavigation[2].path : pathname.endsWith("/knowledge") ? workspaceNavigation[3].path : pathname.endsWith("/projects") ? workspaceNavigation[4].path : workspaceNavigation[0].path;
  const go = (path: string) => router.push(path as never);

  return (
    <View style={s.app}>
      {!immersive ? <WorkspaceHeader /> : null}

      {!immersive && tablet ? <View style={s.tablet}><ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.tabletInner}>{workspaceNavigation.map(i => <NavItem key={i.path} item={i} active={selected === i.path} onPress={() => go(i.path)} />)}</ScrollView></View> : null}

      <View style={s.body}>
        {desktop && !immersive ? <View style={s.sidebar}><Text style={s.section}>مساحة العمل</Text>{workspaceNavigation.map(i => <NavItem key={i.path} item={i} active={selected === i.path} onPress={() => go(i.path)} />)}</View> : null}
        <View style={s.page}><Slot /></View>
      </View>

      <View style={s.bottom}>{workspaceNavigation.map(i => <NavItem key={i.path} item={i} compact active={selected === i.path} onPress={() => go(i.path)} />)}</View>
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
  body: { flex: 1, flexDirection: "row", width: "100%", maxWidth: 1600, alignSelf: "center", paddingBottom: 76 },
  sidebar: { width: 230, paddingHorizontal: 17, paddingTop: 28, borderRightWidth: 1, borderRightColor: C.border, backgroundColor: "#FBFCFE" },
  section: { color: C.muted, fontSize: 11, fontWeight: "800", textAlign: "right", marginRight: 12, marginBottom: 14 },

});
