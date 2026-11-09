import {
  computeAnnualAverage,
  computeVocationalResult,
  expectedRegularCount,
} from './syntheticData';
import type {
  AssessmentRecord,
  AuditIssue,
  AuditSummary,
  ResultValue,
} from './types';

const sameResult = (left: ResultValue, right: ResultValue) => {
  if (typeof left === 'number' && typeof right === 'number') {
    return Math.abs(left - right) < 0.05;
  }
  return left === right;
};

export const formatResult = (value: ResultValue) =>
  value === null ? '—' : String(value);

const issue = (
  record: AssessmentRecord,
  input: Omit<AuditIssue, 'id' | 'recordId' | 'studentCode'>,
): AuditIssue => ({
  ...input,
  id: `${record.id}:${input.ruleId}`,
  recordId: record.id,
  studentCode: record.studentCode,
});

const numericScores = (record: AssessmentRecord) => {
  if (record.kind === 'primary') return [record.periodicScore];
  if (record.kind === 'vocational') {
    return [record.continuousAverage, record.finalExamScore];
  }
  return [
    ...record.regularScores,
    record.midtermScore,
    record.finalScore,
    record.semester1Average,
    record.retakeScore,
  ];
};

const auditRecord = (record: AssessmentRecord): AuditIssue[] => {
  const issues: AuditIssue[] = [];
  const invalid = numericScores(record).find(
    (score) => score !== null && (score < 0 || score > 10),
  );

  if (invalid !== undefined) {
    issues.push(
      issue(record, {
        ruleId: 'score-range',
        severity: 'critical',
        title: {vi: 'Điểm ngoài thang 0–10', en: 'Score outside 0–10'},
        detail: {
          vi: 'Bản ghi có điểm không hợp lệ; phải đối chiếu lại chứng từ chấm trước khi xác nhận.',
          en: 'The record contains an invalid score; verify it against the marking evidence before confirmation.',
        },
        expected: '0–10',
        actual: String(invalid),
        canResolveFromEvidence: true,
      }),
    );
  }

  if (record.kind === 'primary') {
    if (record.periodicScore === null) {
      issues.push(
        issue(record, {
          ruleId: 'periodic-required',
          severity: 'critical',
          title: {vi: 'Thiếu điểm kiểm tra định kỳ', en: 'Missing periodic score'},
          detail: {
            vi: 'Điểm định kỳ chưa được nhập và chưa có trạng thái miễn/vắng hợp lệ.',
            en: 'The periodic score is missing without a valid exemption or absence state.',
          },
          expected: String(record.evidence.periodicScore),
          actual: '—',
          canResolveFromEvidence: true,
        }),
      );
    } else if (!Number.isInteger(record.periodicScore)) {
      issues.push(
        issue(record, {
          ruleId: 'primary-integer',
          severity: 'critical',
          title: {vi: 'Tiểu học có điểm thập phân', en: 'Decimal score in primary'},
          detail: {
            vi: 'Bài kiểm tra định kỳ tiểu học dùng thang 10 và không ghi điểm thập phân.',
            en: 'Primary periodic tests use a 10-point scale without decimal scores.',
          },
          expected: String(record.evidence.periodicScore),
          actual: String(record.periodicScore),
          canResolveFromEvidence: true,
        }),
      );
    }
  } else if (record.kind === 'secondary') {
    const expectedCount = expectedRegularCount(record.annualPeriods);
    if (
      record.regularScores.length !== expectedCount ||
      record.regularScores.some((score) => score === null)
    ) {
      issues.push(
        issue(record, {
          ruleId: 'regular-count',
          severity: 'critical',
          title: {vi: 'Thiếu điểm thường xuyên', en: 'Missing regular assessment'},
          detail: {
            vi: 'Số điểm thường xuyên không khớp số tiết của môn học trong năm.',
            en: 'The number of regular scores does not match the subject annual period count.',
          },
          expected: String(expectedCount),
          actual: String(record.regularScores.filter((score) => score !== null).length),
          canResolveFromEvidence: true,
        }),
      );
    }

    if (record.midtermScore === null || record.finalScore === null) {
      issues.push(
        issue(record, {
          ruleId: 'periodic-required',
          severity: 'critical',
          title: {vi: 'Thiếu điểm giữa kỳ/cuối kỳ', en: 'Missing midterm/final score'},
          detail: {
            vi: 'Môn có điểm phải có một điểm giữa kỳ và một điểm cuối kỳ trong học kỳ.',
            en: 'A scored subject requires one midterm and one final score in the semester.',
          },
          expected: `${record.evidence.midtermScore} / ${record.evidence.finalScore}`,
          actual: `${formatResult(record.midtermScore)} / ${formatResult(record.finalScore)}`,
          canResolveFromEvidence: true,
        }),
      );
    }

    const computed = computeAnnualAverage(record);
    if (
      computed !== null &&
      typeof record.schoolResult === 'number' &&
      !sameResult(computed, record.schoolResult)
    ) {
      issues.push(
        issue(record, {
          ruleId: 'average-formula',
          severity: 'critical',
          title: {vi: 'Sai kết quả tính cả năm', en: 'Incorrect annual calculation'},
          detail: {
            vi: 'Kết quả tại trường không khớp công thức học kỳ và cả năm của Thông tư 22.',
            en: 'The school result does not match the semester and annual formulas in Circular 22.',
          },
          expected: String(computed),
          actual: formatResult(record.schoolResult),
          canResolveFromEvidence: true,
        }),
      );
    }

    if (record.retakeScore !== null && !record.retakeApproved) {
      issues.push(
        issue(record, {
          ruleId: 'retake-approval',
          severity: 'critical',
          title: {vi: 'Điểm đánh giá lại chưa được phê duyệt', en: 'Unapproved reassessment result'},
          detail: {
            vi: 'Có điểm đánh giá lại nhưng thiếu trạng thái phê duyệt và hồ sơ nghiệp vụ.',
            en: 'A reassessment score exists without approval status and supporting workflow evidence.',
          },
          expected: 'approved',
          actual: 'not approved',
          canResolveFromEvidence: false,
        }),
      );
    }

    if (
      record.retakeScore !== null &&
      computed !== null &&
      computed >= 5
    ) {
      issues.push(
        issue(record, {
          ruleId: 'retake-eligibility',
          severity: 'warning',
          title: {vi: 'Cần kiểm tra điều kiện đánh giá lại', en: 'Check reassessment eligibility'},
          detail: {
            vi: 'Kết quả tính hiện tại từ 5,0 trở lên; cần kiểm tra hồ sơ xác định học sinh có thuộc diện đánh giá lại hay không.',
            en: 'The calculated result is at least 5.0; verify whether the learner was eligible for reassessment.',
          },
          expected: '< 5.0 hoặc môn nhận xét Chưa đạt',
          actual: String(computed),
          canResolveFromEvidence: false,
        }),
      );
    }
  } else {
    if (record.finalExamScore === null) {
      issues.push(
        issue(record, {
          ruleId: 'periodic-required',
          severity: 'critical',
          title: {vi: 'Thiếu điểm thi kết thúc mô-đun', en: 'Missing module final-exam score'},
          detail: {
            vi: 'Kết quả mô-đun chưa có điểm thi kết thúc và chưa có trạng thái xử lý hợp lệ.',
            en: 'The module has no final-exam result or valid exception workflow.',
          },
          expected: String(record.evidence.finalExamScore),
          actual: '—',
          canResolveFromEvidence: true,
        }),
      );
    }

    if (
      record.finalExamScore !== null &&
      (record.attendanceRate < 80 || record.continuousAverage < 5)
    ) {
      issues.push(
        issue(record, {
          ruleId: 'vocational-exam-eligibility',
          severity: 'critical',
          title: {vi: 'Chưa đủ điều kiện dự thi mô-đun', en: 'Module exam eligibility not met'},
          detail: {
            vi: 'Có điểm thi nhưng tỷ lệ tham dự dưới 80% hoặc điểm kiểm tra trung bình dưới 5,0; cần kiểm tra quyết định nghiệp vụ.',
            en: 'An exam score exists despite attendance below 80% or coursework below 5.0; verify the authorized workflow.',
          },
          expected: 'attendance ≥ 80%; coursework ≥ 5.0',
          actual: `${record.attendanceRate}%; ${record.continuousAverage}`,
          canResolveFromEvidence: false,
        }),
      );
    }

    const computed = computeVocationalResult(record);
    if (
      computed !== null &&
      typeof record.schoolResult === 'number' &&
      !sameResult(computed, record.schoolResult)
    ) {
      issues.push(
        issue(record, {
          ruleId: 'vocational-formula',
          severity: 'critical',
          title: {vi: 'Sai điểm môn học/mô-đun nghề', en: 'Incorrect vocational module result'},
          detail: {
            vi: 'Kết quả không khớp trọng số 0,4 điểm kiểm tra và 0,6 điểm thi kết thúc.',
            en: 'The result does not match the 0.4 coursework and 0.6 final-exam weights.',
          },
          expected: String(computed),
          actual: formatResult(record.schoolResult),
          canResolveFromEvidence: true,
        }),
      );
    }
  }

  if (!sameResult(record.schoolResult, record.nationalResult)) {
    issues.push(
      issue(record, {
        ruleId: 'national-mismatch',
        severity: 'critical',
        title: {vi: 'Lệch dữ liệu trường ↔ CSDL quốc gia', en: 'School ↔ national mismatch'},
        detail: {
          vi: 'Kết quả tại hệ thống trường và lớp dữ liệu đồng bộ quốc gia không giống nhau.',
          en: 'The school result differs from the value synchronized to the national data layer.',
        },
        expected: formatResult(record.schoolResult),
        actual: formatResult(record.nationalResult),
        canResolveFromEvidence: true,
      }),
    );
  }

  if (!sameResult(record.nationalResult, record.hueResult)) {
    issues.push(
      issue(record, {
        ruleId: 'hue-mismatch',
        severity: 'warning',
        title: {vi: 'Hue-S chưa đồng bộ', en: 'Hue-S is out of sync'},
        detail: {
          vi: 'Hue-S là hệ thống phụ trợ; cần đồng bộ lại từ kết quả đã xác nhận, không sửa ngược nguồn.',
          en: 'Hue-S is an auxiliary system; resync it from the confirmed result instead of editing the source backward.',
        },
        expected: formatResult(record.nationalResult),
        actual: formatResult(record.hueResult),
        canResolveFromEvidence: true,
      }),
    );
  }

  return issues;
};

export const runAudit = (records: AssessmentRecord[]): AuditIssue[] => {
  const issues = records.flatMap(auditRecord);
  const seen = new Map<string, AssessmentRecord>();

  for (const record of records) {
    const key = [
      record.studentCode,
      record.grade,
      record.subject.vi,
      record.semester,
    ].join('|');
    const previous = seen.get(key);
    if (!previous) {
      seen.set(key, record);
      continue;
    }
    issues.push(
      issue(record, {
        ruleId: 'duplicate-student-subject',
        severity: 'critical',
        title: {vi: 'Trùng bản ghi học sinh–môn', en: 'Duplicate learner–subject record'},
        detail: {
          vi: `Bản ghi trùng khóa nghiệp vụ với ${previous.id}; không được tự động gộp khi chưa đối chiếu.`,
          en: `The business key duplicates ${previous.id}; do not merge it before reconciliation.`,
        },
        expected: '1 record',
        actual: '2 records',
        canResolveFromEvidence: false,
      }),
    );
  }

  return issues;
};

export const summarizeAudit = (
  records: AssessmentRecord[],
  issues: AuditIssue[],
): AuditSummary => {
  const affected = new Set(issues.map((item) => item.recordId));
  return {
    totalRecords: records.length,
    critical: issues.filter((item) => item.severity === 'critical').length,
    warnings: issues.filter((item) => item.severity === 'warning').length,
    cleanRecords: records.length - affected.size,
  };
};

export const resolveFromEvidence = (
  record: AssessmentRecord,
  ruleId: AuditIssue['ruleId'],
): AssessmentRecord => {
  const next = structuredClone(record) as AssessmentRecord;
  if (next.kind === 'primary') {
    if (
      ruleId === 'primary-integer' ||
      ruleId === 'periodic-required' ||
      ruleId === 'score-range'
    ) {
      next.periodicScore = next.evidence.periodicScore;
    } else if (ruleId === 'national-mismatch') {
      next.nationalResult = next.schoolResult;
    } else if (ruleId === 'hue-mismatch') {
      next.hueResult = next.nationalResult;
    }
    return next;
  }

  if (next.kind === 'vocational') {
    if (ruleId === 'periodic-required' || ruleId === 'score-range') {
      next.continuousAverage = next.evidence.continuousAverage;
      next.finalExamScore = next.evidence.finalExamScore;
    } else if (ruleId === 'vocational-formula') {
      next.schoolResult = computeVocationalResult(next);
    } else if (ruleId === 'national-mismatch') {
      next.nationalResult = next.schoolResult;
    } else if (ruleId === 'hue-mismatch') {
      next.hueResult = next.nationalResult;
    }
    return next;
  }

  if (ruleId === 'regular-count') {
    next.regularScores = [...next.evidence.regularScores];
  } else if (ruleId === 'periodic-required' || ruleId === 'score-range') {
    next.midtermScore = next.evidence.midtermScore;
    next.finalScore = next.evidence.finalScore;
  } else if (ruleId === 'average-formula') {
    next.schoolResult = computeAnnualAverage(next);
  } else if (ruleId === 'national-mismatch') {
    next.nationalResult = next.schoolResult;
  } else if (ruleId === 'hue-mismatch') {
    next.hueResult = next.nationalResult;
  }
  return next;
};

export type DistributionBin = {
  key: string;
  label: string;
  school: number;
  national: number;
};

export const buildDistribution = (
  records: AssessmentRecord[],
): DistributionBin[] => {
  const numeric = records.filter((record) => record.kind !== 'primary');
  const bins = [
    {key: 'under5', label: '< 5', min: 0, max: 5},
    {key: '5to65', label: '5–<6.5', min: 5, max: 6.5},
    {key: '65to8', label: '6.5–<8', min: 6.5, max: 8},
    {key: '8plus', label: '8–10', min: 8, max: 10.01},
  ];
  return bins.map((bin) => ({
    key: bin.key,
    label: bin.label,
    school: numeric.filter(
      (record) =>
        typeof record.schoolResult === 'number' &&
        record.schoolResult >= bin.min &&
        record.schoolResult < bin.max,
    ).length,
    national: numeric.filter(
      (record) =>
        typeof record.nationalResult === 'number' &&
        record.nationalResult >= bin.min &&
        record.nationalResult < bin.max,
    ).length,
  }));
};
