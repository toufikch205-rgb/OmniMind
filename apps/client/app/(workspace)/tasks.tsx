import { useEffect, useMemo, useState } from "react";
import { Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";

type Block = { id: string; type: "task" | "text"; text: string; done?: boolean };
type Page = { id: string; title: string; icon: string; blocks: Block[]; children: Page[] };
const KEY = "omnimind.tasks.pages.v1";
const icons = ["📄","📚","🎯","💡","🧠","💼","🏠","📌"];
const seed: Page[] = [
  { id:"inbox", title:"مهامي", icon:"📥", blocks:[{id:"t1",type:"task",text:"رتّب أولوياتك لهذا الأسبوع",done:false},{id:"n1",type:"text",text:"هذه مساحتك. أضف المهام والملاحظات والأفكار بحرية."}], children:[] },
  { id:"study", title:"الدراسة", icon:"📚", blocks:[{id:"t2",type:"task",text:"مراجعة الدروس",done:false}], children:[] },
];
const makeId=()=>Date.now().toString(36)+Math.random().toString(36).slice(2,7);

export default function TasksRoute() {
  const [pages,setPages]=useState<Page[]>(seed);
  const [selected,setSelected]=useState("inbox");
  const [ready,setReady]=useState(false);
  const [modal,setModal]=useState<"page"|"task"|"text"|"rename"|null>(null);
  const [draft,setDraft]=useState("");
  const [icon,setIcon]=useState("📄");
  const [parentId,setParentId]=useState<string|null>(null);

  useEffect(()=>{ try { const raw=globalThis.localStorage?.getItem(KEY); if(raw){const parsed=JSON.parse(raw) as Page[]; if(Array.isArray(parsed)&&parsed.length){setPages(parsed);setSelected(parsed[0].id);}} } catch {} setReady(true); },[]);
  useEffect(()=>{ if(ready) try { globalThis.localStorage?.setItem(KEY,JSON.stringify(pages)); } catch {} },[pages,ready]);

  const flat=useMemo(()=>{const out:{page:Page;depth:number;parent:string|null}[]=[];const walk=(list:Page[],depth:number,parent:string|null)=>list.forEach(p=>{out.push({page:p,depth,parent});walk(p.children,depth+1,p.id);});walk(pages,0,null);return out;},[pages]);
  const current=flat.find(x=>x.page.id===selected)?.page ?? pages[0];
  const updateTree=(list:Page[],id:string,fn:(p:Page)=>Page):Page[]=>list.map(p=>p.id===id?fn(p):({...p,children:updateTree(p.children,id,fn)}));
  const addPage=()=>{if(!draft.trim())return;const p:Page={id:makeId(),title:draft.trim(),icon,blocks:[],children:[]};setPages(old=>parentId?updateTree(old,parentId,x=>({...x,children:[...x.children,p]})):[...old,p]);setSelected(p.id);close();};
  const addBlock=(type:"task"|"text")=>{if(!draft.trim()||!current)return;const b:Block={id:makeId(),type,text:draft.trim(),done:false};setPages(old=>updateTree(old,current.id,p=>({...p,blocks:[...p.blocks,b]})));close();};
  const toggle=(id:string)=>{if(!current)return;setPages(old=>updateTree(old,current.id,p=>({...p,blocks:p.blocks.map(b=>b.id===id?{...b,done:!b.done}:b)})));};
  const close=()=>{setModal(null);setDraft("");setIcon("📄");setParentId(null);};
  const openPage=(parent:string|null=null)=>{setParentId(parent);setModal("page");setDraft("");};
  const saveRename=()=>{if(!draft.trim()||!current)return;setPages(old=>updateTree(old,current.id,p=>({...p,title:draft.trim()})));close();};
  const removePage=()=>{if(!current||pages.length===1)return;const remove=(list:Page[]):Page[]=>list.filter(p=>p.id!==current.id).map(p=>({...p,children:remove(p.children)}));const next=remove(pages);setPages(next);setSelected(next[0].id);};
  const doneCount=current?.blocks.filter(b=>b.type==="task"&&b.done).length??0;
  const taskCount=current?.blocks.filter(b=>b.type==="task").length??0;

  return <View style={s.root}>
    <View style={s.heading}><Text style={s.eyebrow}>OMNIMIND · مساحة العمل</Text><Text style={s.title}>المهام والصفحات</Text><Text style={s.subtitle}>أنشئ صفحاتك، نظّم أفكارك، واجمع مهامك في مكان واحد.</Text></View>
    <View style={s.workspace}>
      <View style={s.sidebar}>
        <View style={s.sideHead}><Text style={s.sideTitle}>مساحة الصفحات</Text><Pressable onPress={()=>openPage()} style={s.addSmall}><Text style={s.addSmallText}>＋</Text></Pressable></View>
        <Pressable onPress={()=>openPage()} style={s.newPage}><Text style={s.newPageText}>＋ صفحة جديدة</Text></Pressable>
        <ScrollView showsVerticalScrollIndicator={false}>
          {flat.map(({page,depth})=><Pressable key={page.id} onPress={()=>setSelected(page.id)} style={[s.pageItem,selected===page.id&&s.pageSelected,{paddingRight:10+depth*13}]}><Text style={s.pageEmoji}>{page.icon}</Text><Text numberOfLines={1} style={[s.pageName,selected===page.id&&s.pageNameActive]}>{page.title}</Text></Pressable>)}
        </ScrollView>
        <Text style={s.sidebarFoot}>تُحفظ الصفحات على هذا الجهاز حالياً</Text>
      </View>
      <View style={s.editor}>
        {current?<>
          <View style={s.editorTop}><Text style={s.breadcrumb}>مساحة العمل  /  {current.title}</Text><View style={s.actions}><Pressable onPress={()=>openPage(current.id)} style={s.iconAction}><Text>＋</Text></Pressable><Pressable onPress={()=>{setDraft(current.title);setModal("rename");}} style={s.iconAction}><Text>✎</Text></Pressable></View></View>
          <View style={s.pageHero}><Text style={s.heroEmoji}>{current.icon}</Text><Text style={s.pageTitle}>{current.title}</Text><Text style={s.pageMeta}>{taskCount} مهام · {doneCount} مكتملة</Text></View>
          <View style={s.toolbar}><Pressable onPress={()=>setModal("task")} style={s.toolPrimary}><Text style={s.toolPrimaryText}>＋ إضافة مهمة</Text></Pressable><Pressable onPress={()=>setModal("text")} style={s.toolSecondary}><Text style={s.toolSecondaryText}>＋ نص / ملاحظة</Text></Pressable><Pressable onPress={()=>openPage(current.id)} style={s.toolSecondary}><Text style={s.toolSecondaryText}>＋ صفحة فرعية</Text></Pressable></View>
          <ScrollView style={s.blocks} contentContainerStyle={{paddingBottom:32}} showsVerticalScrollIndicator={false}>
            {current.blocks.map(b=><View key={b.id} style={s.block}>{b.type==="task"?<><Pressable onPress={()=>toggle(b.id)} style={[s.checkbox,b.done&&s.checked]}>{b.done?<Text style={s.tick}>✓</Text>:null}</Pressable><Text style={[s.blockText,b.done&&s.completed]}>{b.text}</Text></>:<><Text style={s.noteMark}>¶</Text><Text style={s.blockText}>{b.text}</Text></>}</View>)}
            {current.children.map(p=><Pressable key={p.id} onPress={()=>setSelected(p.id)} style={s.childPage}><Text style={s.pageEmoji}>{p.icon}</Text><Text style={s.childTitle}>{p.title}</Text><Text style={s.chevron}>‹</Text></Pressable>)}
            {!current.blocks.length&&!current.children.length?<View style={s.empty}><Text style={s.emptyIcon}>✧</Text><Text style={s.emptyTitle}>ابدأ بناء صفحتك</Text><Text style={s.emptyText}>أضف مهمة أو ملاحظة أو أنشئ صفحة فرعية.</Text></View>:null}
            {current.id!=="inbox"?<Pressable onPress={removePage} style={s.deletePage}><Text style={s.deleteText}>حذف هذه الصفحة</Text></Pressable>:null}
          </ScrollView>
        </>:null}
      </View>
    </View>
    <Modal visible={!!modal} transparent animationType="fade" onRequestClose={close}>
      <View style={s.overlay}><View style={s.dialog}>
        <Text style={s.dialogTitle}>{modal==="page"?"إنشاء صفحة جديدة":modal==="task"?"إضافة مهمة":modal==="text"?"إضافة نص أو ملاحظة":"إعادة تسمية الصفحة"}</Text>
        <TextInput value={draft} onChangeText={setDraft} placeholder={modal==="page"?"اسم الصفحة":modal==="task"?"اكتب المهمة":modal==="text"?"اكتب ملاحظتك":"اسم الصفحة الجديد"} placeholderTextColor="#9AA5B4" style={s.input} autoFocus />
        {modal==="page"?<View style={s.iconPicker}>{icons.map(i=><Pressable key={i} onPress={()=>setIcon(i)} style={[s.iconChoice,icon===i&&s.iconChosen]}><Text style={{fontSize:21}}>{i}</Text></Pressable>)}</View>:null}
        <View style={s.dialogActions}><Pressable onPress={close} style={s.cancel}><Text style={s.cancelText}>إلغاء</Text></Pressable><Pressable onPress={()=>modal==="page"?addPage():modal==="task"?addBlock("task"):modal==="text"?addBlock("text"):saveRename()} style={s.confirm}><Text style={s.confirmText}>حفظ</Text></Pressable></View>
      </View></View>
    </Modal>
  </View>;
}

const s=StyleSheet.create({
 root:{flex:1,minHeight:0,width:"100%",backgroundColor:"#F8FAFC",paddingHorizontal:0,paddingTop:0,paddingBottom:0},
 heading:{alignItems:"flex-end",marginBottom:0,paddingHorizontal:20,paddingTop:18,paddingBottom:14},eyebrow:{fontSize:10,fontWeight:"800",letterSpacing:1,color:"#397DEB"},title:{fontSize:25,fontWeight:"800",color:"#172033",marginTop:5},subtitle:{fontSize:12,color:"#8491A4",marginTop:4,textAlign:"right"},
 workspace:{flex:1,minHeight:0,width:"100%",flexDirection:"row-reverse",backgroundColor:"#FFF",borderTopWidth:1,borderColor:"#E9EDF3",borderRadius:0,overflow:"hidden"},
 sidebar:{width:150,backgroundColor:"#FBFCFE",borderLeftWidth:1,borderLeftColor:"#E9EDF3",padding:12},sideHead:{flexDirection:"row",alignItems:"center",justifyContent:"space-between",marginBottom:10},sideTitle:{fontSize:11,fontWeight:"800",color:"#536176"},addSmall:{width:25,height:25,borderRadius:8,backgroundColor:"#E8F1FF",alignItems:"center",justifyContent:"center"},addSmallText:{fontSize:19,color:"#397DEB"},newPage:{backgroundColor:"#397DEB",borderRadius:8,paddingVertical:8,alignItems:"center",marginBottom:10},newPageText:{color:"#FFF",fontSize:10,fontWeight:"800"},pageItem:{minHeight:35,borderRadius:7,flexDirection:"row-reverse",alignItems:"center",gap:5,paddingHorizontal:5,marginBottom:3},pageSelected:{backgroundColor:"#E8F1FF"},pageEmoji:{fontSize:14},pageName:{flex:1,fontSize:11,color:"#64748B",textAlign:"right"},pageNameActive:{color:"#397DEB",fontWeight:"800"},sidebarFoot:{fontSize:8,color:"#A0AABA",textAlign:"center",marginTop:8},
 editor:{flex:1,minWidth:0,paddingHorizontal:clamp(18, 3vw, 42),paddingTop:18},editorTop:{flexDirection:"row-reverse",alignItems:"center",justifyContent:"space-between"},breadcrumb:{fontSize:9,color:"#9AA5B4",flex:1,textAlign:"right"},actions:{flexDirection:"row",gap:5},iconAction:{width:28,height:28,borderWidth:1,borderColor:"#E9EDF3",borderRadius:7,alignItems:"center",justifyContent:"center"},pageHero:{alignItems:"flex-end",marginTop:21,marginBottom:16},heroEmoji:{fontSize:30},pageTitle:{fontSize:23,fontWeight:"800",color:"#172033",marginTop:6,textAlign:"right"},pageMeta:{fontSize:10,color:"#9AA5B4",marginTop:5},toolbar:{flexDirection:"row-reverse",flexWrap:"wrap",gap:6,paddingBottom:12,borderBottomWidth:1,borderBottomColor:"#EEF1F5"},toolPrimary:{backgroundColor:"#397DEB",borderRadius:8,paddingHorizontal:9,paddingVertical:8},toolPrimaryText:{fontSize:10,fontWeight:"800",color:"#FFF"},toolSecondary:{backgroundColor:"#F4F7FB",borderRadius:8,paddingHorizontal:8,paddingVertical:8},toolSecondaryText:{fontSize:9,fontWeight:"700",color:"#536176"},blocks:{flex:1,marginTop:8},block:{minHeight:43,flexDirection:"row-reverse",alignItems:"center",gap:9,borderBottomWidth:1,borderBottomColor:"#F1F3F6",paddingVertical:8},checkbox:{width:18,height:18,borderWidth:1.5,borderColor:"#B8C3D1",borderRadius:5,alignItems:"center",justifyContent:"center"},checked:{backgroundColor:"#35BE62",borderColor:"#35BE62"},tick:{fontSize:12,color:"#FFF",fontWeight:"900"},blockText:{flex:1,fontSize:12,color:"#344256",textAlign:"right",lineHeight:20},completed:{color:"#9AA5B4",textDecorationLine:"line-through"},noteMark:{fontSize:20,color:"#9658E8",fontWeight:"700"},childPage:{minHeight:40,flexDirection:"row-reverse",alignItems:"center",gap:9,borderBottomWidth:1,borderBottomColor:"#F1F3F6"},childTitle:{flex:1,fontSize:12,color:"#397DEB",fontWeight:"700",textAlign:"right"},chevron:{fontSize:22,color:"#9AA5B4"},empty:{alignItems:"center",paddingVertical:40},emptyIcon:{fontSize:30,color:"#9658E8"},emptyTitle:{fontSize:14,fontWeight:"800",color:"#344256",marginTop:8},emptyText:{fontSize:11,color:"#9AA5B4",marginTop:5,textAlign:"center"},deletePage:{alignSelf:"flex-end",padding:10},deleteText:{fontSize:10,color:"#D65C65"},
 overlay:{flex:1,backgroundColor:"rgba(15,23,42,.35)",alignItems:"center",justifyContent:"center",padding:22},dialog:{width:"100%",maxWidth:390,backgroundColor:"#FFF",borderRadius:16,padding:18},dialogTitle:{fontSize:17,fontWeight:"800",color:"#172033",textAlign:"right",marginBottom:14},input:{height:45,borderWidth:1,borderColor:"#E2E8F0",borderRadius:9,paddingHorizontal:12,textAlign:"right",color:"#172033",fontSize:13},iconPicker:{flexDirection:"row-reverse",gap:7,marginTop:12},iconChoice:{width:34,height:34,borderRadius:8,backgroundColor:"#F4F7FB",alignItems:"center",justifyContent:"center"},iconChosen:{borderWidth:2,borderColor:"#397DEB",backgroundColor:"#E8F1FF"},dialogActions:{flexDirection:"row-reverse",gap:8,marginTop:17},cancel:{paddingHorizontal:18,paddingVertical:10,borderRadius:8,backgroundColor:"#F1F5F9"},cancelText:{color:"#64748B",fontSize:12,fontWeight:"700"},confirm:{paddingHorizontal:22,paddingVertical:10,borderRadius:8,backgroundColor:"#397DEB"},confirmText:{color:"#FFF",fontSize:12,fontWeight:"800"}
});
