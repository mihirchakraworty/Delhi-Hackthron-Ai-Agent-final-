import React from "react";

const ITEMS = [
  { icon:"🚆", label:"Transport",    amount:500 },
  { icon:"🏨", label:"Hotel",        amount:1200 },
  { icon:"🍽️", label:"Food",         amount:800 },
  { icon:"🚕", label:"Local Travel", amount:500 },
];
const total = ITEMS.reduce((s,i) => s+i.amount, 0);
const budget = 4000;
const pct = Math.round((total/budget)*100);

export default function BudgetBreakdown() {
  return (
    <div className="card" style={{ padding:28 }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:24 }}>
        <div>
          <div style={{ fontSize:18, fontWeight:700, color:"var(--white)" }}>💰 Budget Breakdown</div>
          <div style={{ fontSize:12, color:"var(--muted)", marginTop:4 }}>Estimated trip cost</div>
        </div>
        <span style={{ fontSize:11, padding:"5px 12px", borderRadius:99,
                       background:"rgba(52,211,153,.1)", color:"var(--green)",
                       border:"1px solid rgba(52,211,153,.2)", fontWeight:600 }}>
          Budget Friendly
        </span>
      </div>

      <div style={{ display:"flex", flexDirection:"column", gap:10, marginBottom:20 }}>
        {ITEMS.map(it => (
          <div key={it.label} style={{
            display:"flex", justifyContent:"space-between", alignItems:"center",
            padding:"14px 18px", borderRadius:12, background:"var(--deep)",
          }}>
            <span style={{ fontSize:14, color:"var(--body)" }}>{it.icon} {it.label}</span>
            <span style={{ fontSize:14, fontWeight:700, color:"var(--white)" }}>₹{it.amount.toLocaleString()}</span>
          </div>
        ))}
      </div>

      <div style={{ borderTop:"1px solid var(--rim)", paddingTop:16, display:"flex",
                    justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
        <span style={{ fontSize:15, fontWeight:600, color:"var(--white)" }}>Total Estimate</span>
        <span style={{ fontFamily:"'Syne',sans-serif", fontSize:24, fontWeight:900, color:"var(--sky)" }}>
          ₹{total.toLocaleString()}
        </span>
      </div>

      <div>
        <div style={{ display:"flex", justifyContent:"space-between", fontSize:12,
                      color:"var(--muted)", marginBottom:8 }}>
          <span>Budget used</span><span>{pct}%</span>
        </div>
        <div style={{ height:8, background:"var(--deep)", borderRadius:99, overflow:"hidden" }}>
          <div style={{ height:"100%", width:`${pct}%`, background:"var(--grad-btn)", borderRadius:99,
                        transition:"width .6s ease" }} />
        </div>
        <div style={{ fontSize:12, color:"var(--muted)", marginTop:8 }}>
          ₹{(budget-total).toLocaleString()} remaining of ₹{budget.toLocaleString()} budget
        </div>
      </div>
    </div>
  );
}
