export type SleepStage = 'deep' | 'rem' | 'light' | 'awake';

export interface SleepStageEpoch {
  timestamp: string; // e.g. "23:00"
  stage: SleepStage;
  durationMinutes: number;
  heartRate: number;
  hrv: number;
}

export interface SleepRecord {
  id: string;
  date: string;
  bedTime: string;
  wakeTime: string;
  durationMinutes: number;
  inBedMinutes: number;
  efficiency: number; // percentage
  deepMinutes: number;
  remMinutes: number;
  lightMinutes: number;
  awakeMinutes: number;
  latencyMinutes: number;
  awakeningsCount: number;
  hrvAverage: number;
  hrvBaseline: number;
  restingHeartRate: number;
  respiratoryRate: number;
  temperatureDelta: number; // e.g. -0.4°C
  sleepDebtHours: number;
  tags: string[];
  stageEpochs: SleepStageEpoch[];
}

export interface SleepDiagnosis {
  title: string;
  score: number;
  severity: 'Optimal' | 'Mild Imbalance' | 'Moderate Risk' | 'High Risk';
  summary: string;
  rootCauses: {
    factor: string;
    confidence: number;
    detail: string;
  }[];
  biologicalAgeShiftYears: number;
  immediateInterventions: {
    step: number;
    action: string;
    detail: string;
  }[];
}

export interface HealthPrognosisData {
  longevityScore: number;
  biologicalSleepAge: number;
  chronologicalAge: number;
  projections: {
    thirtyDays: {
      cognitivePerformance: string;
      cellularRepair: string;
      metabolicRiskDelta: string;
    };
    ninetyDays: {
      cardiovascularRisk: string;
      immuneResilience: string;
      hrvTrajectory: string;
    };
    fiveYears: {
      longevityYearsGained: string;
      neurodegenerativeRiskReduction: string;
    };
  };
  biomarkerCorrelations: {
    biomarker: string;
    correlation: string;
    impact: string;
  }[];
}

export interface CBTIRestrictionPlan {
  averageTST: number; // Total Sleep Time in hours
  prescribedTIB: number; // Time in bed in hours
  bedTime: string;
  wakeTime: string;
  targetEfficiency: number;
  currentEfficiency: number;
  phase: 'Restriction' | 'Titration' | 'Consolidation' | 'Maintenance';
}

export interface UserProfile {
  name: string;
  age: number;
  chronotype: 'Early Lark' | 'Intermediate Bear' | 'Night Owl' | 'Variable Dolphin';
  targetSleepDurationHours: number;
  caffeineCutoffHour: number; // 24hr format
  primaryGoal: 'Increase Deep Sleep' | 'Cure Insomnia (CBT-I)' | 'Optimize Longevity & HRV' | 'Circadian Realignment';
}
