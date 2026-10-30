import { Stack, usePathname, useRouter } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from "react-native";

const C={bg:"#F8FAFC",surface:"#FFFFFF",ink:"#0F172A",muted:"#64748B",green:"#22C55E",deep:"#1E293B",mint:"#EFF6FF",border:"#E5E7EB",active:"#EAF2FF",blue:"#3882F6",purple:"#A855F7",teal:"#14B8A6",orange:"#F97316",charcoal:"#334155"};
const items=[
 {path:"/(workspace)",label:"Overview",short:"Home",icon:"⌂"},
 {path:"/(workspace)/tasks",label:"Tasks & goals",short:"Tasks",icon:"✓"},
 {path:"/(workspace)/planning",label:"Planning",short:"Plan",icon:"▦"},
 {path:"/(workspace)/knowledge",label:"Knowledge",short:"Notes",icon:"◇"},
 {path:"/(workspace)/projects",label:"Projects",short:"Projects",icon:"▤"},
];
function NavItem({item,active,compact,onPress}:{item:typeof items[number];active:boolean;compact?:boolean;onPress:()=>void}) {
 return <Pressable accessibilityRole="button" accessibilityState={{selected:active}} onPress={onPress} style={[compact?s.mobileItem:s.navItem,active&&(compact?s.mobileActive:s.navActive)]}>
  <Text style={[compact?s.mobileIcon:s.navIcon,active&&s.activeText]}>{item.icon}</Text>
  <Text numberOfLines={1} style={[compact?s.mobileLabel:s.navLabel,active&&s.activeText]}>{compact?item.short:item.label}</Text>
  {!compact&&active?<View style={s.rail}/>:null}
 </Pressable>;
}
export default function WorkspaceLayout(){
 const {width}=useWindowDimensions(); const router=useRouter(); const pathname=usePathname();
 const desktop=width>=1024, tablet=width>=700&&width<1024;
 const selected=pathname.endsWith("/tasks")?items[1].path:pathname.endsWith("/planning")?items[2].path:pathname.endsWith("/knowledge")?items[3].path:pathname.endsWith("/projects")?items[4].path:items[0].path;
 const go=(path:string)=>router.push(path as never);
 return <View style={s.app}>
  <View style={s.header}>
   <View style={s.logo}><Text style={s.logoText}>O</Text></View>
   <View><Text style={s.brand}>OmniMind</Text><Text style={s.caption}>PERSONAL WORKSPACE</Text></View>
   {desktop?<View style={s.search}><Text style={s.searchIcon}>⌕</Text><Text style={s.searchText}>Search your workspace</Text><Text style={s.searchKey}>⌘ K</Text></View>:null}
   <View style={s.right}><View style={s.dot}/>{desktop?<Text style={s.online}>Workspace ready</Text>:null}<View style={s.avatar}><Text style={s.avatarText}>Y</Text></View></View>
  </View>
  {tablet?<View style={s.tablet}><ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.tabletInner}>{items.map(i=><NavItem key={i.path} item={i} active={selected===i.path} onPress={()=>go(i.path)}/>)}</ScrollView></View>:null}
  <View style={s.body}>
   {desktop?<View style={s.sidebar}><Text style={s.section}>YOUR WORKSPACE</Text>{items.map(i=><NavItem key={i.path} item={i} active={selected===i.path} onPress={()=>go(i.path)}/>)}<View style={s.sidebarNote}><Text style={s.noteIcon}>✳</Text><View><Text style={s.noteTitle}>Space to think</Text><Text style={s.noteText}>A calmer way forward.</Text></View></View></View>:null}
   <View style={s.page}><Stack screenOptions={{headerShown:false,animation:"fade",contentStyle:{backgroundColor:C.bg}}}/></View>
  </View>
  {!desktop&&!tablet?<View style={s.bottom}>{items.map(i=><NavItem key={i.path} item={i} compact active={selected===i.path} onPress={()=>go(i.path)}/>)}</View>:null}
 </View>;
}
const s=StyleSheet.create({
 app:{flex:1,backgroundColor:C.bg},header:{height:68,paddingHorizontal:20,backgroundColor:C.surface,borderBottomWidth:1,borderBottomColor:C.border,flexDirection:"row",alignItems:"center",gap:11},
 logo:{width:38,height:38,borderRadius:13,backgroundColor:C.deep,alignItems:"center",justifyContent:"center"},logoText:{color:"#FFF",fontSize:23,fontWeight:"800"},brand:{color:C.ink,fontSize:17,fontWeight:"800"},caption:{color:C.muted,fontSize:8,fontWeight:"800",letterSpacing:1.4,marginTop:2},
 search:{height:38,maxWidth:370,flex:1,marginLeft:50,marginRight:20,borderWidth:1,borderColor:C.border,borderRadius:11,paddingHorizontal:12,flexDirection:"row",alignItems:"center",gap:9},searchIcon:{color:C.muted,fontSize:20},searchText:{flex:1,color:C.muted,fontSize:11},searchKey:{color:C.muted,backgroundColor:C.bg,padding:5,borderRadius:6,fontSize:9},
 right:{marginLeft:"auto",flexDirection:"row",alignItems:"center",gap:9},dot:{width:7,height:7,borderRadius:4,backgroundColor:"#75A982"},online:{color:C.muted,fontSize:10,marginRight:9},avatar:{width:34,height:34,borderRadius:17,backgroundColor:"#EAF2FF",alignItems:"center",justifyContent:"center"},avatarText:{color:C.blue,fontWeight:"800"},
 body:{flex:1,flexDirection:"row",width:"100%",maxWidth:1600,alignSelf:"center"},sidebar:{width:238,paddingHorizontal:17,paddingTop:30,paddingBottom:18,borderRightWidth:1,borderRightColor:C.border,backgroundColor:"#FBFCFE"},section:{color:C.muted,fontSize:9,fontWeight:"800",letterSpacing:1.5,marginLeft:12,marginBottom:14},
 navItem:{minHeight:46,borderRadius:11,paddingHorizontal:12,marginBottom:5,flexDirection:"row",alignItems:"center",gap:12,position:"relative"},navActive:{backgroundColor:C.active},navIcon:{width:20,textAlign:"center",color:"#829087",fontSize:18},navLabel:{color:"#63736A",fontSize:11,fontWeight:"600"},activeText:{color:C.deep},rail:{position:"absolute",right:0,top:10,bottom:10,width:3,borderRadius:4,backgroundColor:C.blue},
 sidebarNote:{marginTop:"auto",backgroundColor:"#EFF6FF",borderRadius:13,padding:12,flexDirection:"row",alignItems:"center",gap:9},noteIcon:{width:29,height:29,textAlign:"center",textAlignVertical:"center",borderRadius:10,overflow:"hidden",backgroundColor:"#FFF",color:C.blue,fontSize:17},noteTitle:{color:C.ink,fontSize:10,fontWeight:"800"},noteText:{color:C.muted,fontSize:9,marginTop:3},
 page:{flex:1,minWidth:0},tablet:{height:58,backgroundColor:C.surface,borderBottomWidth:1,borderBottomColor:C.border},tabletInner:{alignItems:"center",paddingHorizontal:16,gap:7},
 bottom:{height:68,paddingHorizontal:4,paddingBottom:4,backgroundColor:C.surface,borderTopWidth:1,borderTopColor:C.border,flexDirection:"row",justifyContent:"space-around",alignItems:"center"},
 mobileItem:{minWidth:58,flex:1,height:56,flexDirection:"column",gap:3,justifyContent:"center",alignItems:"center"},mobileActive:{backgroundColor:"transparent"},mobileIcon:{fontSize:19,color:"#8793A3"},mobileLabel:{color:"#7A8780",fontSize:9,fontWeight:"600"},
});