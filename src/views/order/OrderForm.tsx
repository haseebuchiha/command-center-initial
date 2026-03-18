'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft, ChevronRight, Rocket, Sun, Moon } from 'lucide-react';
import { useAction } from 'next-safe-action/hooks';
import { submitOrderAction } from '@/actions/order/submitOrderAction';
import { toast } from 'sonner';
import type { OrderFormData } from '@/types/command-center';

const stepNames = [
  'About You',
  'Your Business',
  'Your Goals',
  'Design',
  'Preview',
];

const goalOptions = [
  'Get more customers',
  'Build a website',
  'Start selling online',
  'Save time',
  'Create content',
  'Grow on social media',
];

const themes = [
  {
    id: 'modern',
    name: 'Modern Clean',
    colors: ['#3B82F6', '#1E293B', '#F8FAFC'],
  },
  {
    id: 'bold',
    name: 'Bold & Colorful',
    colors: ['#EC4899', '#8B5CF6', '#FDE68A'],
  },
  {
    id: 'pro',
    name: 'Professional',
    colors: ['#1E40AF', '#374151', '#F3F4F6'],
  },
  {
    id: 'minimal',
    name: 'Minimal',
    colors: ['#000000', '#6B7280', '#FFFFFF'],
  },
  {
    id: 'warm',
    name: 'Warm & Friendly',
    colors: ['#EA580C', '#92400E', '#FFF7ED'],
  },
  {
    id: 'tech',
    name: 'Tech / Futuristic',
    colors: ['#06B6D4', '#0F172A', '#22D3EE'],
  },
];

const bizTypes = [
  'Online Store',
  'Service Business',
  'Content / Creator',
  'Consulting / Coaching',
  'Other',
];

const revenueOptions = [
  'Just starting out',
  'Under $1,000/month',
  '$1K - $5K/month',
  '$5K - $25K/month',
  '$25K - $100K/month',
  '$100K+/month',
];

const previewFeatures = [
  { emoji: '\u2B50', label: 'Quality Products' },
  { emoji: '\uD83D\uDE80', label: 'Fast Delivery' },
  { emoji: '\uD83D\uDCAC', label: '24/7 Support' },
];

export const OrderForm = () => {
  const { theme: currentTheme, setTheme } = useTheme();
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<OrderFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    bizName: '',
    bizDesc: '',
    idealCustomer: '',
    bizType: '',
    industry: '',
    goals: [],
    hasWebsite: false,
    currentUrl: '',
    revenueGoal: '',
    theme: 'modern',
    inspireUrls: ['', '', ''],
    colors: '',
  });

  const { execute, isPending } = useAction(submitOrderAction, {
    onSuccess: () => {
      toast.success('Your business is being set up!');
      router.push('/register');
    },
    onError: () => {
      toast.error('Something went wrong. Please try again.');
    },
  });

  const updateForm = (updates: Partial<OrderFormData>) => {
    setForm((prev) => ({ ...prev, ...updates }));
  };

  const selectedTheme = themes.find((t) => t.id === form.theme) ?? themes[0];
  const slug = (form.bizName || 'your-business')
    .toLowerCase()
    .replace(/\s+/g, '-');

  return (
    <div className="min-h-dvh bg-background text-foreground">
      {/* Header */}
      <div className="flex items-center justify-between border-b px-4 py-3 md:px-8 md:py-4">
        <Link
          href="/landing"
          className="text-lg font-extrabold md:text-[22px]"
        >
          <span className="text-accent">Launch</span>
          <span className="text-primary">Based</span>
        </Link>
        <Button
          variant="ghost"
          size="icon"
          onClick={() =>
            setTheme(currentTheme === 'dark' ? 'light' : 'dark')
          }
        >
          {currentTheme === 'dark' ? (
            <Sun className="size-5" />
          ) : (
            <Moon className="size-5" />
          )}
        </Button>
      </div>

      <div className="mx-auto max-w-[640px] px-4 py-5 md:px-5 md:py-8">
        {/* Progress */}
        <div className="mb-8">
          <div className="mb-2 flex justify-between gap-1">
            {stepNames.map((s, i) => (
              <div
                key={s}
                className={`flex-1 text-center text-[10px] md:text-xs ${
                  step === i
                    ? 'font-bold text-primary'
                    : i < step
                      ? 'text-success'
                      : 'text-muted-foreground'
                }`}
              >
                {i < step ? '\u2713 ' : ''}
                {s}
              </div>
            ))}
          </div>
          <Progress
            value={(step / (stepNames.length - 1)) * 100}
            className="h-1.5"
          />
        </div>

        <Card>
          <CardContent className="p-6 md:p-8">
            {/* Step 0: About You */}
            {step === 0 && (
              <>
                <h2 className="mb-2 text-2xl font-bold">
                  Let&apos;s get to know you!
                </h2>
                <p className="mb-6 text-[15px] text-muted-foreground">
                  This takes about 5 minutes. Your info is safe with us.
                </p>
                <div className="grid grid-cols-1 gap-x-4 md:grid-cols-2">
                  <div className="mb-4">
                    <label className="mb-2 block text-sm font-semibold">
                      First Name *
                    </label>
                    <input
                      className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                      placeholder="Sara"
                      value={form.firstName}
                      onChange={(e) =>
                        updateForm({ firstName: e.target.value })
                      }
                    />
                  </div>
                  <div className="mb-4">
                    <label className="mb-2 block text-sm font-semibold">
                      Last Name *
                    </label>
                    <input
                      className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                      placeholder="Johnson"
                      value={form.lastName}
                      onChange={(e) =>
                        updateForm({ lastName: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="mb-4">
                  <label className="mb-2 block text-sm font-semibold">
                    Email Address *
                  </label>
                  <input
                    className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                    type="email"
                    placeholder="sara@example.com"
                    value={form.email}
                    onChange={(e) => updateForm({ email: e.target.value })}
                  />
                </div>
                <div className="mb-4">
                  <label className="mb-2 block text-sm font-semibold">
                    Phone Number
                  </label>
                  <input
                    className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                    type="tel"
                    placeholder="(555) 123-4567"
                    value={form.phone}
                    onChange={(e) => updateForm({ phone: e.target.value })}
                  />
                </div>
              </>
            )}

            {/* Step 1: Your Business */}
            {step === 1 && (
              <>
                <h2 className="mb-2 text-2xl font-bold">
                  Tell us about your business
                </h2>
                <p className="mb-6 text-[15px] text-muted-foreground">
                  Even if you&apos;re just getting started, that&apos;s
                  totally fine!
                </p>
                <div className="mb-4">
                  <label className="mb-2 block text-sm font-semibold">
                    Business Name *
                  </label>
                  <input
                    className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                    placeholder="Sara's Bakery"
                    value={form.bizName}
                    onChange={(e) => updateForm({ bizName: e.target.value })}
                  />
                </div>
                <div className="mb-4">
                  <label className="mb-2 block text-sm font-semibold">
                    What does your business do? *
                  </label>
                  <textarea
                    className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                    rows={3}
                    placeholder="I make custom cakes and pastries for special events..."
                    value={form.bizDesc}
                    onChange={(e) => updateForm({ bizDesc: e.target.value })}
                  />
                </div>
                <div className="mb-4">
                  <label className="mb-2 block text-sm font-semibold">
                    Who is your ideal customer?
                  </label>
                  <textarea
                    className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                    rows={2}
                    placeholder="Couples planning weddings, parents planning birthdays..."
                    value={form.idealCustomer}
                    onChange={(e) =>
                      updateForm({ idealCustomer: e.target.value })
                    }
                  />
                </div>
                <div className="mb-4">
                  <label className="mb-2 block text-sm font-semibold">
                    Business Type *
                  </label>
                  <select
                    className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                    value={form.bizType}
                    onChange={(e) => updateForm({ bizType: e.target.value })}
                  >
                    <option value="">Select...</option>
                    {bizTypes.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
              </>
            )}

            {/* Step 2: Your Goals */}
            {step === 2 && (
              <>
                <h2 className="mb-2 text-2xl font-bold">
                  What are your goals?
                </h2>
                <p className="mb-6 text-[15px] text-muted-foreground">
                  Pick the things that matter most right now.
                </p>
                <div className="mb-5 grid grid-cols-1 gap-2.5 md:grid-cols-2">
                  {goalOptions.map((g) => (
                    <button
                      key={g}
                      onClick={() => {
                        const goals = form.goals.includes(g)
                          ? form.goals.filter((x) => x !== g)
                          : [...form.goals, g];
                        updateForm({ goals });
                      }}
                      className={`rounded-lg border-2 px-4 py-3 text-left text-sm font-medium transition-colors ${
                        form.goals.includes(g)
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      {form.goals.includes(g) ? '\u2713 ' : ''}
                      {g}
                    </button>
                  ))}
                </div>
                <div className="mb-4 flex items-center justify-between rounded-lg border bg-background p-4">
                  <span className="text-sm font-semibold">
                    Do you already have a website?
                  </span>
                  <Switch
                    checked={form.hasWebsite}
                    onCheckedChange={(v) => updateForm({ hasWebsite: v })}
                  />
                </div>
                {form.hasWebsite && (
                  <div className="mb-4">
                    <label className="mb-2 block text-sm font-semibold">
                      Current Website URL
                    </label>
                    <input
                      className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                      placeholder="https://www.mybusiness.com"
                      value={form.currentUrl}
                      onChange={(e) =>
                        updateForm({ currentUrl: e.target.value })
                      }
                    />
                  </div>
                )}
                <div className="mb-4">
                  <label className="mb-2 block text-sm font-semibold">
                    Monthly Revenue Goal
                  </label>
                  <select
                    className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                    value={form.revenueGoal}
                    onChange={(e) =>
                      updateForm({ revenueGoal: e.target.value })
                    }
                  >
                    <option value="">Select...</option>
                    {revenueOptions.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </div>
              </>
            )}

            {/* Step 3: Design Style */}
            {step === 3 && (
              <>
                <h2 className="mb-2 text-2xl font-bold">
                  Pick your website style
                </h2>
                <p className="mb-6 text-[15px] text-muted-foreground">
                  Choose a look that feels like your brand.
                </p>
                <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-3">
                  {themes.map((th) => (
                    <button
                      key={th.id}
                      onClick={() => updateForm({ theme: th.id })}
                      className={`overflow-hidden rounded-xl border-[3px] transition-all ${
                        form.theme === th.id
                          ? 'border-primary shadow-lg shadow-primary/20'
                          : 'border-border'
                      }`}
                    >
                      <div className="flex h-[60px]">
                        {th.colors.map((c) => (
                          <div
                            key={c}
                            className="flex-1"
                            style={{ background: c }}
                          />
                        ))}
                      </div>
                      <div className="bg-card p-2.5 text-center">
                        <span
                          className={`text-[13px] ${form.theme === th.id ? 'font-bold text-primary' : 'font-medium'}`}
                        >
                          {form.theme === th.id ? '\u2713 ' : ''}
                          {th.name}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
                <p className="mb-2 text-sm font-semibold">
                  Websites you like (optional)
                </p>
                {[0, 1, 2].map((i) => (
                  <div key={`inspire-${String(i)}`} className="mb-3">
                    <input
                      className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                      placeholder={`https://website-i-like-${String(i + 1)}.com`}
                      value={form.inspireUrls[i]}
                      onChange={(e) => {
                        const urls = [...form.inspireUrls];
                        urls[i] = e.target.value;
                        updateForm({ inspireUrls: urls });
                      }}
                    />
                  </div>
                ))}
              </>
            )}

            {/* Step 4: Preview */}
            {step === 4 && (
              <>
                <h2 className="mb-2 text-2xl font-bold">
                  Here&apos;s your website preview!
                </h2>
                <p className="mb-6 text-[15px] text-muted-foreground">
                  This is what your website will look like.
                </p>
                {/* Browser mockup */}
                <div className="mb-6 overflow-hidden rounded-xl border-2">
                  <div className="flex items-center gap-2 border-b bg-muted px-4 py-2">
                    <div className="flex gap-1.5">
                      <div className="size-3 rounded-full bg-red-500" />
                      <div className="size-3 rounded-full bg-yellow-500" />
                      <div className="size-3 rounded-full bg-green-500" />
                    </div>
                    <div className="flex-1 rounded-md bg-background px-3 py-1 text-xs text-muted-foreground">
                      lb-{slug}.ondigitalocean.app
                    </div>
                  </div>
                  <div style={{ background: selectedTheme.colors[2] }}>
                    <div
                      className="px-6 py-12 text-center text-white"
                      style={{
                        background: `linear-gradient(135deg, ${selectedTheme.colors[0]}, ${selectedTheme.colors[1]})`,
                      }}
                    >
                      <div className="mb-2 text-xs uppercase tracking-widest opacity-80">
                        Welcome to
                      </div>
                      <h2 className="mb-3 text-[32px] font-extrabold">
                        {form.bizName || 'Your Business Name'}
                      </h2>
                      <p className="mx-auto mb-6 max-w-[400px] text-base opacity-90">
                        {form.bizDesc
                          ? form.bizDesc.substring(0, 80) + '...'
                          : 'Your business description will appear here'}
                      </p>
                      <div
                        className="inline-block rounded-lg px-6 py-2.5 text-sm font-bold"
                        style={{
                          background: '#FFF',
                          color: selectedTheme.colors[0],
                        }}
                      >
                        Get Started Today
                      </div>
                    </div>
                    <div className="grid grid-cols-1 gap-3 p-4 md:grid-cols-3 md:p-8">
                      {previewFeatures.map((f) => (
                        <div key={f.label} className="p-4 text-center">
                          <div className="mb-2 text-[28px]">{f.emoji}</div>
                          <div
                            className="text-sm font-bold"
                            style={{ color: selectedTheme.colors[1] }}
                          >
                            {f.label}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <Button
                  size="lg"
                  className="mb-3 w-full"
                  disabled={isPending}
                  onClick={() => execute(form)}
                >
                  <Rocket className="mr-2 size-4" />
                  {isPending
                    ? 'Setting up...'
                    : "Let's Go! Start Building My Business"}
                </Button>
                <Button variant="secondary" className="w-full">
                  I Have Questions — Book a Free Call
                </Button>
                <p className="mt-3 text-center text-xs text-muted-foreground">
                  No demo required. You can sign up right now and start in
                  minutes.
                </p>
              </>
            )}

            {/* Navigation */}
            <div className="mt-6 flex justify-between border-t pt-5">
              {step > 0 ? (
                <Button
                  variant="ghost"
                  onClick={() => setStep(step - 1)}
                >
                  <ArrowLeft className="mr-1 size-4" /> Back
                </Button>
              ) : (
                <Button variant="ghost" asChild>
                  <Link href="/landing">
                    <ArrowLeft className="mr-1 size-4" /> Home
                  </Link>
                </Button>
              )}
              {step < 4 && (
                <Button onClick={() => setStep(step + 1)}>
                  {step === 3 ? 'See My Website Preview' : 'Next'}
                  <ChevronRight className="ml-1 size-4" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {step < 4 && (
          <p className="mt-4 text-center text-[13px] text-muted-foreground">
            Your progress is saved automatically. You can come back anytime.
          </p>
        )}
      </div>
    </div>
  );
};
