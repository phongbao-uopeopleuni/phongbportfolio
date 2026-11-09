import type {
  AssessmentRecord,
  BatchPreset,
  EducationLevel,
  PrimaryRecord,
  SecondaryRecord,
  VocationalRecord,
} from './types';

const SUBJECTS = {
  primary: [
    {vi: 'Toán', en: 'Mathematics'},
    {vi: 'Tiếng Việt', en: 'Vietnamese'},
  ],
  secondary: [
    {vi: 'Toán', en: 'Mathematics'},
    {vi: 'Ngữ văn', en: 'Literature'},
    {vi: 'Tiếng Anh', en: 'English'},
  ],
  vocational: [
    {vi: 'Cơ sở dữ liệu', en: 'Database Fundamentals'},
    {vi: 'Mạng máy tính', en: 'Computer Networking'},
    {vi: 'Thực hành nghề', en: 'Vocational Practice'},
  ],
};

const round1 = (value: number) => Math.round(value * 10) / 10;
const seededScore = (index: number, salt: number) =>
  round1(4.2 + ((index * (17 + salt) + salt * 11) % 57) / 10);

const classCodeFor = (grade: number, index: number) => {
  const letter = String.fromCharCode(65 + (index % 5));
  return `${grade}${letter}${1 + (Math.floor(index / 5) % 3)}`;
};

export const expectedRegularCount = (annualPeriods: 35 | 70 | 105) =>
  annualPeriods === 35 ? 2 : annualPeriods === 70 ? 3 : 4;

export const computeSemesterAverage = (record: SecondaryRecord) => {
  const regular = record.regularScores.filter(
    (score): score is number => score !== null,
  );
  if (
    regular.length !== expectedRegularCount(record.annualPeriods) ||
    record.midtermScore === null ||
    record.finalScore === null
  ) {
    return null;
  }

  const sum = regular.reduce((total, score) => total + score, 0);
  return round1(
    (sum + 2 * record.midtermScore + 3 * record.finalScore) /
      (regular.length + 5),
  );
};

export const computeAnnualAverage = (record: SecondaryRecord) => {
  const semester2 = computeSemesterAverage(record);
  if (semester2 === null) return null;
  return round1((record.semester1Average + 2 * semester2) / 3);
};

export const computeVocationalResult = (record: VocationalRecord) =>
  record.finalExamScore === null
    ? null
    : round1(0.4 * record.continuousAverage + 0.6 * record.finalExamScore);

const createPrimary = (index: number, grade: number): PrimaryRecord => {
  const evidenceScore = Math.round(seededScore(index, 2));
  const rating = evidenceScore >= 8 ? 'T' : evidenceScore >= 5 ? 'H' : 'C';
  return {
    id: `REC-${String(index + 1).padStart(4, '0')}`,
    studentCode: `HS-${String(index + 1).padStart(4, '0')}`,
    studentLabel: `Học sinh mô phỏng ${String(index + 1).padStart(4, '0')}`,
    grade,
    classCode: classCodeFor(grade, index),
    level: 'primary',
    subject: SUBJECTS.primary[index % SUBJECTS.primary.length],
    semester: 2,
    synthetic: true,
    kind: 'primary',
    periodicScore: evidenceScore,
    rating,
    schoolResult: rating,
    nationalResult: rating,
    hueResult: rating,
    evidence: {periodicScore: evidenceScore, rating},
  };
};

const createSecondary = (
  index: number,
  grade: number,
  level: Exclude<EducationLevel, 'primary'>,
): SecondaryRecord => {
  const annualPeriods = ([35, 70, 105] as const)[index % 3];
  const regularCount = expectedRegularCount(annualPeriods);
  const regularScores = Array.from({length: regularCount}, (_, offset) =>
    seededScore(index, offset + 1),
  );
  const midtermScore = seededScore(index, 6);
  const finalScore = seededScore(index, 9);
  const record: SecondaryRecord = {
    id: `REC-${String(index + 1).padStart(4, '0')}`,
    studentCode: `HS-${String(index + 1).padStart(4, '0')}`,
    studentLabel: `Học sinh mô phỏng ${String(index + 1).padStart(4, '0')}`,
    grade,
    classCode: classCodeFor(grade, index),
    level,
    subject: SUBJECTS.secondary[index % SUBJECTS.secondary.length],
    semester: 2,
    synthetic: true,
    kind: 'secondary',
    annualPeriods,
    regularScores,
    midtermScore,
    finalScore,
    semester1Average: seededScore(index, 12),
    schoolResult: null,
    nationalResult: null,
    hueResult: null,
    retakeScore: null,
    retakeApproved: false,
    evidence: {
      regularScores: [...regularScores],
      midtermScore,
      finalScore,
    },
  };
  const annual = computeAnnualAverage(record);
  record.schoolResult = annual;
  record.nationalResult = annual;
  record.hueResult = annual;
  return record;
};

const createVocational = (index: number): VocationalRecord => {
  const year = (index % 3) + 1;
  const continuousAverage = Math.max(5, seededScore(index, 4));
  const finalExamScore = seededScore(index, 8);
  const record: VocationalRecord = {
    id: `REC-${String(index + 1).padStart(4, '0')}`,
    studentCode: `HS-${String(index + 1).padStart(4, '0')}`,
    studentLabel: `Người học mô phỏng ${String(index + 1).padStart(4, '0')}`,
    grade: year,
    classCode: `CĐ${year}-${String.fromCharCode(65 + (index % 5))}`,
    level: 'vocational',
    subject: SUBJECTS.vocational[index % SUBJECTS.vocational.length],
    semester: 2,
    synthetic: true,
    kind: 'vocational',
    attendanceRate: 82 + (index % 18),
    continuousAverage,
    finalExamScore,
    schoolResult: null,
    nationalResult: null,
    hueResult: null,
    evidence: {
      attendanceRate: 82 + (index % 18),
      continuousAverage,
      finalExamScore,
    },
  };
  const result = computeVocationalResult(record);
  record.schoolResult = result;
  record.nationalResult = result;
  record.hueResult = result;
  return record;
};

const injectIncident = (
  source: AssessmentRecord,
  index: number,
): AssessmentRecord => {
  const record = structuredClone(source) as AssessmentRecord;

  if (record.kind === 'primary') {
    if (index % 223 === 0) record.periodicScore = record.evidence.periodicScore + 0.5;
    if (index % 271 === 0) record.periodicScore = null;
    if (index % 347 === 0) record.nationalResult = record.rating === 'T' ? 'H' : 'T';
    if (index % 389 === 0) record.hueResult = record.rating === 'C' ? 'H' : 'C';
    return record;
  }

  if (record.kind === 'vocational') {
    if (index % 109 === 0) record.finalExamScore = null;
    if (index % 137 === 0 && typeof record.schoolResult === 'number') {
      record.schoolResult = round1(record.schoolResult + 0.8);
    }
    if (index % 163 === 0) record.attendanceRate = 72;
    if (index % 181 === 0 && typeof record.schoolResult === 'number') {
      record.nationalResult = round1(record.schoolResult - 0.6);
    }
    if (index % 197 === 0 && typeof record.nationalResult === 'number') {
      record.hueResult = round1(record.nationalResult + 0.4);
    }
    return record;
  }

  if (index % 97 === 0) record.finalScore = null;
  if (index % 131 === 0 && typeof record.schoolResult === 'number') {
    record.nationalResult = round1(record.schoolResult - 0.7);
  }
  if (index % 173 === 0 && typeof record.nationalResult === 'number') {
    record.hueResult = round1(record.nationalResult + 0.4);
  }
  if (index % 251 === 0) record.finalScore = 12;
  if (index % 307 === 0) record.regularScores = record.regularScores.slice(0, -1);
  if (index % 401 === 0 && typeof record.schoolResult === 'number') {
    record.schoolResult = round1(record.schoolResult + 0.6);
  }
  if (index % 503 === 0) {
    record.retakeScore = 7;
    record.retakeApproved = false;
  }
  return record;
};

export const SCHOOL_BATCH_COUNTS = {
  primary: 800,
  lowerSecondary: 700,
  upperSecondary: 500,
} as const;

export const VOCATIONAL_BATCH_COUNT = 200;

export const createSyntheticDataset = (
  preset: BatchPreset,
): AssessmentRecord[] => {
  const createRecord = (clean: AssessmentRecord, index: number) =>
    preset === 'incidents' ? injectIncident(clean, index) : clean;
  const records: AssessmentRecord[] = [];

  for (let localIndex = 0; localIndex < SCHOOL_BATCH_COUNTS.primary; localIndex += 1) {
    const index = records.length;
    const grade = (localIndex % 5) + 1;
    records.push(createRecord(createPrimary(index, grade), index));
  }

  for (let localIndex = 0; localIndex < SCHOOL_BATCH_COUNTS.lowerSecondary; localIndex += 1) {
    const index = records.length;
    const grade = (localIndex % 4) + 6;
    records.push(
      createRecord(createSecondary(index, grade, 'lower-secondary'), index),
    );
  }

  for (let localIndex = 0; localIndex < SCHOOL_BATCH_COUNTS.upperSecondary; localIndex += 1) {
    const index = records.length;
    const grade = (localIndex % 3) + 10;
    records.push(
      createRecord(createSecondary(index, grade, 'upper-secondary'), index),
    );
  }

  for (let localIndex = 0; localIndex < VOCATIONAL_BATCH_COUNT; localIndex += 1) {
    const index = records.length;
    records.push(createRecord(createVocational(index), index));
  }

  if (preset === 'incidents' && records.length > 900) {
    records[899] = {
      ...records[899],
      studentCode: records[898].studentCode,
      grade: records[898].grade,
      classCode: records[898].classCode,
      level: records[898].level,
      subject: records[898].subject,
    } as AssessmentRecord;
  }

  return records;
};
