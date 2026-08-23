import { SleepRecord, UserProfile, HealthPrognosisData } from '../types';

export const initialUserProfile: UserProfile = {
  name: 'Alex Mercer',
  age: 34,
  chronotype: 'Intermediate Bear',
  targetSleepDurationHours: 8.0,
  caffeineCutoffHour: 14, // 2:00 PM
  primaryGoal: 'Increase Deep Sleep'
};

export const sampleEpochsBaseline = [
  { timestamp: '23:15', stage: 'awake' as const, durationMinutes: 20, heartRate: 68, hrv: 38 },
  { timestamp: '23:35', stage: 'light' as const, durationMinutes: 45, heartRate: 61, hrv: 44 },
  { timestamp: '00:20', stage: 'deep' as const, durationMinutes: 35, heartRate: 52, hrv: 55 },
  { timestamp: '00:55', stage: 'light' as const, durationMinutes: 30, heartRate: 56, hrv: 48 },
  { timestamp: '01:25', stage: 'rem' as const, durationMinutes: 25, heartRate: 64, hrv: 42 },
  { timestamp: '01:50', stage: 'awake' as const, durationMinutes: 15, heartRate: 66, hrv: 39 },
  { timestamp: '02:05', stage: 'light' as const, durationMinutes: 50, heartRate: 57, hrv: 46 },
  { timestamp: '02:55', stage: 'deep' as const, durationMinutes: 30, heartRate: 53, hrv: 58 },
  { timestamp: '03:25', stage: 'light' as const, durationMinutes: 40, heartRate: 58, hrv: 47 },
  { timestamp: '04:05', stage: 'rem' as const, durationMinutes: 35, heartRate: 63, hrv: 45 },
  { timestamp: '04:40', stage: 'light' as const, durationMinutes: 55, heartRate: 59, hrv: 44 },
  { timestamp: '05:35', stage: 'rem' as const, durationMinutes: 30, heartRate: 62, hrv: 46 },
  { timestamp: '06:05', stage: 'light' as const, durationMinutes: 35, heartRate: 60, hrv: 45 },
  { timestamp: '06:40', stage: 'awake' as const, durationMinutes: 10, heartRate: 69, hrv: 40 }
];

export const mockSleepHistory: SleepRecord[] = [
  {
    id: 'rec-today',
    date: 'Last Night (Aug 16)',
    bedTime: '11:15 PM',
    wakeTime: '6:50 AM',
    durationMinutes: 390, // 6h 30m
    inBedMinutes: 455,    // 7h 35m
    efficiency: 85.7,
    deepMinutes: 65,      // 16.6%
    remMinutes: 90,       // 23.0%
    lightMinutes: 235,    // 60.2%
    awakeMinutes: 65,
    latencyMinutes: 20,
    awakeningsCount: 3,
    hrvAverage: 47,
    hrvBaseline: 52,
    restingHeartRate: 56,
    respiratoryRate: 14.2,
    temperatureDelta: -0.3,
    sleepDebtHours: 1.5,
    tags: ['Late screen use (iPad)', 'Caffeine after 2 PM', 'Warm bedroom (71°F)'],
    stageEpochs: sampleEpochsBaseline
  },
  {
    id: 'rec-day-minus-1',
    date: 'Aug 15',
    bedTime: '11:45 PM',
    wakeTime: '6:30 AM',
    durationMinutes: 360,
    inBedMinutes: 405,
    efficiency: 88.8,
    deepMinutes: 55,
    remMinutes: 80,
    lightMinutes: 225,
    awakeMinutes: 45,
    latencyMinutes: 18,
    awakeningsCount: 2,
    hrvAverage: 44,
    hrvBaseline: 52,
    restingHeartRate: 58,
    respiratoryRate: 14.5,
    temperatureDelta: +0.1,
    sleepDebtHours: 2.0,
    tags: ['Late dinner (9 PM)', 'Alcohol (1 glass red wine)'],
    stageEpochs: sampleEpochsBaseline
  },
  {
    id: 'rec-day-minus-2',
    date: 'Aug 14',
    bedTime: '10:45 PM',
    wakeTime: '7:00 AM',
    durationMinutes: 450,
    inBedMinutes: 495,
    efficiency: 90.9,
    deepMinutes: 95,
    remMinutes: 110,
    lightMinutes: 245,
    awakeMinutes: 45,
    latencyMinutes: 12,
    awakeningsCount: 1,
    hrvAverage: 56,
    hrvBaseline: 52,
    restingHeartRate: 53,
    respiratoryRate: 13.8,
    temperatureDelta: -0.5,
    sleepDebtHours: 0.0,
    tags: ['Sauna session', 'Magnesium Glycinate', 'Cold bedroom (66°F)'],
    stageEpochs: sampleEpochsBaseline
  }
];

export const sleepArchetypes: Record<string, { label: string; description: string; record: SleepRecord }> = {
  baseline: {
    label: 'Standard Modern Sleeper',
    description: 'Moderate sleep debt, elevated evening screen use, sub-optimal deep sleep.',
    record: mockSleepHistory[0]
  },
  highStress: {
    label: 'High-Stress / Sympathetic Overdrive',
    description: 'Blunted nocturnal HRV dip (31ms), elevated resting heart rate, fragmented sleep spindles.',
    record: {
      id: 'arch-stress',
      date: 'Simulated: High Stress',
      bedTime: '12:30 AM',
      wakeTime: '6:15 AM',
      durationMinutes: 310,
      inBedMinutes: 345,
      efficiency: 89.8,
      deepMinutes: 35, // Low SWS
      remMinutes: 60,
      lightMinutes: 215,
      awakeMinutes: 35,
      latencyMinutes: 32,
      awakeningsCount: 4,
      hrvAverage: 31,
      hrvBaseline: 52,
      restingHeartRate: 64,
      respiratoryRate: 15.6,
      temperatureDelta: +0.4,
      sleepDebtHours: 3.2,
      tags: ['Work deadline stress', 'Late cortisol spike', 'Blue light till 12 AM'],
      stageEpochs: sampleEpochsBaseline
    }
  },
  insomniaCBT: {
    label: 'Chronic Insomnia / State Misperception',
    description: 'Prolonged sleep latency, severe WASO (80 min), low efficiency (74%) — Prime candidate for Sleep Restriction Therapy.',
    record: {
      id: 'arch-insomnia',
      date: 'Simulated: Insomnia (CBT-I)',
      bedTime: '10:30 PM',
      wakeTime: '7:15 AM',
      durationMinutes: 390,
      inBedMinutes: 525,
      efficiency: 74.2,
      deepMinutes: 45,
      remMinutes: 70,
      lightMinutes: 275,
      awakeMinutes: 135,
      latencyMinutes: 55,
      awakeningsCount: 6,
      hrvAverage: 38,
      hrvBaseline: 52,
      restingHeartRate: 61,
      respiratoryRate: 14.8,
      temperatureDelta: +0.2,
      sleepDebtHours: 2.8,
      tags: ['Clock watching', 'Racing 2 AM thoughts', 'Excess time in bed (9h)'],
      stageEpochs: sampleEpochsBaseline
    }
  },
  circadianShift: {
    label: 'Delayed Phase / Circadian Asynchrony',
    description: 'Melatonin onset delayed by 3 hours, morning grogginess, social jetlag.',
    record: {
      id: 'arch-circadian',
      date: 'Simulated: Circadian Shift',
      bedTime: '2:15 AM',
      wakeTime: '9:45 AM',
      durationMinutes: 420,
      inBedMinutes: 450,
      efficiency: 93.3,
      deepMinutes: 75,
      remMinutes: 105,
      lightMinutes: 240,
      awakeMinutes: 30,
      latencyMinutes: 15,
      awakeningsCount: 2,
      hrvAverage: 49,
      hrvBaseline: 52,
      restingHeartRate: 57,
      respiratoryRate: 14.0,
      temperatureDelta: -0.2,
      sleepDebtHours: 0.8,
      tags: ['Social jetlag', 'Late light exposure', 'Delayed adenosine peak'],
      stageEpochs: sampleEpochsBaseline
    }
  },
  athleteOptimized: {
    label: 'Optimized Longevity & Deep SWS Peak',
    description: 'High restorative slow-wave sleep (26%), high vagal HRV (78ms), cellular rejuvenation.',
    record: {
      id: 'arch-athlete',
      date: 'Simulated: Elite Longevity Protocol',
      bedTime: '10:00 PM',
      wakeTime: '6:30 AM',
      durationMinutes: 480,
      inBedMinutes: 510,
      efficiency: 94.1,
      deepMinutes: 125, // 26% SWS
      remMinutes: 120, // 25% REM
      lightMinutes: 235,
      awakeMinutes: 30,
      latencyMinutes: 8,
      awakeningsCount: 1,
      hrvAverage: 78,
      hrvBaseline: 52,
      restingHeartRate: 48,
      respiratoryRate: 12.8,
      temperatureDelta: -0.6,
      sleepDebtHours: 0.0,
      tags: ['65°F cool room', 'NSDR breathwork', 'Morning sunlight (15k lux)', 'No food 3.5h before bed'],
      stageEpochs: sampleEpochsBaseline
    }
  }
};

export const defaultPrognosis: HealthPrognosisData = {
  longevityScore: 82,
  biologicalSleepAge: 31.8,
  chronologicalAge: 34,
  projections: {
    thirtyDays: {
      cognitivePerformance: '+16% Working Memory & Executive Function',
      cellularRepair: 'Optimal nocturnal glymphatic CSF-ISF beta-amyloid clearance',
      metabolicRiskDelta: '-22% Fasting glucose variability & insulin stabilization'
    },
    ninetyDays: {
      cardiovascularRisk: '14% reduction in systemic vascular resistance (SVR)',
      immuneResilience: '38% increase in circulating cytotoxic T-cell memory',
      hrvTrajectory: 'Projected baseline elevate from 47ms → 61ms (+29%)'
    },
    fiveYears: {
      longevityYearsGained: '+3.4 Rejuvenated Biological Healthspan Years',
      neurodegenerativeRiskReduction: '48% lower lifetime hazard ratio for Alzheimer’s & cognitive decay'
    }
  },
  biomarkerCorrelations: [
    {
      biomarker: 'Heart Rate Variability (Nocturnal RMSSD)',
      correlation: 'Vagal Longevity Axis (r = 0.84)',
      impact: 'Deep slow-wave vagal dominance during the first 3 hours restores microvascular endothelial function.'
    },
    {
      biomarker: 'Slow-Wave Sleep (SWS Delta Power)',
      correlation: 'Neuro-Endocrine Rejuvenation (r = 0.91)',
      impact: 'SWS coordinates pulsatile Somatotropin (Growth Hormone) secretion and somatic protein synthesis.'
    },
    {
      biomarker: 'REM Density & Theta Waves',
      correlation: 'Amygdala Emotional Depotentiation (r = 0.79)',
      impact: 'Strips neurochemical adrenaline (noradrenaline) from episodic emotional memories, reducing next-day anxiety.'
    }
  ]
};
