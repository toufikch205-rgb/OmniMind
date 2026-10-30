import { useState } from "react";
import { ScrollView, StyleSheet, Text, Pressable, View, useWindowDimensions } from "react-native";

type Section = "overview" | "tasks" | "calendar" | "notes" | "projects";
const C = { bg:"#F3F5F2", white:"#FFFFFF", ink:"#202D29", muted:"#7A8780", green:"#426B5A", soft:"#E8F0EA", line:"#E5EAE5", gold:"#B9854A" };

const nav: {id:Section; label:string; icon:string}[] = [
  {id:"overview",label:"Overview",icon:"⌂"},
  {id:"tasks",label:"Tasks & goals",icon:"✓"},
  {id:"calendar",label:"Planning",icon:"▦"},
  {id:"notes",label:"Knowledge",icon:"◇"},
  {id:"projects",label:"Projects",icon:"▤"},
];

export default function HomeScreen() {
  const [section,setSection] = useState<Section>("overview");
  const {width} = useWindowDimensions();
  const desktop = width >= 960;
  const tablet = width >= 680;
  const heading = nav.find(n=>n.id===section)?.label ?? "Overview";

  return <View style={s.app}>
    <View style={s.topbar}>
      <View style={s.logo}><Text style={s.logoText}>O</Text></View>
      <View><Text style={s.brand}>OmniMind</Text><Text style={s.brandSub}>PERSONAL WORKSPACE</Text></View>
      {desktop ? <View style={s.search}><Text style={s.searchIcon}>⌕</Text><Text style={s.searchText}>Search your workspace</Text><Text style={s.shortcut}>⌘ K</Text></View> : null}
      <View style={s.topRight}><View style={s.statusDot}/>{desktop ? <Text style={s.statusText}>All systems ready</Text> : null}<Pressable style={s.avatar}><Text style={s.avatarText}>Y</Text></Pressable></View>
    </View>
    <View style={s.shell}>
      {desktop ? <View style={s.sidebar}>
        <Text style={s.sideCaption}>WORKSPACE</Text>
        {nav.map(item=><SideLink key={item.id} {...item} active={section===item.id} onPress={()=>setSection(item.id)}/>)}
        <View style={s.sideBottom}><View style={s.helpIcon}><Text style={s.helpIconText}>?</Text></View><View><Text style={s.sideBottomTitle}>A space to think</Text><Text style={s.sideBottomText}>Built around your rhythm.</Text></View></View>
      </View> : null}
      <ScrollView style={s.scroll} contentContainerStyle={[s.content,desktop&&s.contentDesktop]} showsVerticalScrollIndicator={false}>
        <View style={s.headingRow}>
          <View style={{flex:1}}><Text style={s.eyebrow}>MONDAY · YOUR COMMAND CENTER</Text><Text style={[s.heading,!tablet&&s.headingMobile]}>{section==="overview"?"Make room for what matters.":heading}</Text><Text style={s.subheading}>{section==="overview"?"A clear view of your time, priorities and ideas.":"Your "+heading.toLowerCase()+" space, ready when you are."}</Text></View>
          <View style={s.dateBadge}><Text style={s.dateBadgeTop}>TODAY</Text><Text style={s.dateBadgeDay}>{new Date().getDate()}</Text></View>
        </View>

        {section==="overview" ? <>
          <View style={[s.stats,!tablet&&s.statsStack]}>
            <Stat icon="◷" label="Focus time" value="—" hint="Time well spent"/>
            <Stat icon="✓" label="Open tasks" value="—" hint="Your active priorities"/>
            <Stat icon="◎" label="Current goals" value="—" hint="What you're moving toward"/>
          </View>
          <View style={[s.grid,!tablet&&s.gridStack]}>
            <View style={[s.card,s.focusCard]}>
              <View style={s.cardTop}><View><Text style={s.kicker}>START WITH INTENTION</Text><Text style={s.cardTitle}>What matters today?</Text></View><View style={s.sunIcon}><Text style={s.sunText}>✳</Text></View></View>
              <Text style={s.paragraph}>Your command center brings your plans, tasks and knowledge together. Start small; clarity grows one step at a time.</Text>
              <View style={s.focusPrompt}><View style={s.plusCircle}><Text style={s.plus}>＋</Text></View><View style={{flex:1}}><Text style={s.focusPromptTitle}>Your first priority will live here</Text><Text style={s.smallMuted}>The task system is being prepared.</Text></View><Text style={s.arrow}>↗</Text></View>
              <View style={s.progressHeader}><Text style={s.smallMuted}>TODAY'S MOMENTUM</Text><Text style={s.smallMuted}>Not started</Text></View><View style={s.progressTrack}><View style={s.progressFill}/></View>
            </View>
            <View style={[s.card,s.dayCard]}>
              <Text style={s.kicker}>A GENTLE PLAN</Text><Text style={s.cardTitle}>Your day, at a glance</Text>
              <Timeline time="MORNING" title="Set your direction" detail="Choose what deserves your attention." mark="○"/>
              <Timeline time="DURING THE DAY" title="Make steady progress" detail="Give one thing your full focus." mark="◷"/>
              <Timeline time="EVENING" title="Reflect and reset" detail="Notice what moved forward." mark="◇"/>
            </View>
          </View>
          <View style={[s.lowerGrid,!tablet&&s.gridStack]}>
            <View style={[s.card,s.lowerCard]}><View style={s.sectionHeader}><View><Text style={s.kicker}>YOUR SPACE</Text><Text style={s.cardTitle}>Quick access</Text></View><Text style={s.linkText}>Explore</Text></View>
              <View style={s.quickGrid}>
                <QuickTile icon="✓" title="Tasks & goals" detail="Plan your next steps" onPress={()=>setSection("tasks")}/>
                <QuickTile icon="▦" title="Planning" detail="See the bigger picture" onPress={()=>setSection("calendar")}/>
                <QuickTile icon="◇" title="Knowledge" detail="Keep ideas connected" onPress={()=>setSection("notes")}/>
                <QuickTile icon="▤" title="Projects" detail="Bring work together" onPress={()=>setSection("projects")}/>
              </View>
            </View>
            <View style={[s.card,s.lowerCard,s.principlesCard]}><Text style={s.kicker}>THE OMNIMIND APPROACH</Text><Text style={s.cardTitle}>Calm by design.</Text><Principle n="01" title="Clarity over clutter" detail="Only what helps you move forward."/><Principle n="02" title="Your rhythm, respected" detail="Plans can adapt as life changes."/><Principle n="03" title="You stay in control" detail="Suggestions never act without consent."/></View>
          </View>
          <Text style={s.footer}>OMNIMIND · FOUNDATION BUILD <Text style={s.footerDot}>●</Text> Your workspace is ready to grow.</Text>
        </> : <View style={s.placeholder}><View style={s.placeholderIcon}><Text style={s.placeholderIconText}>{nav.find(n=>n.id===section)?.icon}</Text></View><Text style={s.cardTitle}>{heading} is taking shape</Text><Text style={s.paragraph}>This module will be built in its planned development phase. Your real data will appear here after its storage and sync foundations are connected.</Text><Pressable onPress={()=>setSection("overview")} style={s.backButton}><Text style={s.backButtonText}>Back to overview</Text></Pressable></View>}
      </ScrollView>
    </View>
    {!desktop ? <View style={s.bottomNav}>{nav.slice(0,4).map(item=><Pressable key={item.id} onPress={()=>setSection(item.id)} style={s.bottomItem}><Text style={[s.bottomIcon,section===item.id&&s.activeText]}>{item.icon}</Text><Text style={[s.bottomLabel,section===item.id&&s.activeText]}>{item.id==="overview"?"Home":item.id==="tasks"?"Tasks":item.id==="calendar"?"Plan":"Notes"}</Text></Pressable>)}</View> : null}
  </View>;
}

function SideLink({label,icon,active,onPress}:{id:Section;label:string;icon:string;active:boolean;onPress:()=>void}) {
  return <Pressable onPress={onPress} style={[s.sideLink,active&&s.sideLinkActive]}><Text style={[s.sideIcon,active&&s.activeText]}>{icon}</Text><Text style={[s.sideLabel,active&&s.activeText]}>{label}</Text>{active?<View style={s.activeBar}/>:null}</Pressable>;
}
function Stat({icon,label,value,hint}:{icon:string;label:string;value:string;hint:string}) {
  return <View style={s.stat}><View style={s.statTop}><Text style={s.statIcon}>{icon}</Text><Text style={s.statLabel}>{label}</Text></View><Text style={s.statValue}>{value}</Text><Text style={s.statHint}>{hint}</Text></View>;
}
function Timeline({time,title,detail,mark}:{time:string;title:string;detail:string;mark:string}) {
  return <View style={s.timeline}><View style={s.timelineMark}><Text style={s.timelineMarkText}>{mark}</Text></View><View style={{flex:1}}><Text style={s.timelineTime}>{time}</Text><Text style={s.timelineTitle}>{title}</Text><Text style={s.timelineDetail}>{detail}</Text></View></View>;
}
function QuickTile({icon,title,detail,onPress}:{icon:string;title:string;detail:string;onPress:()=>void}) {
  return <Pressable onPress={onPress} style={s.quickTile}><View style={s.quickIcon}><Text style={s.quickIconText}>{icon}</Text></View><View style={{flex:1}}><Text style={s.quickTitle}>{title}</Text><Text style={s.quickDetail}>{detail}</Text></View><Text style={s.quickArrow}>↗</Text></Pressable>;
}
function Principle({n,title,detail}:{n:string;title:string;detail:string}) {
  return <View style={s.principle}><Text style={s.principleN}>{n}</Text><View style={{flex:1}}><Text style={s.principleTitle}>{title}</Text><Text style={s.principleDetail}>{detail}</Text></View></View>;
}

const s=StyleSheet.create({
 app:{flex:1,backgroundColor:C.bg},topbar:{height:72,backgroundColor:C.white,borderBottomWidth:1,borderBottomColor:C.line,paddingHorizontal:22,flexDirection:"row",alignItems:"center",gap:11},
 logo:{width:37,height:37,borderRadius:12,backgroundColor:C.green,alignItems:"center",justifyContent:"center"},logoText:{color:"#fff",fontSize:22,fontWeight:"800"},brand:{color:C.ink,fontSize:17,fontWeight:"800",letterSpacing:-.3},brandSub:{color:C.muted,fontSize:8,fontWeight:"700",letterSpacing:1.5,marginTop:2},
 search:{height:38,maxWidth:360,flex:1,marginLeft:50,marginRight:20,borderWidth:1,borderColor:C.line,borderRadius:10,flexDirection:"row",alignItems:"center",paddingHorizontal:12,gap:9},searchIcon:{fontSize:19,color:C.muted},searchText:{fontSize:11,color:C.muted,flex:1},shortcut:{fontSize:9,color:C.muted,backgroundColor:C.bg,padding:5,borderRadius:5},
 topRight:{marginLeft:"auto",flexDirection:"row",alignItems:"center",gap:8},statusDot:{width:7,height:7,borderRadius:4,backgroundColor:"#79A184"},statusText:{fontSize:10,color:C.muted,marginRight:12},avatar:{width:34,height:34,borderRadius:17,backgroundColor:C.soft,alignItems:"center",justifyContent:"center"},avatarText:{color:C.green,fontWeight:"800"},
 shell:{flex:1,flexDirection:"row",width:"100%",maxWidth:1500,alignSelf:"center"},sidebar:{width:228,paddingHorizontal:17,paddingTop:30,borderRightWidth:1,borderRightColor:C.line,backgroundColor:"#F8F9F7"},sideCaption:{fontSize:9,fontWeight:"800",letterSpacing:1.5,color:C.muted,marginBottom:13,marginLeft:10},sideLink:{height:44,borderRadius:10,flexDirection:"row",alignItems:"center",paddingHorizontal:12,marginBottom:5,gap:12,position:"relative"},sideLinkActive:{backgroundColor:C.soft},sideIcon:{fontSize:17,color:C.muted,width:19,textAlign:"center"},sideLabel:{fontSize:11,fontWeight:"600",color:"#65736B"},activeText:{color:C.green},activeBar:{position:"absolute",right:0,top:10,bottom:10,width:3,borderRadius:3,backgroundColor:C.green},sideBottom:{marginTop:"auto",marginBottom:22,padding:12,borderRadius:12,backgroundColor:"#EEF2ED",flexDirection:"row",alignItems:"center",gap:9},helpIcon:{width:25,height:25,borderRadius:9,backgroundColor:C.white,alignItems:"center",justifyContent:"center"},helpIconText:{color:C.green,fontWeight:"800"},sideBottomTitle:{fontSize:10,color:C.ink,fontWeight:"700"},sideBottomText:{fontSize:9,color:C.muted,marginTop:3},
 scroll:{flex:1},content:{padding:20,paddingBottom:36,maxWidth:980,width:"100%",alignSelf:"center"},contentDesktop:{paddingHorizontal:38,paddingTop:34,maxWidth:1120},headingRow:{flexDirection:"row",alignItems:"center",marginBottom:24,gap:12},eyebrow:{fontSize:9,color:C.green,fontWeight:"800",letterSpacing:1.6},heading:{fontSize:30,color:C.ink,fontWeight:"800",letterSpacing:-1,marginTop:8},headingMobile:{fontSize:24},subheading:{fontSize:12,color:C.muted,marginTop:7,lineHeight:18},dateBadge:{width:52,height:57,borderRadius:12,backgroundColor:C.white,borderWidth:1,borderColor:C.line,alignItems:"center",justifyContent:"center"},dateBadgeTop:{fontSize:8,color:C.muted,fontWeight:"800",letterSpacing:1},dateBadgeDay:{fontSize:21,color:C.ink,fontWeight:"800",marginTop:2},
 stats:{flexDirection:"row",gap:12,marginBottom:14},statsStack:{flexDirection:"column"},stat:{flex:1,minHeight:103,backgroundColor:C.white,borderWidth:1,borderColor:C.line,borderRadius:13,padding:15},statTop:{flexDirection:"row",alignItems:"center",gap:8},statIcon:{fontSize:15,color:C.green},statLabel:{fontSize:10,color:C.muted,fontWeight:"600"},statValue:{fontSize:23,color:C.ink,fontWeight:"800",marginTop:8},statHint:{fontSize:9,color:C.muted,marginTop:2},
 grid:{flexDirection:"row",gap:14,alignItems:"stretch"},gridStack:{flexDirection:"column"},card:{backgroundColor:C.white,borderRadius:15,borderWidth:1,borderColor:C.line,padding:19},focusCard:{flex:1.12,minHeight:275},dayCard:{flex:1,minHeight:275},cardTop:{flexDirection:"row",justifyContent:"space-between",alignItems:"center"},kicker:{fontSize:8,color:C.green,fontWeight:"800",letterSpacing:1.3},cardTitle:{fontSize:16,color:C.ink,fontWeight:"800",marginTop:7},sunIcon:{width:34,height:34,borderRadius:11,backgroundColor:C.soft,alignItems:"center",justifyContent:"center"},sunText:{fontSize:19,color:C.green},paragraph:{fontSize:11,color:C.muted,lineHeight:19,marginTop:12},focusPrompt:{flexDirection:"row",alignItems:"center",gap:10,backgroundColor:"#F7F9F6",borderRadius:11,padding:11,marginTop:18},plusCircle:{width:29,height:29,borderRadius:10,backgroundColor:C.soft,alignItems:"center",justifyContent:"center"},plus:{fontSize:20,color:C.green},focusPromptTitle:{fontSize:10,color:C.ink,fontWeight:"700"},smallMuted:{fontSize:9,color:C.muted,marginTop:3},arrow:{fontSize:15,color:C.green},progressHeader:{flexDirection:"row",justifyContent:"space-between",marginTop:19},progressTrack:{height:5,borderRadius:5,backgroundColor:"#EDF0EC",marginTop:8},progressFill:{width:"0%",height:5,backgroundColor:C.green,borderRadius:5},
 timeline:{flexDirection:"row",gap:11,marginTop:17},timelineMark:{width:27,height:27,borderRadius:9,backgroundColor:C.soft,alignItems:"center",justifyContent:"center"},timelineMarkText:{fontSize:13,color:C.green},timelineTime:{fontSize:8,color:C.gold,fontWeight:"800",letterSpacing:1},timelineTitle:{fontSize:10,color:C.ink,fontWeight:"700",marginTop:3},timelineDetail:{fontSize:9,color:C.muted,marginTop:3,lineHeight:14},
 lowerGrid:{flexDirection:"row",gap:14,marginTop:14},lowerCard:{flex:1,minHeight:205},sectionHeader:{flexDirection:"row",alignItems:"center",justifyContent:"space-between"},linkText:{fontSize:9,color:C.green,fontWeight:"700"},quickGrid:{flexDirection:"row",flexWrap:"wrap",gap:9,marginTop:14},quickTile:{width:"48%",minHeight:54,borderWidth:1,borderColor:C.line,borderRadius:10,padding:9,flexDirection:"row",alignItems:"center",gap:8},quickIcon:{width:27,height:27,borderRadius:8,backgroundColor:C.soft,alignItems:"center",justifyContent:"center"},quickIconText:{fontSize:13,color:C.green},quickTitle:{fontSize:9,color:C.ink,fontWeight:"700"},quickDetail:{fontSize:8,color:C.muted,marginTop:3},quickArrow:{fontSize:11,color:C.muted},principlesCard:{flex:0.9},principle:{flexDirection:"row",gap:10,marginTop:14},principleN:{fontSize:9,color:C.gold,fontWeight:"800",paddingTop:1},principleTitle:{fontSize:10,color:C.ink,fontWeight:"700"},principleDetail:{fontSize:9,color:C.muted,marginTop:3},footer:{fontSize:8,color:C.muted,letterSpacing:.5,marginTop:17},footerDot:{color:"#79A184"},
 placeholder:{backgroundColor:C.white,borderWidth:1,borderColor:C.line,borderRadius:15,padding:25,marginTop:5,alignItems:"flex-start"},placeholderIcon:{width:43,height:43,borderRadius:13,backgroundColor:C.soft,alignItems:"center",justifyContent:"center",marginBottom:8},placeholderIconText:{fontSize:20,color:C.green},backButton:{marginTop:18,backgroundColor:C.green,paddingVertical:10,paddingHorizontal:15,borderRadius:9},backButtonText:{color:C.white,fontSize:10,fontWeight:"700"},
 bottomNav:{height:64,backgroundColor:C.white,borderTopWidth:1,borderTopColor:C.line,flexDirection:"row",justifyContent:"space-around",alignItems:"center"},bottomItem:{minWidth:58,alignItems:"center",gap:3},bottomIcon:{fontSize:17,color:C.muted},bottomLabel:{fontSize:8,color:C.muted,fontWeight:"600"}
});
