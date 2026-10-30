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
  body: { flex: 1, minHeight: 0, flexDirection: "row", width: "100%", maxWidth: 1600, alignSelf: "center", paddingBottom: 0 },
  sidebar: { width: 230, paddingHorizontal: 17, paddingTop: 28, borderRightWidth: 1, borderRightColor: C.border, backgroundColor: "#FBFCFE" },
  section: { color: C.muted, fontSize: 11, fontWeight: "800", textAlign: "right", marginRight: 12, marginBottom: 14 },
  page: { flex: 1, minWidth: 0, minHeight: 0 },
  tablet: { height: 58, backgroundColor: C.surface, borderBottomWidth: 1, borderBottomColor: C.border, justifyContent: "center" },
  tabletInner: { flexDirection: "row-reverse", alignItems: "center", paddingHorizontal: 12, gap: 8 },
  bottom: { height: 76, minHeight: 76, width: "100%", flexDirection: "row-reverse", alignItems: "center", justifyContent: "space-around", paddingHorizontal: 8, backgroundColor: C.surface, borderTopWidth: 1, borderTopColor: C.border, elevation: 12, zIndex: 20 },
});
