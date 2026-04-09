/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { 
  Leaf, 
  Thermometer, 
  Droplets, 
  Sun, 
  Zap, 
  Wind, 
  Plus, 
  Trash2, 
  Edit3, 
  AlertTriangle, 
  CheckCircle2, 
  Info,
  ShieldCheck,
  TrendingUp,
  Target,
  ZapOff,
  LayoutDashboard,
  Settings,
  Activity,
  ChevronDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// --- Types ---

interface Polyhouse {
  id: string;
  name: string;
  crop: string;
  area: string;
}

interface EnvironmentalData {
  temp: number;
  humidity: number;
  vpd: number;
  ec: number;
  co2: number;
  dli: number;
}

// --- Components ---

const StatCard = ({ icon: Icon, label, value, unit, status }: { icon: any, label: string, value: string | number, unit: string, status: 'Low' | 'Optimal' | 'High' }) => {
  const statusColors = {
    Low: 'bg-blue-100 text-blue-700 border-blue-200',
    Optimal: 'bg-green-100 text-green-700 border-green-200',
    High: 'bg-red-100 text-red-700 border-red-200',
  };

  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="glass-card p-5 flex flex-col justify-between h-full"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="p-2 bg-agri-green-100 rounded-lg text-agri-green-600">
          <Icon size={20} />
        </div>
        <span className={`text-xs font-bold px-2 py-1 rounded-full border ${statusColors[status]}`}>
          {status}
        </span>
      </div>
      <div>
        <p className="text-sm text-agri-green-600 font-medium">{label}</p>
        <h3 className="text-2xl font-bold text-agri-green-900">
          {value}<span className="text-sm font-normal ml-1 opacity-70">{unit}</span>
        </h3>
      </div>
    </motion.div>
  );
};

const SectionTitle = ({ title, subtitle }: { title: string, subtitle?: string }) => (
  <div className="mb-8">
    <h2 className="text-3xl font-bold text-agri-green-900 flex items-center gap-2">
      <div className="w-2 h-8 bg-agri-green-500 rounded-full" />
      {title}
    </h2>
    {subtitle && <p className="text-agri-green-600 mt-1 ml-4">{subtitle}</p>}
  </div>
);

export default function App() {
  // --- State ---
  const [polyhouses, setPolyhouses] = useState<Polyhouse[]>([
    { id: '1', name: 'Alpha Unit', crop: 'Lettuce', area: '500 sqft' },
    { id: '2', name: 'Beta Wing', crop: 'Tomatoes', area: '1200 sqft' }
  ]);
  const [selectedPolyhouseId, setSelectedPolyhouseId] = useState('1');
  const [envData, setEnvData] = useState<EnvironmentalData>({
    temp: 24.5,
    humidity: 65,
    vpd: 1.2,
    ec: 1.8,
    co2: 450,
    dli: 15.2
  });

  const [newPolyhouse, setNewPolyhouse] = useState({ name: '', crop: '', area: '' });
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [paramAnalysis, setParamAnalysis] = useState<string | null>(null);
  const [recommendation, setRecommendation] = useState<string | null>(null);
  const [authStatus, setAuthStatus] = useState(false);

  // --- Simulation ---
  useEffect(() => {
    const interval = setInterval(() => {
      setEnvData(prev => ({
        ...prev,
        temp: +(prev.temp + (Math.random() - 0.5) * 0.2).toFixed(1),
        humidity: +(prev.humidity + (Math.random() - 0.5) * 0.5).toFixed(1),
        co2: +(prev.co2 + (Math.random() - 0.5) * 5).toFixed(0)
      }));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // --- Handlers ---
  const handleAddPolyhouse = () => {
    if (newPolyhouse.name && newPolyhouse.crop) {
      const id = Math.random().toString(36).substr(2, 9);
      setPolyhouses([...polyhouses, { ...newPolyhouse, id }]);
      setNewPolyhouse({ name: '', crop: '', area: '' });
    }
  };

  const handleDeletePolyhouse = () => {
    setPolyhouses(polyhouses.filter(p => p.id !== selectedPolyhouseId));
    if (polyhouses.length > 1) setSelectedPolyhouseId(polyhouses[0].id);
  };

  const analyzeParameters = () => {
    setParamAnalysis("Analyzing sensor data... All systems operational. VPD is slightly high, consider increasing humidity.");
    setTimeout(() => setParamAnalysis(null), 5000);
  };

  const analyzeCondition = (condition: string) => {
    if (condition === 'Yellow Leaves') setAnalysisResult('Critical: Nutrient Deficiency (Nitrogen)');
    else if (condition === 'Wilting') setAnalysisResult('Risk: Water Stress / High VPD');
    else if (condition === 'Spots') setAnalysisResult('Risk: Fungal Infection');
    else setAnalysisResult('Healthy: Optimal Growth');
  };

  const getRecommendation = (problem: string) => {
    if (problem === 'High EC') setRecommendation('Irrigation: Flush the system with pure water. Nutrients: Reduce concentration in next cycle.');
    else if (problem === 'Low CO2') setRecommendation('Climate: Increase ventilation or check CO2 enrichment system.');
    else if (problem === 'High Temp') setRecommendation('Climate: Activate cooling pads and fogging system. Increase air circulation.');
    else setRecommendation('System: All parameters within acceptable range.');
  };

  const getStatus = (val: number, type: keyof EnvironmentalData): 'Low' | 'Optimal' | 'High' => {
    const ranges = {
      temp: [18, 28],
      humidity: [50, 75],
      vpd: [0.8, 1.4],
      ec: [1.2, 2.2],
      co2: [400, 1000],
      dli: [12, 25]
    };
    const [min, max] = ranges[type];
    if (val < min) return 'Low';
    if (val > max) return 'High';
    return 'Optimal';
  };

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <header className="gradient-bg text-white py-12 px-6 shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 mix-blend-overlay">
          <img 
            src="https://picsum.photos/seed/hydroponics/1920/1080" 
            alt="Hydroponics Background" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <Leaf size={200} />
        </div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-sm">
                <Leaf className="text-white" size={32} />
              </div>
              <div>
                <h1 className="text-4xl font-black tracking-tight">Smart Hydroponics</h1>
                <p className="text-agri-green-100 font-medium">Management System</p>
              </div>
            </div>
            <button 
              onClick={() => setAuthStatus(!authStatus)}
              className="bg-white/10 hover:bg-white/20 px-6 py-2 rounded-full border border-white/30 transition-all font-semibold flex items-center gap-2"
            >
              {authStatus ? <CheckCircle2 size={18} /> : <ShieldCheck size={18} />}
              {authStatus ? 'Authenticated' : 'Login'}
            </button>
          </div>
          <p className="text-xl text-agri-green-50 max-w-2xl mt-6 font-light leading-relaxed">
            Real-Time Monitoring | Smart Farming | Sustainable Growth
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 -mt-10">
        {/* Real-Time Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
          <StatCard icon={Thermometer} label="Temperature" value={envData.temp} unit="°C" status={getStatus(envData.temp, 'temp')} />
          <StatCard icon={Droplets} label="Humidity" value={envData.humidity} unit="%" status={getStatus(envData.humidity, 'humidity')} />
          <StatCard icon={Wind} label="VPD" value={envData.vpd} unit="kPa" status={getStatus(envData.vpd, 'vpd')} />
          <StatCard icon={Zap} label="EC" value={envData.ec} unit="mS/cm" status={getStatus(envData.ec, 'ec')} />
          <StatCard icon={Activity} label="CO₂" value={envData.co2} unit="ppm" status={getStatus(envData.co2, 'co2')} />
          <StatCard icon={Sun} label="DLI" value={envData.dli} unit="mol/m²/d" status={getStatus(envData.dli, 'dli')} />
        </div>

        {/* Main Modules */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {/* Module 1: Environmental Parameters */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="glass-card p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-100 text-blue-600 rounded-lg"><Activity size={24} /></div>
              <h3 className="text-xl font-bold">Monitor Environmental Parameters</h3>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-agri-green-600">VPD (kPa)</label>
                <input type="number" placeholder="1.2" className="w-full p-3 bg-agri-green-50 border border-agri-green-200 rounded-xl focus:ring-2 focus:ring-agri-green-500 outline-none transition-all" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-agri-green-600">DLI (mol/m²/d)</label>
                <input type="number" placeholder="15" className="w-full p-3 bg-agri-green-50 border border-agri-green-200 rounded-xl focus:ring-2 focus:ring-agri-green-500 outline-none transition-all" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-agri-green-600">EC (mS/cm)</label>
                <input type="number" placeholder="1.8" className="w-full p-3 bg-agri-green-50 border border-agri-green-200 rounded-xl focus:ring-2 focus:ring-agri-green-500 outline-none transition-all" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-agri-green-600">Root Zone Moisture (%)</label>
                <input type="number" placeholder="45" className="w-full p-3 bg-agri-green-50 border border-agri-green-200 rounded-xl focus:ring-2 focus:ring-agri-green-500 outline-none transition-all" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-agri-green-600">CO₂ (ppm)</label>
                <input type="number" placeholder="450" className="w-full p-3 bg-agri-green-50 border border-agri-green-200 rounded-xl focus:ring-2 focus:ring-agri-green-500 outline-none transition-all" />
              </div>
            </div>
            <button 
              onClick={analyzeParameters}
              className="w-full bg-agri-green-600 hover:bg-agri-green-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-agri-green-200"
            >
              Analyze Parameters
            </button>
            <AnimatePresence>
              {paramAnalysis && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 p-3 bg-blue-50 border border-blue-200 text-blue-700 text-xs rounded-lg font-medium"
                >
                  {paramAnalysis}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Module 2: Polyhouse Management */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="glass-card p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-orange-100 text-orange-600 rounded-lg"><LayoutDashboard size={24} /></div>
              <h3 className="text-xl font-bold">Polyhouse Management</h3>
            </div>
            <div className="flex gap-4 mb-6">
              <select 
                value={selectedPolyhouseId} 
                onChange={(e) => setSelectedPolyhouseId(e.target.value)}
                className="flex-1 p-3 bg-agri-green-50 border border-agri-green-200 rounded-xl outline-none"
              >
                {polyhouses.map(p => (
                  <option key={p.id} value={p.id}>{p.name} ({p.crop})</option>
                ))}
              </select>
              <button onClick={handleDeletePolyhouse} className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition-all">
                <Trash2 size={20} />
              </button>
            </div>
            <div className="grid grid-cols-3 gap-3 mb-6">
              <input 
                value={newPolyhouse.name} 
                onChange={e => setNewPolyhouse({...newPolyhouse, name: e.target.value})}
                placeholder="Name" className="p-3 bg-agri-green-50 border border-agri-green-200 rounded-xl text-sm" 
              />
              <input 
                value={newPolyhouse.crop} 
                onChange={e => setNewPolyhouse({...newPolyhouse, crop: e.target.value})}
                placeholder="Crop" className="p-3 bg-agri-green-50 border border-agri-green-200 rounded-xl text-sm" 
              />
              <input 
                value={newPolyhouse.area} 
                onChange={e => setNewPolyhouse({...newPolyhouse, area: e.target.value})}
                placeholder="Area" className="p-3 bg-agri-green-50 border border-agri-green-200 rounded-xl text-sm" 
              />
            </div>
            <button onClick={handleAddPolyhouse} className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-orange-200 flex items-center justify-center gap-2">
              <Plus size={20} /> Add Polyhouse
            </button>
          </motion.div>

          {/* Module 3: Disease Monitoring */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="glass-card p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-red-100 text-red-600 rounded-lg"><AlertTriangle size={24} /></div>
              <h3 className="text-xl font-bold">Disease / Condition Monitoring</h3>
            </div>
            <div className="space-y-4">
              <select 
                onChange={(e) => analyzeCondition(e.target.value)}
                className="w-full p-4 bg-agri-green-50 border border-agri-green-200 rounded-xl outline-none appearance-none cursor-pointer"
              >
                <option value="">Select Plant Condition</option>
                <option value="Healthy">Healthy Appearance</option>
                <option value="Yellow Leaves">Yellowing Leaves</option>
                <option value="Wilting">Wilting / Drooping</option>
                <option value="Spots">Dark Spots on Leaves</option>
              </select>
              <AnimatePresence mode="wait">
                {analysisResult && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className={`p-4 rounded-xl border flex items-center gap-3 ${
                      analysisResult.includes('Healthy') ? 'bg-green-50 border-green-200 text-green-700' :
                      analysisResult.includes('Risk') ? 'bg-yellow-50 border-yellow-200 text-yellow-700' :
                      'bg-red-50 border-red-200 text-red-700'
                    }`}
                  >
                    {analysisResult.includes('Healthy') ? <CheckCircle2 size={20} /> : <AlertTriangle size={20} />}
                    <span className="font-bold">{analysisResult}</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Module 4: Smart Recommendations */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="glass-card p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-purple-100 text-purple-600 rounded-lg"><Settings size={24} /></div>
              <h3 className="text-xl font-bold">Smart Recommendations</h3>
            </div>
            <div className="space-y-4">
              <select 
                onChange={(e) => getRecommendation(e.target.value)}
                className="w-full p-4 bg-agri-green-50 border border-agri-green-200 rounded-xl outline-none appearance-none cursor-pointer"
              >
                <option value="">Select Observed Problem</option>
                <option value="High EC">Electrical Conductivity (EC) is High</option>
                <option value="Low CO2">CO₂ Levels are Low</option>
                <option value="High Temp">Temperature is exceeding 30°C</option>
                <option value="Optimal">Everything looks good</option>
              </select>
              <AnimatePresence mode="wait">
                {recommendation && (
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className="p-4 bg-purple-50 border border-purple-200 text-purple-700 rounded-xl"
                  >
                    <div className="flex items-center gap-2 mb-2 font-bold">
                      <Info size={18} /> AI Suggestion:
                    </div>
                    <p className="text-sm leading-relaxed">{recommendation}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>

        {/* Parameters Table */}
        <SectionTitle title="Parameters Table" subtitle="Key environmental indicators and their sensory monitoring" />
        <div className="glass-card overflow-hidden mb-16">
          <table className="w-full text-left border-collapse">
            <thead className="bg-agri-green-600 text-white">
              <tr>
                <th className="p-4 font-bold">Parameter</th>
                <th className="p-4 font-bold">Meaning</th>
                <th className="p-4 font-bold">Sensor</th>
                <th className="p-4 font-bold">Indication</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-agri-green-100">
              <tr className="hover:bg-agri-green-50 transition-colors">
                <td className="p-4 font-bold text-agri-green-800">VPD</td>
                <td className="p-4 text-sm">Vapour Pressure Deficit</td>
                <td className="p-4 text-sm">Temp & Humidity Sensor</td>
                <td className="p-4"><span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded">Transpiration Rate</span></td>
              </tr>
              <tr className="hover:bg-agri-green-50 transition-colors">
                <td className="p-4 font-bold text-agri-green-800">DLI</td>
                <td className="p-4 text-sm">Daily Light Integral</td>
                <td className="p-4 text-sm">PAR Sensor</td>
                <td className="p-4"><span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-bold rounded">Photosynthesis Potential</span></td>
              </tr>
              <tr className="hover:bg-agri-green-50 transition-colors">
                <td className="p-4 font-bold text-agri-green-800">EC</td>
                <td className="p-4 text-sm">Electrical Conductivity</td>
                <td className="p-4 text-sm">EC Probe</td>
                <td className="p-4"><span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-bold rounded">Nutrient Concentration</span></td>
              </tr>
              <tr className="hover:bg-agri-green-50 transition-colors">
                <td className="p-4 font-bold text-agri-green-800">CO₂</td>
                <td className="p-4 text-sm">Carbon Dioxide Conc.</td>
                <td className="p-4 text-sm">NDIR CO2 Sensor</td>
                <td className="p-4"><span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded">Growth Speed</span></td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Features Section */}
        <SectionTitle title="System Features" subtitle="Advanced capabilities for modern agriculture" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {[
            { icon: ShieldCheck, title: 'Secure Auth', desc: 'Protected access for farm managers and staff.' },
            { icon: LayoutDashboard, title: 'Multi-Polyhouse', desc: 'Manage multiple units from a single dashboard.' },
            { icon: Activity, title: 'Real-Time Data', desc: 'Instant updates from IoT sensors across the farm.' },
            { icon: TrendingUp, title: 'Data-Driven', desc: 'Make informed decisions based on historical trends.' }
          ].map((feature, i) => (
            <motion.div key={i} whileHover={{ scale: 1.02 }} className="glass-card p-6 text-center">
              <div className="mx-auto w-12 h-12 bg-agri-green-100 text-agri-green-600 rounded-2xl flex items-center justify-center mb-4">
                <feature.icon size={24} />
              </div>
              <h4 className="font-bold text-agri-green-900 mb-2">{feature.title}</h4>
              <p className="text-sm text-agri-green-600 leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* SWOT Analysis */}
        <SectionTitle title="SWOT Analysis" subtitle="Strategic evaluation of the smart hydroponics approach" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <div className="bg-green-50 border border-green-200 p-6 rounded-2xl">
            <div className="flex items-center gap-2 text-green-700 font-bold mb-3 uppercase tracking-wider text-xs">
              <TrendingUp size={16} /> Strength
            </div>
            <p className="text-sm text-green-800">High yield per square foot and precise nutrient control.</p>
          </div>
          <div className="bg-red-50 border border-red-200 p-6 rounded-2xl">
            <div className="flex items-center gap-2 text-red-700 font-bold mb-3 uppercase tracking-wider text-xs">
              <ZapOff size={16} /> Weakness
            </div>
            <p className="text-sm text-red-800">High initial setup cost and dependency on electricity.</p>
          </div>
          <div className="bg-blue-50 border border-blue-200 p-6 rounded-2xl">
            <div className="flex items-center gap-2 text-blue-700 font-bold mb-3 uppercase tracking-wider text-xs">
              <Target size={16} /> Opportunity
            </div>
            <p className="text-sm text-blue-800">Growing demand for organic and locally grown produce.</p>
          </div>
          <div className="bg-orange-50 border border-orange-200 p-6 rounded-2xl">
            <div className="flex items-center gap-2 text-orange-700 font-bold mb-3 uppercase tracking-wider text-xs">
              <AlertTriangle size={16} /> Threat
            </div>
            <p className="text-sm text-orange-800">Market price fluctuations and emerging pest variants.</p>
          </div>
        </div>

        {/* Benefits */}
        <SectionTitle title="Key Benefits" subtitle="Why choose smart hydroponics?" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {[
            { title: 'Scalability', desc: 'Easily expand your operations by adding more modular polyhouse units.', icon: LayoutDashboard },
            { title: 'Risk Reduction', desc: 'Early disease detection and environmental alerts minimize crop loss.', icon: ShieldCheck },
            { title: 'Yield Optimization', desc: 'Precisely controlled environments lead to 3x faster growth cycles.', icon: TrendingUp },
            { title: 'Smart Irrigation', desc: 'Save up to 90% more water compared to traditional soil farming.', icon: Droplets }
          ].map((benefit, i) => (
            <div key={i} className="glass-card p-6 flex gap-4 items-start">
              <div className="p-3 bg-agri-green-100 text-agri-green-600 rounded-xl">
                <benefit.icon size={24} />
              </div>
              <div>
                <h4 className="font-bold text-agri-green-900 mb-1">{benefit.title}</h4>
                <p className="text-sm text-agri-green-600">{benefit.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-agri-green-950 text-agri-green-400 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-3">
            <Leaf size={24} />
            <span className="text-xl font-bold text-white">Smart Hydroponics</span>
          </div>
          <div className="text-center md:text-right">
            <p className="text-sm mb-2">Developed for Smart Agriculture | Hydroponics System</p>
            <p className="text-xs opacity-50">© {new Date().getFullYear()} Sustainable Farming Solutions. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
