import { useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { createGoalId, type GoalPriority, type PlanningGoal, type PlanningPeriod } from "../types";
import { loadPlanningGoals, savePlanningGoals } from "../storage";

const C = { bg: "#F8FAFC", white: "#FFFFFF", ink: "#0F172A", muted: "#64748B", green: "#22C55E", greenSoft: "#F0FDF4", blue: "#3882F6", border: "#E5E7EB", orange: "#F97316" };
const today = () => new Date().toISOString().slice(0, 10);
const plusDays = (date: string, days: number) => { const d = new Date(date + "T12:00:00"); d.setDate(d.getDate() + days); return d.toISOString().slice(0, 10); };
const periodLabel: Record<PlanningPeriod, string> = { month: "شهري", week: "أسبوعي", day: "يومي" };
const priorityLabel: Record<GoalPriority, string> = { high: "عالية", medium: "متوسطة", low: "منخفضة" };

export default function PlanningScreen() {
  const [goals, setGoals] = useState<PlanningGoal[]>(loadPlanningGoals);
  const [period, setPeriod] = useState<PlanningPeriod | "calendar">("month");
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [startDate, setStartDate] = useState(today());
  const [endDate, setEndDate] = useState(plusDays(today(), 30));
  const [priority, setPriority] = useState<GoalPriority>("medium");
  const [parentId, setParentId] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState(today());
  const [calendarMonth, setCalendarMonth] = useState(new Date(today() + "T12:00:00"));

  const update = (next: PlanningGoal[]) => { setGoals(next); savePlanningGoals(next); };
  const visible = useMemo(() => period === "calendar" ? goals.filter(g => g.startDate <= selectedDate && g.endDate >= selectedDate) : goals.filter(g => g.period === period), [goals, period, selectedDate]);
  const completed = goals.filter(g => g.status === "done").length;
  const active = goals.filter(g => g.status === "active").length;
  const overall = goals.length ? Math.round(completed / goals.length * 100) : 0;

  const addGoal = () => {
    const clean = title.trim();
    if (!clean || endDate < startDate) return;
    const parent = goals.find(g => g.id === parentId);
    const next: PlanningGoal = { id: createGoalId(), title: clean, period: period === "calendar" ? "day" : period, startDate, endDate, priority, status: "active", parentId: parent?.id ?? null, notes: notes.trim(), createdAt: new Date().toISOString() };
    update([next, ...goals]);
    setTitle(""); setNotes(""); setParentId(null);
  };

  const toggleGoal = (id: string) => update(goals.map(g => g.id === id ? { ...g, status: g.status === "done" ? "active" : "done" } : g));
  const removeGoal = (id: string) => update(goals.filter(g => g.id !== id && g.parentId !== id));

  const splitGoal = (goal: PlanningGoal, target: PlanningPeriod) => {
    const days = Math.max(1, Math.ceil((new Date(goal.endDate + "T12:00:00").getTime() - new Date(goal.startDate + "T12:00:00").getTime()) / 86400000) + 1);
    const count = target === "week" ? Math.min(4, Math.max(1, Math.ceil(days / 7))) : Math.min(7, days);
    const chunk = Math.max(1, Math.ceil(days / count));
    const children: PlanningGoal[] = Array.from({ length: count }, (_, i) => {
      const from = plusDays(goal.startDate, i * chunk);
      const to = plusDays(goal.startDate, Math.min(days - 1, (i + 1) * chunk - 1));
      return { id: createGoalId(), title: target === "week" ? `الأسبوع ${i + 1}: ${goal.title}` : `اليوم ${i + 1}: ${goal.title}`, period: target, startDate: from, endDate: to, priority: goal.priority, status: "active", parentId: goal.id, notes: "", createdAt: new Date().toISOString() };
    });
    update([...children, ...goals]);
  };

  const monthStart = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), 1);
  const offset = (monthStart.getDay() + 6) % 7;
  const daysInMonth = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 0).getDate();
  const monthCells = [...Array(offset).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];
  const dateForDay = (day: number) => `${calendarMonth.getFullYear()}-${String(calendarMonth.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  const hasGoal = (day: number) => goals.some(g => g.startDate <= dateForDay(day) && g.endDate >= dateForDay(day));

  return (
    <ScrollView style={s.screen} contentContainerStyle={s.content}>
      <View style={s.heading}><View><Text style={s.eyebrow}>OMNIMIND · MODULE 04</Text><Text style={s.title}>التخطيط</Text><Text style={s.subtitle}>حوّل أهدافك إلى خطوات واضحة موزعة على وقتك.</Text></View><View style={s.headingIcon}><Text style={{fontSize:22}}>▦</Text></View></View>

      <View style={s.stats}>
        <View style={s.stat}><Text style={s.statValue}>{overall}%</Text><Text style={s.statLabel}>إنجاز الأهداف</Text><View style={s.progressTrack}><View style={[s.progressFill,{width: overall + "%"}]}/></View></View>
        <View style={s.stat}><Text style={s.statValue}>{active}</Text><Text style={s.statLabel}>أهداف نشطة</Text></View>
        <View style={s.stat}><Text style={s.statValue}>{completed}</Text><Text style={s.statLabel}>أهداف مكتملة</Text></View>
      </View>

      <View style={s.tabs}>{(["month","week","day","calendar"] as const).map(key => <Pressable key={key} onPress={() => setPeriod(key)} style={[s.tab,period===key && s.tabActive]}><Text style={[s.tabText,period===key && s.tabTextActive]}>{key==="calendar"?"التقويم":periodLabel[key]}</Text></Pressable>)}</View>

      {period === "calendar" ? <View style={s.card}>
        <View style={s.calendarHeader}><Pressable onPress={()=>setCalendarMonth(new Date(calendarMonth.getFullYear(),calendarMonth.getMonth()-1,1))}><Text style={s.arrow}>‹</Text></Pressable><Text style={s.cardTitle}>{calendarMonth.toLocaleDateString("ar",{month:"long",year:"numeric"})}</Text><Pressable onPress={()=>setCalendarMonth(new Date(calendarMonth.getFullYear(),calendarMonth.getMonth()+1,1))}><Text style={s.arrow}>›</Text></Pressable></View>
        <View style={s.calendarGrid}>{["إث","ث","أر","خ","ج","س","أح"].map((d,i)=><Text key={i} style={s.weekday}>{d}</Text>)}{monthCells.map((day,i)=>day===null?<View key={"blank"+i} style={s.dayCell}/>:<Pressable key={day} onPress={()=>setSelectedDate(dateForDay(day))} style={[s.dayCell,selectedDate===dateForDay(day)&&s.daySelected]}><Text style={[s.dayText,selectedDate===dateForDay(day)&&s.dayTextSelected]}>{day}</Text>{hasGoal(day)?<View style={s.dayDot}/>:null}</Pressable>)}</View>
        <Text style={s.selectedDate}>أهداف {new Date(selectedDate+"T12:00:00").toLocaleDateString("ar",{weekday:"long",day:"numeric",month:"long"})}</Text>
      </View> : null}

      <View style={s.card}>
        <Text style={s.cardTitle}>إنشاء هدف {period==="calendar"?"يومي":periodLabel[period]}</Text>
        <TextInput value={title} onChangeText={setTitle} placeholder="ما الذي تريد تحقيقه؟" placeholderTextColor="#94A3B8" style={s.input}/>
        <TextInput value={notes} onChangeText={setNotes} placeholder="ملاحظات أو تفاصيل (اختياري)" placeholderTextColor="#94A3B8" style={[s.input,s.notes]}/>
        <Text style={s.fieldLabel}>اربطه بهدف أكبر (اختياري)</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.choiceRow}>
          <Pressable onPress={()=>setParentId(null)} style={[s.choice,parentId===null&&s.choiceActive]}><Text style={[s.choiceText,parentId===null&&s.choiceTextActive]}>بدون ربط</Text></Pressable>
          {goals.filter(g=>g.status==="active" && g.period!==(period==="calendar"?"day":period)).map(g=><Pressable key={g.id} onPress={()=>setParentId(g.id)} style={[s.choice,parentId===g.id&&s.choiceActive]}><Text style={[s.choiceText,parentId===g.id&&s.choiceTextActive]}>{g.title}</Text></Pressable>)}
        </ScrollView>
        <Text style={s.fieldLabel}>الأولوية</Text>
        <View style={s.choiceRow}>{(["high","medium","low"] as const).map(p=><Pressable key={p} onPress={()=>setPriority(p)} style={[s.choice,priority===p&&s.choiceActive]}><Text style={[s.choiceText,priority===p&&s.choiceTextActive]}>{priorityLabel[p]}</Text></Pressable>)}</View>
        <View style={s.dateRow}><View style={{flex:1}}><Text style={s.fieldLabel}>من تاريخ</Text><TextInput value={startDate} onChangeText={setStartDate} placeholder="YYYY-MM-DD" style={s.dateInput}/></View><View style={{flex:1}}><Text style={s.fieldLabel}>إلى تاريخ</Text><TextInput value={endDate} onChangeText={setEndDate} placeholder="YYYY-MM-DD" style={s.dateInput}/></View></View>
        <Pressable onPress={addGoal} style={s.primary}><Text style={s.primaryText}>＋ إضافة الهدف</Text></Pressable>
        {endDate < startDate ? <Text style={s.error}>تاريخ النهاية يجب أن يكون بعد تاريخ البداية.</Text> : null}
      </View>

      <View style={s.listHeader}><Text style={s.cardTitle}>{period==="calendar"?"أهداف هذا اليوم":`أهداف ${periodLabel[period]}`}</Text><Text style={s.count}>{visible.length} هدف</Text></View>
      {visible.length===0 ? <View style={s.empty}><Text style={s.emptyIcon}>◎</Text><Text style={s.emptyTitle}>لا توجد أهداف هنا بعد</Text><Text style={s.emptyText}>أضف هدفك الأول وابدأ بتقسيمه إلى خطوات.</Text></View> : visible.map(goal=>{
        const children=goals.filter(g=>g.parentId===goal.id);
        return <View key={goal.id} style={s.goalCard}>
          <View style={s.goalTop}><Pressable onPress={()=>toggleGoal(goal.id)} style={[s.checkbox,goal.status==="done"&&s.checkboxDone]}><Text style={s.checkMark}>{goal.status==="done"?"✓":""}</Text></Pressable><View style={{flex:1}}><Text style={[s.goalTitle,goal.status==="done"&&s.goalDone]}>{goal.title}</Text><Text style={s.goalDates}>{goal.startDate} — {goal.endDate}</Text></View><View style={[s.priorityDot,{backgroundColor:goal.priority==="high"?"#EF4444":goal.priority==="medium"?C.orange:C.green}]}/></View>
          {goal.notes ? <Text style={s.goalNotes}>{goal.notes}</Text> : null}
          <View style={s.goalFooter}><Text style={s.meta}>{priorityLabel[goal.priority]} · {children.length} خطوات فرعية</Text><View style={s.actions}>{goal.period==="month"&&children.length===0?<Pressable onPress={()=>splitGoal(goal,"week")}><Text style={s.action}>تقسيم أسبوعي</Text></Pressable>:null}{goal.period==="week"&&children.length===0?<Pressable onPress={()=>splitGoal(goal,"day")}><Text style={s.action}>تقسيم يومي</Text></Pressable>:null}<Pressable onPress={()=>removeGoal(goal.id)}><Text style={s.delete}>حذف</Text></Pressable></View></View>
          {children.length>0?<View style={s.children}>{children.map(child=><Pressable key={child.id} onPress={()=>toggleGoal(child.id)} style={s.childRow}><Text style={s.childCheck}>{child.status==="done"?"✓":"○"}</Text><Text style={[s.childTitle,child.status==="done"&&s.goalDone]}>{child.title}</Text><Text style={s.childDate}>{child.startDate}</Text></Pressable>)}</View>:null}
        </View>;
      })}
      <Text style={s.footerNote}>تُحفظ أهداف التخطيط محليًا على هذا الجهاز حاليًا. المزامنة بين الأجهزة وربطها بقاعدة البيانات ستكون ضمن مرحلة التكامل.</Text>
    </ScrollView>
  );
}

const s=StyleSheet.create({
 screen:{flex:1,backgroundColor:C.bg},content:{padding:20,paddingBottom:112,gap:16,maxWidth:1100,width:"100%",alignSelf:"center"},
 heading:{flexDirection:"row-reverse",alignItems:"center",justifyContent:"space-between",gap:12},eyebrow:{fontSize:10,fontWeight:"800",letterSpacing:1,color:C.green,textAlign:"right"},title:{fontSize:27,fontWeight:"800",color:C.ink,textAlign:"right",marginTop:5},subtitle:{fontSize:13,color:C.muted,textAlign:"right",marginTop:4},headingIcon:{width:48,height:48,borderRadius:15,backgroundColor:C.greenSoft,alignItems:"center",justifyContent:"center"},
 stats:{flexDirection:"row-reverse",gap:9},stat:{flex:1,minWidth:0,backgroundColor:C.white,borderWidth:1,borderColor:C.border,borderRadius:15,padding:12,alignItems:"flex-end"},statValue:{fontSize:22,fontWeight:"800",color:C.ink},statLabel:{fontSize:10,color:C.muted,marginTop:3},progressTrack:{height:4,width:"100%",backgroundColor:"#E2E8F0",borderRadius:5,marginTop:9},progressFill:{height:4,backgroundColor:C.green,borderRadius:5},
 tabs:{flexDirection:"row-reverse",gap:6,backgroundColor:"#EDF2F7",padding:5,borderRadius:13},tab:{flex:1,paddingVertical:10,alignItems:"center",borderRadius:10},tabActive:{backgroundColor:C.white,elevation:1},tabText:{fontSize:12,color:C.muted,fontWeight:"700"},tabTextActive:{color:C.blue},
 card:{backgroundColor:C.white,borderWidth:1,borderColor:C.border,borderRadius:17,padding:16,gap:12},cardTitle:{fontSize:16,fontWeight:"800",color:C.ink,textAlign:"right"},input:{borderWidth:1,borderColor:C.border,borderRadius:10,paddingHorizontal:12,paddingVertical:11,textAlign:"right",fontSize:13,color:C.ink,backgroundColor:"#FCFDFE"},notes:{minHeight:64,textAlignVertical:"top"},fieldLabel:{fontSize:11,color:C.muted,fontWeight:"700",textAlign:"right"},choiceRow:{flexDirection:"row-reverse",gap:7,alignItems:"center"},choice:{paddingHorizontal:12,paddingVertical:8,borderRadius:9,borderWidth:1,borderColor:C.border,backgroundColor:C.white},choiceActive:{borderColor:C.green,backgroundColor:C.greenSoft},choiceText:{fontSize:11,color:C.muted},choiceTextActive:{color:"#15803D",fontWeight:"800"},dateRow:{flexDirection:"row-reverse",gap:10},dateInput:{borderWidth:1,borderColor:C.border,borderRadius:9,padding:10,fontSize:12,color:C.ink,textAlign:"center"},primary:{backgroundColor:C.green,borderRadius:11,padding:13,alignItems:"center"},primaryText:{color:"#FFFFFF",fontSize:13,fontWeight:"800"},error:{fontSize:11,color:"#DC2626",textAlign:"right"},
 listHeader:{flexDirection:"row-reverse",alignItems:"center",justifyContent:"space-between"},count:{fontSize:11,color:C.muted},empty:{backgroundColor:C.white,borderWidth:1,borderColor:C.border,borderRadius:16,padding:28,alignItems:"center",gap:6},emptyIcon:{fontSize:30,color:"#94A3B8"},emptyTitle:{fontSize:14,fontWeight:"800",color:C.ink},emptyText:{fontSize:12,color:C.muted,textAlign:"center"},
 goalCard:{backgroundColor:C.white,borderWidth:1,borderColor:C.border,borderRadius:15,padding:14,gap:10},goalTop:{flexDirection:"row-reverse",alignItems:"center",gap:10},checkbox:{width:22,height:22,borderRadius:7,borderWidth:1.5,borderColor:"#CBD5E1",alignItems:"center",justifyContent:"center"},checkboxDone:{backgroundColor:C.green,borderColor:C.green},checkMark:{color:"#FFFFFF",fontWeight:"900"},goalTitle:{fontSize:14,fontWeight:"800",color:C.ink,textAlign:"right"},goalDone:{color:"#94A3B8",textDecorationLine:"line-through"},goalDates:{fontSize:10,color:C.muted,textAlign:"right",marginTop:4},priorityDot:{width:8,height:8,borderRadius:4},goalNotes:{fontSize:12,color:C.muted,textAlign:"right",lineHeight:19},goalFooter:{flexDirection:"row-reverse",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:8},meta:{fontSize:10,color:C.muted},actions:{flexDirection:"row-reverse",gap:14},action:{fontSize:11,color:C.blue,fontWeight:"800"},delete:{fontSize:11,color:"#EF4444"},children:{borderTopWidth:1,borderTopColor:C.border,paddingTop:8,gap:8},childRow:{flexDirection:"row-reverse",alignItems:"center",gap:8},childCheck:{fontSize:15,color:C.green},childTitle:{flex:1,textAlign:"right",fontSize:11,color:C.ink},childDate:{fontSize:9,color:C.muted},
 calendarHeader:{flexDirection:"row",justifyContent:"space-between",alignItems:"center"},arrow:{fontSize:25,color:C.blue,paddingHorizontal:8},calendarGrid:{flexDirection:"row-reverse",flexWrap:"wrap"},weekday:{width:"14.285%",textAlign:"center",fontSize:10,color:C.muted,paddingVertical:8,fontWeight:"800"},dayCell:{width:"14.285%",height:39,alignItems:"center",justifyContent:"center",gap:2,borderRadius:9},daySelected:{backgroundColor:C.blue},dayText:{fontSize:12,color:C.ink},dayTextSelected:{color:"#FFFFFF",fontWeight:"800"},dayDot:{width:4,height:4,borderRadius:2,backgroundColor:C.green},selectedDate:{fontSize:12,color:C.muted,textAlign:"right",marginTop:6},
 footerNote:{fontSize:10,color:C.muted,textAlign:"center",lineHeight:17,paddingHorizontal:12}
});
