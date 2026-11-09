import {useMemo, useState} from 'react';
import {
  CheckCircle2,
  Database,
  FileCheck2,
  GraduationCap,
  History,
  LockKeyhole,
  RefreshCw,
  RotateCcw,
  ShieldCheck,
} from 'lucide-react';
import {useI18n} from '../../../../i18n';
import {
  buildDistribution,
  formatResult,
  resolveFromEvidence,
  runAudit,
  summarizeAudit,
} from './auditEngine';
import {LEVEL_LABEL} from './policy';
import {createSyntheticDataset, expectedRegularCount} from './syntheticData';
import WorkflowExplorer, {type WorkflowMetrics} from './WorkflowExplorer';
import type {
  AssessmentRecord,
  AuditEvent,
  AuditIssue,
  BatchPreset,
  BatchStatus,
  EducationLevel,
} from './types';

const TXT = {
  title: {
    vi: 'Mô phỏng vận hành dữ liệu điểm · Khảo thí Huế',
    en: 'Assessment Score Operations · Hue, Vietnam',
  },
  subtitle: {
    vi: 'Theo dõi cách tiếp nhận, kiểm tra, xử lý ngoại lệ, đối soát và công bố một lô điểm liên cấp.',
    en: 'Follow how a cross-level score batch is received, validated, resolved, reconciled and issued.',
  },
  synthetic: {vi: '100% dữ liệu tổng hợp', en: '100% synthetic data'},
  noNetwork: {vi: 'Không gửi dữ liệu ra ngoài', en: 'No external data transfer'},
  batch: {vi: 'Tình trạng dữ liệu', en: 'Dataset state'},
  incidents: {vi: 'Lô có lỗi nghiệp vụ', en: 'Batch with incidents'},
  verified: {vi: 'Lô đã đối soát', en: 'Verified batch'},
  level: {vi: 'Cấp học', en: 'Education level'},
  schoolLevels: {
    vi: 'Liên cấp 1–2–3 · 2.000 học sinh',
    en: 'K–12 operation · 2,000 learners',
  },
  records: {vi: 'Bản ghi đang xét', en: 'Records in scope'},
  critical: {vi: 'Lỗi chặn phát hành', en: 'Blocking issues'},
  warnings: {vi: 'Cảnh báo', en: 'Warnings'},
  clean: {vi: 'Bản ghi sạch', en: 'Clean records'},
  systems: {vi: 'Hệ thống đối soát', en: 'Systems reconciled'},
  runAudit: {vi: 'Chạy kiểm tra lô', en: 'Run batch audit'},
  rerunAudit: {vi: 'Chạy lại kiểm tra', en: 'Run audit again'},
  lock: {vi: 'Khóa lô', en: 'Lock batch'},
  publish: {vi: 'Ký & phát hành', en: 'Sign & issue'},
  withdraw: {vi: 'Yêu cầu thu hồi', en: 'Request withdrawal'},
  recreate: {vi: 'Tạo lại bản nháp', en: 'Recreate draft'},
  auditResults: {vi: 'Kết quả kiểm tra', en: 'Audit findings'},
  auditHint: {
    vi: 'Chạy kiểm tra để đối chiếu phạm vi điểm, số đầu điểm, công thức, điều kiện dự thi/đánh giá lại và dữ liệu giữa ba hệ thống.',
    en: 'Run the audit to check score ranges, required entries, formulas, exam/reassessment eligibility and cross-system values.',
  },
  search: {vi: 'Tìm mã học sinh hoặc lớp', en: 'Search learner code or class'},
  allSeverity: {vi: 'Tất cả mức độ', en: 'All severities'},
  learner: {vi: 'Học sinh', en: 'Learner'},
  subject: {vi: 'Môn', en: 'Subject'},
  finding: {vi: 'Phát hiện', en: 'Finding'},
  actual: {vi: 'Hiện tại', en: 'Actual'},
  expected: {vi: 'Đối chiếu', en: 'Expected'},
  view: {vi: 'Xem', en: 'View'},
  noIssues: {
    vi: 'Không phát hiện lỗi trong phạm vi đang chọn.',
    en: 'No issue was found in the selected scope.',
  },
  issueDetail: {vi: 'Chi tiết đối soát', en: 'Reconciliation detail'},
  fixFromEvidence: {
    vi: 'Áp dụng từ chứng từ gốc đã xác minh',
    en: 'Apply verified source evidence',
  },
  manualOnly: {
    vi: 'Không tự sửa: cần phê duyệt hoặc xác minh nghiệp vụ.',
    en: 'No automatic change: workflow approval or manual verification is required.',
  },
  distribution: {vi: 'Đối chiếu phổ điểm', en: 'Distribution comparison'},
  school: {vi: 'Hệ thống trường', en: 'School system'},
  national: {vi: 'CSDL quốc gia', en: 'National database'},
  hue: {vi: 'Hue-S · phụ trợ', en: 'Hue-S · auxiliary'},
  reconciliation: {vi: 'Đối soát ba hệ thống', en: 'Three-system reconciliation'},
  sourceOrder: {
    vi: 'Nguồn nghiệp vụ → Học bạ số/CSDL quốc gia → Hue-S. Không sửa ngược từ Hue-S về nguồn.',
    en: 'Operational source → digital transcript/national database → Hue-S. Never write back from Hue-S to the source.',
  },
  auditLog: {vi: 'Nhật ký kiểm soát', en: 'Control audit log'},
  emptyLog: {
    vi: 'Chưa có thao tác. Mỗi lần kiểm tra, sửa, khóa hoặc phát hành sẽ được ghi lại.',
    en: 'No action yet. Every audit, correction, lock and issuance is recorded here.',
  },
  batchStatus: {vi: 'Trạng thái lô', en: 'Batch status'},
  draft: {vi: 'Nháp', en: 'Draft'},
  reviewed: {vi: 'Đã kiểm tra', en: 'Reviewed'},
  locked: {vi: 'Đã khóa', en: 'Locked'},
  published: {vi: 'Đã phát hành', en: 'Issued'},
  withdrawn: {vi: 'Đang thu hồi', en: 'Withdrawal requested'},
} as const;

const STATUS_LABEL: Record<BatchStatus, {vi: string; en: string}> = {
  draft: TXT.draft,
  reviewed: TXT.reviewed,
  locked: TXT.locked,
  published: TXT.published,
  withdrawn: TXT.withdrawn,
};

const classNames = (...items: Array<string | false | undefined>) =>
  items.filter(Boolean).join(' ');

type ScopeFilter = EducationLevel | 'school';

const valueSnapshot = (record: AssessmentRecord) => {
  if (record.kind === 'primary') {
    return `periodic=${formatResult(record.periodicScore)}; school=${formatResult(record.schoolResult)}; national=${formatResult(record.nationalResult)}; hue=${formatResult(record.hueResult)}`;
  }
  if (record.kind === 'vocational') {
    return `attendance=${record.attendanceRate}%; coursework=${record.continuousAverage}; final=${formatResult(record.finalExamScore)}; school=${formatResult(record.schoolResult)}; national=${formatResult(record.nationalResult)}; hue=${formatResult(record.hueResult)}`;
  }
  return `regular=${record.regularScores.map(formatResult).join(',')}; mid=${formatResult(record.midtermScore)}; final=${formatResult(record.finalScore)}; school=${formatResult(record.schoolResult)}; national=${formatResult(record.nationalResult)}; hue=${formatResult(record.hueResult)}`;
};

const expectedScoreValueCount = (record: AssessmentRecord) => {
  if (record.kind === 'primary') return 2;
  if (record.kind === 'vocational') return 4;
  return expectedRegularCount(record.annualPeriods) + 4;
};

const receivedScoreValueCount = (record: AssessmentRecord) => {
  if (record.kind === 'primary') {
    return Number(record.periodicScore !== null) + Number(record.schoolResult !== null);
  }
  if (record.kind === 'vocational') {
    return (
      Number(Number.isFinite(record.attendanceRate)) +
      Number(Number.isFinite(record.continuousAverage)) +
      Number(record.finalExamScore !== null) +
      Number(record.schoolResult !== null)
    );
  }
  return (
    record.regularScores.filter((score) => score !== null).length +
    Number(record.midtermScore !== null) +
    Number(record.finalScore !== null) +
    1 +
    Number(record.schoolResult !== null)
  );
};

export default function AssessmentIntegrityLab() {
  const {locale} = useI18n();
  const t = <K extends keyof typeof TXT>(key: K) => TXT[key][locale];
  const [preset, setPreset] = useState<BatchPreset>('incidents');
  const [level, setLevel] = useState<ScopeFilter>('school');
  const [records, setRecords] = useState<AssessmentRecord[]>(() =>
    createSyntheticDataset('incidents'),
  );
  const [hasRunAudit, setHasRunAudit] = useState(false);
  const [batchStatus, setBatchStatus] = useState<BatchStatus>('draft');
  const [selectedIssueId, setSelectedIssueId] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [severity, setSeverity] = useState<'all' | 'critical' | 'warning'>(
    'all',
  );
  const [events, setEvents] = useState<AuditEvent[]>([]);
  const isEditable = batchStatus === 'draft' || batchStatus === 'reviewed';

  const scopedRecords = useMemo(
    () =>
      level === 'school'
        ? records.filter((record) => record.level !== 'vocational')
        : records.filter((record) => record.level === level),
    [level, records],
  );
  const issues = useMemo(() => runAudit(scopedRecords), [scopedRecords]);
  const summary = useMemo(
    () => summarizeAudit(scopedRecords, issues),
    [issues, scopedRecords],
  );
  const selectedIssue = issues.find((item) => item.id === selectedIssueId);
  const selectedRecord = selectedIssue
    ? records.find((record) => record.id === selectedIssue.recordId)
    : undefined;
  const shownIssues = useMemo(() => {
    if (!hasRunAudit) return [];
    const normalized = query.trim().toLowerCase();
    return issues
      .filter((item) => severity === 'all' || item.severity === severity)
      .filter((item) => {
        if (!normalized) return true;
        const record = records.find((candidate) => candidate.id === item.recordId);
        return (
          item.studentCode.toLowerCase().includes(normalized) ||
          record?.classCode.toLowerCase().includes(normalized)
        );
      })
      .slice(0, 30);
  }, [hasRunAudit, issues, query, records, severity]);

  const distribution = useMemo(
    () => buildDistribution(scopedRecords),
    [scopedRecords],
  );
  const primaryDistribution = useMemo(
    () =>
      (['T', 'H', 'C'] as const).map((rating) => ({
        key: rating,
        label: rating,
        school: scopedRecords.filter(
          (record) =>
            record.kind === 'primary' && record.schoolResult === rating,
        ).length,
        national: scopedRecords.filter(
          (record) =>
            record.kind === 'primary' && record.nationalResult === rating,
        ).length,
      })),
    [scopedRecords],
  );
  const chartData = level === 'primary' ? primaryDistribution : distribution;
  const chartMax = Math.max(
    1,
    ...chartData.flatMap((item) => [item.school, item.national]),
  );

  const workflowMetrics = useMemo<WorkflowMetrics>(() => {
    const auditedIssues = hasRunAudit ? issues : [];
    const levelByRecordId = new Map(
      scopedRecords.map((record) => [record.id, record.level]),
    );
    const studentCodeByRecordId = new Map(
      scopedRecords.map((record) => [record.id, record.studentCode]),
    );
    const levelBreakdown = (
      ['primary', 'lower-secondary', 'upper-secondary', 'vocational'] as EducationLevel[]
    )
      .map((item) => {
        const levelRecords = scopedRecords.filter((record) => record.level === item);
        const levelIssues = auditedIssues.filter(
          (issue) => levelByRecordId.get(issue.recordId) === item,
        );
        return {
          level: item,
          learnerCount: new Set(levelRecords.map((record) => record.studentCode)).size,
          totalRecords: levelRecords.length,
          expectedScoreValues: levelRecords.reduce(
            (total, record) => total + expectedScoreValueCount(record),
            0,
          ),
          receivedScoreValues: levelRecords.reduce(
            (total, record) => total + receivedScoreValueCount(record),
            0,
          ),
          auditedRecords: hasRunAudit ? levelRecords.length : 0,
          affectedRecords: hasRunAudit
            ? new Set(levelIssues.map((issue) => issue.recordId)).size
            : null,
          affectedLearners: hasRunAudit
            ? new Set(
                levelIssues.map((issue) => studentCodeByRecordId.get(issue.recordId)),
              ).size
            : null,
          critical: hasRunAudit
            ? levelIssues.filter((issue) => issue.severity === 'critical').length
            : null,
          warnings: hasRunAudit
            ? levelIssues.filter((issue) => issue.severity === 'warning').length
            : null,
          cleanRecords: hasRunAudit
            ? levelRecords.length - new Set(levelIssues.map((issue) => issue.recordId)).size
            : null,
          issuedRecords: batchStatus === 'published' ? levelRecords.length : 0,
        };
      })
      .filter((item) => item.totalRecords > 0);
    return {
      expectedLearnerCount: scopedRecords.length,
      learnerCount: new Set(scopedRecords.map((record) => record.studentCode)).size,
      totalRecords: scopedRecords.length,
      expectedScoreValues: scopedRecords.reduce(
        (total, record) => total + expectedScoreValueCount(record),
        0,
      ),
      receivedScoreValues: scopedRecords.reduce(
        (total, record) => total + receivedScoreValueCount(record),
        0,
      ),
      educationLevels: new Set(scopedRecords.map((record) => record.level)).size,
      primaryRecords: scopedRecords.filter((record) => record.level === 'primary').length,
      lowerSecondaryRecords: scopedRecords.filter(
        (record) => record.level === 'lower-secondary',
      ).length,
      upperSecondaryRecords: scopedRecords.filter(
        (record) => record.level === 'upper-secondary',
      ).length,
      vocationalRecords: scopedRecords.filter(
        (record) => record.level === 'vocational',
      ).length,
      levelBreakdown,
      critical: hasRunAudit ? summary.critical : null,
      warnings: hasRunAudit ? summary.warnings : null,
      affectedRecords: hasRunAudit
        ? summary.totalRecords - summary.cleanRecords
        : null,
      affectedLearners: hasRunAudit
        ? new Set(
            auditedIssues.map((issue) => studentCodeByRecordId.get(issue.recordId)),
          ).size
        : null,
      cleanRecords: hasRunAudit ? summary.cleanRecords : null,
      correctableIssues: hasRunAudit
        ? auditedIssues.filter((issue) => issue.canResolveFromEvidence).length
        : null,
      manualIssues: hasRunAudit
        ? auditedIssues.filter((issue) => !issue.canResolveFromEvidence).length
        : null,
      duplicateIssues: hasRunAudit
        ? auditedIssues.filter(
            (issue) => issue.ruleId === 'duplicate-student-subject',
          ).length
        : null,
      nationalMismatches: hasRunAudit
        ? auditedIssues.filter((issue) => issue.ruleId === 'national-mismatch')
            .length
        : null,
      hueMismatches: hasRunAudit
        ? auditedIssues.filter((issue) => issue.ruleId === 'hue-mismatch').length
        : null,
      correctionsApplied: events.filter(
        (event) => event.before !== undefined && event.after !== undefined,
      ).length,
      auditEvents: events.length,
      issuedRecords: batchStatus === 'published' ? scopedRecords.length : 0,
    };
  }, [batchStatus, events, hasRunAudit, issues, scopedRecords, summary]);

  const addEvent = (
    action: AuditEvent['action'],
    reason: AuditEvent['reason'],
    extra: Partial<AuditEvent> = {},
  ) => {
    setEvents((current) => [
      {
        id: `EVT-${Date.now()}-${current.length}`,
        at: new Date().toISOString(),
        actor: {
          vi: 'Cán bộ khảo thí · mô phỏng',
          en: 'Examination officer · simulation',
        },
        action,
        reason,
        ...extra,
      },
      ...current,
    ]);
  };

  const loadPreset = (nextPreset: BatchPreset) => {
    setPreset(nextPreset);
    setRecords(createSyntheticDataset(nextPreset));
    setHasRunAudit(false);
    setBatchStatus('draft');
    setSelectedIssueId(null);
    setEvents([]);
  };

  const runBatchAudit = () => {
    if (!isEditable) return;
    setHasRunAudit(true);
    setBatchStatus('reviewed');
    setSelectedIssueId(issues[0]?.id ?? null);
    addEvent(
      {vi: 'Chạy kiểm tra dữ liệu', en: 'Run data audit'},
      {
        vi: `Kiểm tra ${summary.totalRecords} bản ghi; phát hiện ${summary.critical} lỗi chặn và ${summary.warnings} cảnh báo.`,
        en: `Checked ${summary.totalRecords} records; found ${summary.critical} blocking issues and ${summary.warnings} warnings.`,
      },
    );
  };

  const fixSelected = () => {
    if (!isEditable || !selectedIssue?.canResolveFromEvidence || !selectedRecord) return;
    const before = valueSnapshot(selectedRecord);
    const fixed = resolveFromEvidence(selectedRecord, selectedIssue.ruleId);
    const after = valueSnapshot(fixed);
    setRecords((current) =>
      current.map((record) => (record.id === fixed.id ? fixed : record)),
    );
    addEvent(
      {vi: 'Sửa từ chứng từ gốc', en: 'Correct from source evidence'},
      {
        vi: `Xử lý quy tắc ${selectedIssue.ruleId}; không suy đoán hoặc tự sinh điểm.`,
        en: `Resolved rule ${selectedIssue.ruleId}; no score was inferred or invented.`,
      },
      {recordId: selectedRecord.id, before, after},
    );
    setSelectedIssueId(null);
  };

  const lockBatch = () => {
    if (!hasRunAudit || batchStatus !== 'reviewed') return;
    if (summary.critical > 0) {
      addEvent(
        {vi: 'Từ chối khóa lô', en: 'Block batch lock'},
        {
          vi: `Còn ${summary.critical} lỗi nghiêm trọng; lô chưa đủ điều kiện khóa.`,
          en: `${summary.critical} blocking issues remain; the batch cannot be locked.`,
        },
      );
      return;
    }
    setBatchStatus('locked');
    addEvent(
      {vi: 'Khóa lô dữ liệu', en: 'Lock data batch'},
      {
        vi: 'Không còn lỗi chặn; dữ liệu chuyển sang chỉ đọc trước khi ký.',
        en: 'No blocking issue remains; data is read-only before signing.',
      },
    );
  };

  const publishBatch = () => {
    if (batchStatus !== 'locked') return;
    setBatchStatus('published');
    addEvent(
      {vi: 'Ký số và phát hành', en: 'Digitally sign and issue'},
      {
        vi: 'Mô phỏng ký cá nhân, ký cơ sở giáo dục, phát hành và xếp hàng đồng bộ.',
        en: 'Simulated personal signature, institutional signature, issuance and sync queue.',
      },
    );
  };

  const requestWithdrawal = () => {
    if (batchStatus !== 'published') return;
    setBatchStatus('withdrawn');
    addEvent(
      {vi: 'Yêu cầu thu hồi bản phát hành', en: 'Request issued-record withdrawal'},
      {
        vi: 'Bản đã phát hành không được sửa trực tiếp; phải thu hồi và tạo lập lại.',
        en: 'An issued record cannot be edited directly; it must be withdrawn and recreated.',
      },
    );
  };

  const recreateDraft = () => {
    if (batchStatus !== 'withdrawn') return;
    setBatchStatus('reviewed');
    setHasRunAudit(true);
    addEvent(
      {vi: 'Tạo lại bản để kiểm tra', en: 'Recreate record for review'},
      {
        vi: 'Tạo phiên bản mới từ dữ liệu nguồn; giữ nguyên lịch sử bản đã phát hành.',
        en: 'Created a new version from source data while retaining the issued-record history.',
      },
    );
  };

  return (
    <div className="space-y-6">
      <section className="glass-panel-strong overflow-hidden rounded-xl border border-line">
        <div className="border-b border-line p-5 md:p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2 font-mono text-xs text-accent">
                <ShieldCheck size={16} aria-hidden="true" />
                <span>{t('synthetic')}</span>
                <span aria-hidden="true">·</span>
                <span>{t('noNetwork')}</span>
              </div>
              <h3 className="mt-3 text-2xl font-bold text-ink">{t('title')}</h3>
              <p className="mt-2 text-sm leading-relaxed">{t('subtitle')}</p>
            </div>

            <span className="inline-flex w-fit rounded border border-line px-2.5 py-1.5 font-mono text-xs text-ink">
              {t('batchStatus')}: {STATUS_LABEL[batchStatus][locale]}
            </span>
          </div>
        </div>

        <div className="grid gap-4 p-5 md:grid-cols-2 md:p-6">
          <label className="space-y-1.5">
            <span className="block font-mono text-xs text-muted">{t('level')}</span>
            <select
              value={level}
              disabled={!isEditable}
              onChange={(event) => {
                setLevel(event.target.value as ScopeFilter);
                setHasRunAudit(false);
                setBatchStatus('draft');
                setSelectedIssueId(null);
              }}
              className="w-full rounded-md border border-line bg-surface px-3 py-2 text-sm text-ink disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="school">{t('schoolLevels')}</option>
              {(Object.keys(LEVEL_LABEL) as EducationLevel[]).map((item) => (
                <option key={item} value={item}>
                  {LEVEL_LABEL[item][locale]}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-1.5">
            <span className="block font-mono text-xs text-muted">{t('batch')}</span>
            <select
              value={preset}
              onChange={(event) => loadPreset(event.target.value as BatchPreset)}
              className="w-full rounded-md border border-line bg-surface px-3 py-2 text-sm text-ink"
            >
              <option value="incidents">{t('incidents')}</option>
              <option value="verified">{t('verified')}</option>
            </select>
          </label>
        </div>

      </section>

      <WorkflowExplorer
        hasRunAudit={hasRunAudit}
        criticalCount={summary.critical}
        batchStatus={batchStatus}
        metrics={workflowMetrics}
        onRunAudit={runBatchAudit}
        onLockBatch={lockBatch}
        onPublishBatch={publishBatch}
      />

      <section id="assessment-findings" className="scroll-mt-6 glass-panel-strong rounded-xl border border-line p-5 md:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h4 className="flex items-center gap-2 font-mono text-sm text-ink">
              <FileCheck2 size={17} className="text-accent" aria-hidden="true" />
              {t('auditResults')}
            </h4>
            <p className="mt-1.5 max-w-2xl text-sm leading-relaxed">{t('auditHint')}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={runBatchAudit}
              disabled={!isEditable}
              className="inline-flex items-center gap-2 rounded-md bg-accent px-3.5 py-2 font-mono text-xs font-semibold text-accent-ink transition-[filter] hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ShieldCheck size={15} aria-hidden="true" />
              {hasRunAudit ? t('rerunAudit') : t('runAudit')}
            </button>
            <button
              type="button"
              onClick={lockBatch}
              disabled={!hasRunAudit || batchStatus !== 'reviewed'}
              className="inline-flex items-center gap-2 rounded-md border border-line px-3.5 py-2 font-mono text-xs text-ink hover:border-accent disabled:cursor-not-allowed disabled:opacity-40"
            >
              <LockKeyhole size={15} aria-hidden="true" />
              {t('lock')}
            </button>
            <button
              type="button"
              onClick={publishBatch}
              disabled={batchStatus !== 'locked'}
              className="inline-flex items-center gap-2 rounded-md border border-line px-3.5 py-2 font-mono text-xs text-ink hover:border-accent disabled:cursor-not-allowed disabled:opacity-40"
            >
              <GraduationCap size={15} aria-hidden="true" />
              {t('publish')}
            </button>
          </div>
        </div>

        {hasRunAudit && (
          <div className="mt-5 grid gap-3 border-t border-line pt-5 sm:grid-cols-[1fr_auto]">
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={t('search')}
              className="rounded-md border border-line bg-surface px-3 py-2 text-sm text-ink placeholder:text-muted"
            />
            <select
              value={severity}
              onChange={(event) =>
                setSeverity(event.target.value as typeof severity)
              }
              aria-label={t('allSeverity')}
              className="rounded-md border border-line bg-surface px-3 py-2 text-sm text-ink"
            >
              <option value="all">{t('allSeverity')}</option>
              <option value="critical">{t('critical')}</option>
              <option value="warning">{t('warnings')}</option>
            </select>
          </div>
        )}

        {hasRunAudit && shownIssues.length === 0 ? (
          <div className="mt-5 flex items-center gap-3 rounded-lg border border-accent/30 bg-accent/5 p-4 text-sm text-ink">
            <CheckCircle2 size={18} className="shrink-0 text-accent" aria-hidden="true" />
            {t('noIssues')}
          </div>
        ) : hasRunAudit ? (
          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[52rem] text-sm">
              <thead>
                <tr className="border-b border-line text-left font-mono text-xs text-muted">
                  <th scope="col" className="px-2 py-2 font-normal">{t('learner')}</th>
                  <th scope="col" className="px-2 py-2 font-normal">{t('subject')}</th>
                  <th scope="col" className="px-2 py-2 font-normal">{t('finding')}</th>
                  <th scope="col" className="px-2 py-2 font-normal">{t('actual')}</th>
                  <th scope="col" className="px-2 py-2 font-normal">{t('expected')}</th>
                  <th scope="col" className="px-2 py-2 font-normal"><span className="sr-only">{t('view')}</span></th>
                </tr>
              </thead>
              <tbody>
                {shownIssues.map((item) => {
                  const record = records.find((candidate) => candidate.id === item.recordId)!;
                  return (
                    <tr key={item.id} className="border-b border-line/70 align-top">
                      <th scope="row" className="px-2 py-3 text-left font-normal">
                        <span className="block font-mono text-xs text-ink">{item.studentCode}</span>
                        <span className="mt-0.5 block text-xs text-muted">{record.classCode}</span>
                      </th>
                      <td className="px-2 py-3 text-xs">{record.subject[locale]}</td>
                      <td className="px-2 py-3">
                        <span
                          className={classNames(
                            'mr-2 inline-block rounded border px-1.5 py-0.5 font-mono text-[10px]',
                            item.severity === 'critical'
                              ? 'border-red-400/40 text-red-300'
                              : 'border-amber-400/40 text-amber-300',
                          )}
                        >
                          {item.severity === 'critical' ? t('critical') : t('warnings')}
                        </span>
                        <span className="text-xs text-ink">{item.title[locale]}</span>
                      </td>
                      <td className="px-2 py-3 font-mono text-xs text-red-300">{item.actual ?? '—'}</td>
                      <td className="px-2 py-3 font-mono text-xs text-accent">{item.expected ?? '—'}</td>
                      <td className="px-2 py-3 text-right">
                        <button
                          type="button"
                          onClick={() => setSelectedIssueId(item.id)}
                          className="rounded border border-line px-2.5 py-1 font-mono text-xs text-accent hover:border-accent"
                        >
                          {t('view')}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {issues.length > shownIssues.length && (
              <p className="mt-3 font-mono text-xs text-muted">
                {locale === 'vi'
                  ? `Hiển thị tối đa 30 phát hiện; tổng cộng ${issues.length}.`
                  : `Showing up to 30 findings; ${issues.length} in total.`}
              </p>
            )}
          </div>
        ) : null}
      </section>

      {selectedIssue && selectedRecord && (
        <section className="glass-panel-strong rounded-xl border border-accent/40 p-5 md:p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="font-mono text-xs text-accent">{t('issueDetail')}</p>
              <h4 className="mt-2 text-lg font-semibold text-ink">{selectedIssue.title[locale]}</h4>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed">{selectedIssue.detail[locale]}</p>
              <p className="mt-3 font-mono text-xs text-muted">
                {selectedRecord.studentCode} · {selectedRecord.classCode} · {selectedRecord.subject[locale]} · {selectedIssue.ruleId}
              </p>
            </div>
            {selectedIssue.canResolveFromEvidence ? (
              <button
                type="button"
                onClick={fixSelected}
                disabled={!isEditable}
                className="inline-flex shrink-0 items-center gap-2 rounded-md bg-accent px-3.5 py-2 font-mono text-xs font-semibold text-accent-ink hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <FileCheck2 size={15} aria-hidden="true" />
                {t('fixFromEvidence')}
              </button>
            ) : (
              <p className="max-w-xs rounded-md border border-amber-400/30 bg-amber-400/5 p-3 text-xs leading-relaxed text-amber-200">
                {t('manualOnly')}
              </p>
            )}
          </div>
        </section>
      )}

      <div id="assessment-report" className="scroll-mt-6 grid gap-6 xl:grid-cols-2">
        <section className="glass-panel-strong rounded-xl border border-line p-5 md:p-6">
          <h4 className="font-mono text-sm text-ink">{t('distribution')}</h4>
          <div className="mt-5 space-y-4">
            {chartData.map((item) => (
              <div key={item.key} className="grid grid-cols-[4.5rem_1fr] items-center gap-3">
                <span className="font-mono text-xs text-muted">{item.label}</span>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="w-20 shrink-0 text-[11px] text-muted">{t('school')}</span>
                    <span
                      className="h-2.5 min-w-px rounded-sm bg-accent"
                      style={{width: `${(item.school / chartMax) * 100}%`}}
                    />
                    <span className="font-mono text-[11px] text-ink">{item.school}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-20 shrink-0 text-[11px] text-muted">{t('national')}</span>
                    <span
                      className="h-2.5 min-w-px rounded-sm bg-sky-400"
                      style={{width: `${(item.national / chartMax) * 100}%`}}
                    />
                    <span className="font-mono text-[11px] text-ink">{item.national}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-5 text-xs leading-relaxed text-muted">
            {level === 'primary'
              ? locale === 'vi'
                ? 'Tiểu học hiển thị mức T/H/C; không quy đổi sang trung bình chung.'
                : 'Primary displays T/H/C levels and does not convert them into an overall average.'
              : locale === 'vi'
                ? 'Phổ điểm chỉ dùng để phát hiện chênh lệch hoặc bất thường; không tự kết luận gian lận.'
                : 'The distribution highlights differences or anomalies; it does not automatically conclude misconduct.'}
          </p>
        </section>

        <section className="glass-panel-strong rounded-xl border border-line p-5 md:p-6">
          <h4 className="font-mono text-sm text-ink">{t('reconciliation')}</h4>
          <p className="mt-2 text-xs leading-relaxed text-muted">{t('sourceOrder')}</p>
          <div className="mt-5 space-y-3">
            {[
              {label: t('school'), value: selectedRecord?.schoolResult, icon: Database},
              {label: t('national'), value: selectedRecord?.nationalResult, icon: ShieldCheck},
              {label: t('hue'), value: selectedRecord?.hueResult, icon: RefreshCw},
            ].map(({label, value, icon: Icon}, index) => (
              <div key={label} className="flex items-center justify-between gap-4 rounded-lg border border-line bg-surface/50 p-3">
                <span className="flex items-center gap-2 text-xs text-ink">
                  <Icon size={15} className="text-accent" aria-hidden="true" />
                  {index + 1}. {label}
                </span>
                <span className="font-mono text-sm text-ink">{selectedRecord ? formatResult(value ?? null) : '—'}</span>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="glass-panel-strong rounded-xl border border-line p-5 md:p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <h4 className="flex items-center gap-2 font-mono text-sm text-ink">
            <History size={17} className="text-accent" aria-hidden="true" />
            {t('auditLog')}
          </h4>
          <div className="flex flex-wrap gap-2">
            {batchStatus === 'published' && (
              <button
                type="button"
                onClick={requestWithdrawal}
                className="inline-flex items-center gap-2 rounded-md border border-amber-400/40 px-3 py-1.5 font-mono text-xs text-amber-200 hover:bg-amber-400/5"
              >
                <RotateCcw size={14} aria-hidden="true" />
                {t('withdraw')}
              </button>
            )}
            {batchStatus === 'withdrawn' && (
              <button
                type="button"
                onClick={recreateDraft}
                className="inline-flex items-center gap-2 rounded-md border border-line px-3 py-1.5 font-mono text-xs text-accent hover:border-accent"
              >
                <RotateCcw size={14} aria-hidden="true" />
                {t('recreate')}
              </button>
            )}
          </div>
        </div>

        {events.length === 0 ? (
          <p className="mt-4 text-sm leading-relaxed text-muted">{t('emptyLog')}</p>
        ) : (
          <ol className="mt-4 space-y-3">
            {events.slice(0, 12).map((event) => (
              <li key={event.id} className="rounded-lg border border-line bg-surface/40 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-mono text-xs text-accent">{event.action[locale]}</p>
                  <time className="font-mono text-[11px] text-muted" dateTime={event.at}>
                    {new Date(event.at).toLocaleString(locale === 'vi' ? 'vi-VN' : 'en-US')}
                  </time>
                </div>
                <p className="mt-1.5 text-xs leading-relaxed text-ink">{event.reason[locale]}</p>
                <p className="mt-1 font-mono text-[11px] text-muted">
                  {event.actor[locale]}{event.recordId ? ` · ${event.recordId}` : ''}
                </p>
                {event.before && event.after && (
                  <details className="mt-2">
                    <summary className="cursor-pointer font-mono text-[11px] text-muted hover:text-accent">
                      {locale === 'vi' ? 'Xem trước/sau' : 'View before/after'}
                    </summary>
                    <div className="mt-2 grid gap-2 text-[11px] md:grid-cols-2">
                      <p className="break-all rounded border border-line p-2"><span className="text-muted">Before:</span> {event.before}</p>
                      <p className="break-all rounded border border-line p-2"><span className="text-muted">After:</span> {event.after}</p>
                    </div>
                  </details>
                )}
              </li>
            ))}
          </ol>
        )}
      </section>

    </div>
  );
}
