import { useRef, useState, useEffect } from 'react';
import { Bot, Send, Sparkles, Target, Wallet, Leaf, TrendingDown, Clock, ArrowRight } from 'lucide-react';
import { PageHeader, SectionCard, DemoBanner } from '@/components/ui';
import { DEMO_USER } from '@/data/demoData';
import type { ChatMessage, PrioritizedAction } from '@/types';

const SUGGESTED_PROMPTS = [
  'Reduce campus electricity consumption by 20% within one year.',
  'Cut my building\'s CO₂ emissions by 50 tons per year.',
  'Optimize solar investment with a 500,000 EGP budget.',
  'Prioritize retrofit actions across 5 university buildings.',
];

const GOAL_PRESETS = [
  { label: '20% consumption reduction', value: 'Reduce electricity consumption by 20% within one year.' },
  { label: '50 tons CO₂ cut', value: 'Cut carbon emissions by 50 tons annually.' },
  { label: 'Solar self-sufficiency', value: 'Reach 70% solar self-sufficiency for the campus.' },
];

function uid() { return Math.random().toString(36).slice(2, 10); }
function now() { return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); }

function generateResponse(goal: string, budget?: number): { content: string; actions: PrioritizedAction[]; score: number; savings: { metric: string; value: string }[] } {
  const lower = goal.toLowerCase();
  const isBudget = budget && budget > 0;

  let actions: PrioritizedAction[] = [];
  let score = 72;
  let savings: { metric: string; value: string }[] = [];

  if (lower.includes('consumption') || lower.includes('electricity') || lower.includes('20%')) {
    actions = [
      { id: uid(), priority: 'High', title: 'Deploy rooftop solar on top 3 buildings', description: 'Cairo University, Smart Village Tower A, and Aswan Lab cover 64% of portfolio consumption.', estimatedImpact: '−18% grid draw', timeline: '6–9 months' },
      { id: uid(), priority: 'High', title: 'LED retrofit & smart lighting controls', description: 'Replace legacy lighting across all buildings with motion-adaptive LED fixtures.', estimatedImpact: '−6% consumption', timeline: '3 months' },
      { id: uid(), priority: 'Medium', title: 'HVAC schedule optimization', description: 'Tune cooling schedules to occupancy patterns and setpoints to 24°C.', estimatedImpact: '−4% consumption', timeline: '2 months' },
      { id: uid(), priority: 'Medium', title: 'Building energy monitoring dashboards', description: 'Install sub-metering on heavy loads to expose waste and enable accountability.', estimatedImpact: '−2% consumption', timeline: '4 months' },
      { id: uid(), priority: 'Low', title: 'Awareness & engagement campaign', description: 'Roll out a semester-long energy awareness program with inter-building benchmarking.', estimatedImpact: '−1% consumption', timeline: 'Ongoing' },
    ];
    score = 78;
    savings = [
      { metric: 'Annual consumption', value: '−21%' },
      { metric: 'Annual cost savings', value: '~1.42M EGP' },
      { metric: 'CO₂ avoided', value: '~640 tons/yr' },
    ];
  } else if (lower.includes('co2') || lower.includes('carbon') || lower.includes('emission')) {
    actions = [
      { id: uid(), priority: 'High', title: 'Accelerate solar PV deployment', description: 'Prioritize the 5 highest-suitability rooftops for immediate installation.', estimatedImpact: '−38 tons CO₂/yr', timeline: '6 months' },
      { id: uid(), priority: 'High', title: 'Electrify fleet & add EV charging', description: 'Phase out diesel service vehicles and install solar-fed EV chargers.', estimatedImpact: '−9 tons CO₂/yr', timeline: '12 months' },
      { id: uid(), priority: 'Medium', title: 'Procure green tariff electricity', description: 'Switch remaining grid load to Egypt\'s renewable energy tariff where available.', estimatedImpact: '−5 tons CO₂/yr', timeline: '3 months' },
    ];
    score = 74;
    savings = [
      { metric: 'CO₂ reduction', value: '~52 tons/yr' },
      { metric: 'Annual cost savings', value: '~680K EGP' },
    ];
  } else {
    actions = [
      { id: uid(), priority: 'High', title: 'Solar PV on highest-suitability rooftops', description: 'Install ~420 kW across Aswan Lab, Smart Village Tower A, and Gouna Hospital.', estimatedImpact: '+580 MWh/yr', timeline: '6 months' },
      { id: uid(), priority: 'Medium', title: 'Battery storage pilot', description: 'Add 200 kWh storage at Tower A to shift solar surplus into evening peak.', estimatedImpact: '+8% self-consumption', timeline: '9 months' },
      { id: uid(), priority: 'Medium', title: 'Demand response enrollment', description: 'Enroll flexible loads in the utility demand-response program.', estimatedImpact: '~120K EGP/yr', timeline: '2 months' },
      { id: uid(), priority: 'Low', title: 'Power-factor correction', description: 'Install capacitors to reduce reactive power charges.', estimatedImpact: '~4% on demand charges', timeline: '1 month' },
    ];
    score = 70;
    savings = [
      { metric: 'Solar self-sufficiency', value: '~64%' },
      { metric: 'Annual cost savings', value: '~920K EGP' },
    ];
  }

  if (isBudget) {
    actions = actions.filter((_, i) => i < 3);
    actions.push({ id: uid(), priority: 'Low', title: `Stretch budget of ${budget.toLocaleString()} EGP`, description: `With your budget, prioritize the top 2 actions. Remaining funds cover monitoring & training.`, estimatedImpact: 'Phase 2 ready', timeline: '12 months' });
  }

  const content = `I analyzed your goal: "${goal}". Based on the demo sustainability model, here is a prioritized action plan with estimated impact. ${isBudget ? `I've constrained recommendations to your ${budget?.toLocaleString()} EGP budget.` : ''} These recommendations use predefined rules and illustrative figures — no live AI model is connected.`;
  return { content, actions, score, savings };
}

export function AgentPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'agent',
      content: "Hi! I'm the EcoGrid Sustainability Agent (demo). Tell me a goal like 'Reduce campus electricity consumption by 20% within one year', and I'll generate a prioritized action plan with estimated impact.",
      timestamp: now(),
    },
  ]);
  const [input, setInput] = useState('');
  const [budget, setBudget] = useState<number | ''>('');
  const [thinking, setThinking] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, thinking]);

  const send = (text: string) => {
    if (!text.trim()) return;
    const userMsg: ChatMessage = { id: uid(), role: 'user', content: text, timestamp: now() };
    setMessages((m) => [...m, userMsg]);
    setInput('');
    setThinking(true);
    setTimeout(() => {
      const { content, actions, score, savings } = generateResponse(text, typeof budget === 'number' ? budget : undefined);
      setMessages((m) => [...m, { id: uid(), role: 'agent', content, timestamp: now(), actions, sustainabilityScore: score, estimatedSavings: savings }]);
      setThinking(false);
    }, 700);
  };

  return (
    <div className="space-y-6">
      <PageHeader title="AI Sustainability Agent" subtitle="A demo chat assistant that turns sustainability goals into prioritized, estimated-impact action plans." />

      <DemoBanner>This is a demonstration engine using predefined rules and sample responses — no real AI model is connected. Architecture is ready for a future AI API integration.</DemoBanner>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-1 space-y-4">
          <SectionCard title="Suggested prompts">
            <div className="space-y-2">
              {SUGGESTED_PROMPTS.map((p) => (
                <button key={p} onClick={() => send(p)} className="group flex w-full items-start gap-2.5 rounded-xl border border-navy-100 p-3 text-left text-xs text-navy-700 hover:border-forest-300 hover:bg-forest-50/40 transition-all">
                  <Sparkles className="h-3.5 w-3.5 mt-0.5 text-forest-500 shrink-0" />
                  <span>{p}</span>
                  <ArrowRight className="ml-auto h-3.5 w-3.5 text-navy-300 group-hover:text-forest-600 transition-colors" />
                </button>
              ))}
            </div>
          </SectionCard>

          <SectionCard title="Goal presets">
            <div className="space-y-2">
              {GOAL_PRESETS.map((g) => (
                <button key={g.label} onClick={() => send(g.value)} className="flex w-full items-center gap-2.5 rounded-xl bg-navy-50 p-3 text-left text-xs hover:bg-forest-50 transition-colors">
                  <Target className="h-3.5 w-3.5 text-forest-600" />
                  <span className="font-medium text-navy-800">{g.label}</span>
                </button>
              ))}
            </div>
          </SectionCard>

          <SectionCard title="Budget constraint">
            <div className="space-y-2">
              <label className="label flex items-center gap-1.5"><Wallet className="h-3.5 w-3.5 text-navy-400" /> Budget (EGP)</label>
              <input
                type="number"
                value={budget}
                onChange={(e) => setBudget(e.target.value ? parseFloat(e.target.value) : '')}
                placeholder="e.g. 500000"
                className="input"
              />
              <p className="text-xs text-navy-400">Optional — constrains recommended actions.</p>
            </div>
          </SectionCard>
        </div>

        <div className="lg:col-span-3">
          <div className="card flex flex-col h-[640px]">
            <div className="flex items-center gap-3 border-b border-navy-100 px-5 py-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-forest-500 to-navy-700 text-white">
                <Bot className="h-5 w-5" />
              </div>
              <div>
                <div className="font-bold text-navy-900">Sustainability Agent</div>
                <div className="text-xs text-forest-600 flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-forest-500 animate-pulse-soft" /> Demo · online
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
              {messages.map((m) => (
                <MessageBubble key={m.id} message={m} />
              ))}
              {thinking && (
                <div className="flex items-center gap-2 text-xs text-navy-500">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-forest-100 text-forest-700"><Bot className="h-4 w-4" /></div>
                  <div className="flex gap-1">
                    <span className="h-2 w-2 rounded-full bg-forest-400 animate-pulse-soft" />
                    <span className="h-2 w-2 rounded-full bg-forest-400 animate-pulse-soft" style={{ animationDelay: '0.2s' }} />
                    <span className="h-2 w-2 rounded-full bg-forest-400 animate-pulse-soft" style={{ animationDelay: '0.4s' }} />
                  </div>
                </div>
              )}
              <div ref={endRef} />
            </div>

            <form
              onSubmit={(e) => { e.preventDefault(); send(input); }}
              className="flex items-end gap-2 border-t border-navy-100 p-3"
            >
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(input); } }}
                rows={1}
                placeholder="Describe your sustainability goal…"
                className="input resize-none max-h-32"
              />
              <button type="submit" className="btn-primary shrink-0" disabled={!input.trim()}>
                <Send className="h-4 w-4" /> Send
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === 'user';
  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : ''}`}>
      <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${isUser ? 'bg-navy-700 text-white' : 'bg-gradient-to-br from-forest-500 to-navy-700 text-white'}`}>
        {isUser ? <span className="text-xs font-bold">{DEMO_USER.initials}</span> : <Bot className="h-4 w-4" />}
      </div>
      <div className={`max-w-[80%] ${isUser ? 'items-end' : 'items-start'} flex flex-col gap-2`}>
        <div className={`rounded-2xl px-4 py-2.5 text-sm ${isUser ? 'bg-navy-700 text-white rounded-tr-md' : 'bg-navy-50 text-navy-800 rounded-tl-md'}`}>
          {message.content}
        </div>

        {!isUser && message.estimatedSavings && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 w-full">
            {message.estimatedSavings.map((s) => (
              <div key={s.metric} className="rounded-xl border border-forest-200 bg-forest-50/60 p-3">
                <div className="text-xs text-navy-500">{s.metric}</div>
                <div className="text-sm font-bold text-forest-700 mt-0.5">{s.value}</div>
              </div>
            ))}
          </div>
        )}

        {!isUser && message.sustainabilityScore !== undefined && (
          <div className="card p-4 w-full">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-navy-700 flex items-center gap-1.5"><Leaf className="h-3.5 w-3.5 text-forest-600" /> Projected sustainability score</span>
              <span className="text-lg font-bold text-forest-700">{message.sustainabilityScore}<span className="text-xs text-navy-400">/100</span></span>
            </div>
            <div className="h-2 rounded-full bg-navy-100 overflow-hidden">
              <div className="h-full rounded-full bg-gradient-to-r from-forest-400 to-forest-600 transition-all duration-700" style={{ width: `${message.sustainabilityScore}%` }} />
            </div>
          </div>
        )}

        {!isUser && message.actions && message.actions.length > 0 && (
          <div className="card w-full overflow-hidden">
            <div className="px-4 py-3 border-b border-navy-100 flex items-center gap-2">
              <TrendingDown className="h-4 w-4 text-forest-600" />
              <span className="text-sm font-bold text-navy-900">Prioritized action plan</span>
            </div>
            <ol className="divide-y divide-navy-100">
              {message.actions.map((a, i) => (
                <li key={a.id} className="flex gap-3 p-4">
                  <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-[11px] font-bold ${a.priority === 'High' ? 'bg-rose-100 text-rose-700' : a.priority === 'Medium' ? 'bg-amber-100 text-amber-700' : 'bg-navy-100 text-navy-600'}`}>{i + 1}</span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-semibold text-navy-900">{a.title}</span>
                      <span className={`badge ${a.priority === 'High' ? 'bg-rose-100 text-rose-700' : a.priority === 'Medium' ? 'bg-amber-100 text-amber-700' : 'bg-navy-100 text-navy-600'}`}>{a.priority}</span>
                    </div>
                    <p className="text-xs text-navy-600 mt-1">{a.description}</p>
                    <div className="flex items-center gap-3 mt-2 text-[11px] text-navy-500">
                      <span className="inline-flex items-center gap-1"><TrendingDown className="h-3 w-3 text-forest-600" /> {a.estimatedImpact}</span>
                      <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" /> {a.timeline}</span>
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        )}

        <div className={`text-[10px] text-navy-400 ${isUser ? 'text-right' : ''}`}>{message.timestamp}</div>
      </div>
    </div>
  );
}
