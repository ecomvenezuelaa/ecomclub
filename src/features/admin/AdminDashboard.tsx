import React, { useState } from "react";
import { 
  Users, 
  DollarSign, 
  TrendingUp, 
  Activity, 
  CreditCard, 
  Building2, 
  Briefcase, 
  Save, 
  ArrowUpRight, 
  ArrowDownRight 
} from "lucide-react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  Cell 
} from "recharts";
import { motion } from "motion/react";

const revenueData = [
  { name: "Ene", value: 4000 },
  { name: "Feb", value: 3000 },
  { name: "Mar", value: 5000 },
  { name: "Abr", value: 4500 },
  { name: "May", value: 6000 },
  { name: "Jun", value: 5500 },
  { name: "Jul", value: 8500 },
];

const memberData = [
  { name: "Lunes", users: 400 },
  { name: "Martes", users: 300 },
  { name: "Miércoles", users: 200 },
  { name: "Jueves", users: 278 },
  { name: "Viernes", users: 189 },
  { name: "Sábado", users: 239 },
  { name: "Domingo", users: 349 },
];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<"stats" | "settings">("stats");
  const [bankInfo, setBankInfo] = useState({
    accountHolder: "Sarah Jenkins",
    bankName: "Global Bank",
    accountNumber: "**** **** **** 4562",
    routingNumber: "123456789",
  });

  const stats = [
    { label: "Miembros Totales", value: "12,450", change: "+12.5%", positive: true, icon: <Users className="text-blue-600" /> },
    { label: "Ingresos Mensuales", value: "$45,200", change: "+24.3%", positive: true, icon: <DollarSign className="text-green-600" /> },
    { label: "Tasa de Crecimiento", value: "8.2%", change: "-2.1%", positive: false, icon: <TrendingUp className="text-indigo-600" /> },
    { label: "Usuarios Activos", value: "3,120", change: "+5.4%", positive: true, icon: <Activity className="text-purple-600" /> },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Panel de Administración</h1>
          <p className="text-slate-500 font-medium">Gestiona tu comunidad y finanzas desde un solo lugar.</p>
        </div>
        <div className="flex bg-slate-100 p-1 rounded-2xl w-fit">
          <button 
            onClick={() => setActiveTab("stats")}
            className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${activeTab === 'stats' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Estadísticas
          </button>
          <button 
            onClick={() => setActiveTab("settings")}
            className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${activeTab === 'settings' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Configuración
          </button>
        </div>
      </div>

      {activeTab === "stats" ? (
        <div className="space-y-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <motion.div 
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-slate-50 rounded-2xl">
                    {stat.icon}
                  </div>
                  <div className={`flex items-center text-xs font-black ${stat.positive ? 'text-green-500' : 'text-red-500'}`}>
                    {stat.positive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                    {stat.change}
                  </div>
                </div>
                <p className="text-slate-500 text-xs font-black uppercase tracking-[0.1em]">{stat.label}</p>
                <p className="text-3xl font-black text-slate-900 mt-1">{stat.value}</p>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Main Chart */}
            <div className="lg:col-span-8 bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
              <h3 className="text-xl font-black text-slate-900 mb-8">Ingresos por Mes</h3>
              <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={revenueData}>
                    <defs>
                      <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 700 }}
                      dy={10}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 700 }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        borderRadius: '16px', 
                        border: 'none', 
                        boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                        fontWeight: 'bold'
                      }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="value" 
                      stroke="#4f46e5" 
                      strokeWidth={4}
                      fillOpacity={1} 
                      fill="url(#colorValue)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Sidebar Bar Chart */}
            <div className="lg:col-span-4 bg-slate-900 p-8 rounded-[2.5rem] border border-slate-800 shadow-xl text-white">
              <h3 className="text-xl font-black mb-2">Actividad Semanal</h3>
              <p className="text-slate-400 text-sm font-medium mb-8">Nuevos miembros registrados por día.</p>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={memberData}>
                    <Bar dataKey="users" radius={[10, 10, 10, 10]}>
                      {memberData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={index % 2 === 0 ? "#6366f1" : "#4f46e5"} />
                      ))}
                    </Bar>
                    <Tooltip 
                      cursor={{fill: 'transparent'}}
                      contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px', color: '#fff' }}
                      itemStyle={{ color: '#fff' }}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-6 flex items-center justify-between">
                <div className="text-center">
                  <p className="text-xs font-black text-slate-500 uppercase tracking-widest">Promedio</p>
                  <p className="text-xl font-black">284</p>
                </div>
                <div className="text-center">
                  <p className="text-xs font-black text-slate-500 uppercase tracking-widest">Pico</p>
                  <p className="text-xl font-black">400</p>
                </div>
                <div className="text-center">
                  <p className="text-xs font-black text-slate-500 uppercase tracking-widest">Total</p>
                  <p className="text-xl font-black">1.9k</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="grid grid-cols-1 md:grid-cols-12 gap-8"
        >
          {/* Bank Settings Cell */}
          <div className="md:col-span-12 bg-white rounded-[2.5rem] p-10 border border-slate-200 shadow-sm">
            <h3 className="text-2xl font-black text-slate-900 mb-2 flex items-center gap-3">
              <CreditCard className="text-indigo-600" /> Información Bancaria
            </h3>
            <p className="text-slate-500 font-medium mb-10">Gestiona dónde recibes tus pagos y revisa tu estado de cuenta.</p>
            
            <form className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Titular de la Cuenta</label>
                <div className="relative">
                  <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    type="text" 
                    value={bankInfo.accountHolder}
                    onChange={(e) => setBankInfo({...bankInfo, accountHolder: e.target.value})}
                    className="w-full bg-slate-50 border-2 border-transparent focus:border-indigo-100 focus:bg-white rounded-2xl py-4 pl-12 pr-4 text-sm font-bold transition-all outline-none"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Nombre del Banco</label>
                <div className="relative">
                  <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    type="text" 
                    value={bankInfo.bankName}
                    onChange={(e) => setBankInfo({...bankInfo, bankName: e.target.value})}
                    className="w-full bg-slate-50 border-2 border-transparent focus:border-indigo-100 focus:bg-white rounded-2xl py-4 pl-12 pr-4 text-sm font-bold transition-all outline-none"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Número de Cuenta</label>
                <div className="relative">
                  <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    type="text" 
                    value={bankInfo.accountNumber}
                    onChange={(e) => setBankInfo({...bankInfo, accountNumber: e.target.value})}
                    className="w-full bg-slate-50 border-2 border-transparent focus:border-indigo-100 focus:bg-white rounded-2xl py-4 pl-12 pr-4 text-sm font-bold transition-all outline-none"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Número de Ruta (SWIFT)</label>
                <div className="relative">
                  <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    type="text" 
                    value={bankInfo.routingNumber}
                    onChange={(e) => setBankInfo({...bankInfo, routingNumber: e.target.value})}
                    className="w-full bg-slate-50 border-2 border-transparent focus:border-indigo-100 focus:bg-white rounded-2xl py-4 pl-12 pr-4 text-sm font-bold transition-all outline-none"
                  />
                </div>
              </div>

              <div className="md:col-span-2 pt-6">
                <button 
                  type="button"
                  className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black flex items-center gap-3 hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100"
                >
                  <Save size={20} /> Guardar Cambios
                </button>
              </div>
            </form>
          </div>

          {/* Quick Info Cell */}
          <div className="md:col-span-12 bg-slate-50 border-2 border-slate-200 border-dashed rounded-[2.5rem] p-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm">
                <Activity size={32} />
              </div>
              <div>
                <h4 className="text-xl font-black text-slate-900">Estado de Cuenta Activo</h4>
                <p className="text-slate-500 font-medium">Tus pagos se procesan automáticamente cada lunes.</p>
              </div>
            </div>
            <button className="px-8 py-3 border-2 border-slate-200 rounded-2xl font-black text-slate-600 hover:bg-white transition-all">
              Ver Historial de Pagos
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
