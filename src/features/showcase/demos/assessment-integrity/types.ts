import type {L} from '../../types/showcase';

export type EducationLevel =
  | 'primary'
  | 'lower-secondary'
  | 'upper-secondary'
  | 'vocational';

export type PolicyVersion = 'current-2026-11-08' | 'effective-2026-12-01';
export type LabMode = 'guided' | 'professional';
export type BatchPreset = 'incidents' | 'verified';
export type BatchStatus =
  | 'draft'
  | 'reviewed'
  | 'locked'
  | 'published'
  | 'withdrawn';
export type IssueSeverity = 'critical' | 'warning';

export type ResultValue = number | 'T' | 'H' | 'C' | null;

type BaseRecord = {
  id: string;
  studentCode: string;
  studentLabel: string;
  grade: number;
  classCode: string;
  level: EducationLevel;
  subject: L;
  semester: 2;
  synthetic: true;
};

export type PrimaryRecord = BaseRecord & {
  kind: 'primary';
  periodicScore: number | null;
  rating: 'T' | 'H' | 'C';
  schoolResult: ResultValue;
  nationalResult: ResultValue;
  hueResult: ResultValue;
  evidence: {
    periodicScore: number;
    rating: 'T' | 'H' | 'C';
  };
};

export type SecondaryRecord = BaseRecord & {
  kind: 'secondary';
  annualPeriods: 35 | 70 | 105;
  regularScores: Array<number | null>;
  midtermScore: number | null;
  finalScore: number | null;
  semester1Average: number;
  schoolResult: ResultValue;
  nationalResult: ResultValue;
  hueResult: ResultValue;
  retakeScore: number | null;
  retakeApproved: boolean;
  evidence: {
    regularScores: number[];
    midtermScore: number;
    finalScore: number;
  };
};

export type VocationalRecord = BaseRecord & {
  kind: 'vocational';
  attendanceRate: number;
  continuousAverage: number;
  finalExamScore: number | null;
  schoolResult: ResultValue;
  nationalResult: ResultValue;
  hueResult: ResultValue;
  evidence: {
    attendanceRate: number;
    continuousAverage: number;
    finalExamScore: number;
  };
};

export type AssessmentRecord = PrimaryRecord | SecondaryRecord | VocationalRecord;

export type AuditRuleId =
  | 'score-range'
  | 'primary-integer'
  | 'periodic-required'
  | 'regular-count'
  | 'average-formula'
  | 'vocational-formula'
  | 'vocational-exam-eligibility'
  | 'national-mismatch'
  | 'hue-mismatch'
  | 'retake-approval'
  | 'retake-eligibility'
  | 'duplicate-student-subject';

export type AuditIssue = {
  id: string;
  ruleId: AuditRuleId;
  recordId: string;
  studentCode: string;
  severity: IssueSeverity;
  title: L;
  detail: L;
  expected?: string;
  actual?: string;
  canResolveFromEvidence: boolean;
};

export type AuditSummary = {
  totalRecords: number;
  critical: number;
  warnings: number;
  cleanRecords: number;
};

export type AuditEvent = {
  id: string;
  at: string;
  actor: L;
  action: L;
  recordId?: string;
  reason: L;
  before?: string;
  after?: string;
};

export type PolicyProfile = {
  id: PolicyVersion;
  label: L;
  effective: string;
  status: L;
  notes: L[];
};
