import {useMemo, useState} from 'react';
import {
  Check,
  ChevronLeft,
  ChevronRight,
  CircleAlert,
  FileCheck2,
  LockKeyhole,
  ShieldCheck,
} from 'lucide-react';
import {useI18n} from '../../../../i18n';
import type {L} from '../../types/showcase';
import {LEVEL_LABEL} from './policy';
import type {BatchStatus, EducationLevel} from './types';

type ProcessingStage = {
  title: L;
  shortTitle: L;
  purpose: L;
  checks: L[];
  source: L;
  operation: L;
  output: L;
};

const STAGES: ProcessingStage[] = [
  {
    title: {vi: 'Tiếp nhận tập điểm', en: 'Receive score dataset'},
    shortTitle: {vi: 'Tiếp nhận', en: 'Receive'},
    purpose: {
      vi: 'Nhận file điểm từ các đơn vị, gắn mã lô và kiểm đếm tổng số học sinh, dòng kết quả và ô điểm trước khi xử lý.',
      en: 'Receive score files from units, assign a batch ID and count learners, result rows and score cells before processing.',
    },
    checks: [
      {vi: 'File có phiên bản, người gửi và thời điểm nhận', en: 'File version, sender and receipt time are retained'},
      {vi: 'Số lượng được đối chiếu với biên bản bàn giao', en: 'Counts match the handover record'},
      {vi: 'Dữ liệu gốc được giữ nguyên để truy vết', en: 'The raw source remains unchanged for traceability'},
    ],
    source: {vi: 'File điểm thô', en: 'Raw score files'},
    operation: {vi: 'Gắn mã lô và kiểm đếm', en: 'Assign batch ID and count'},
    output: {vi: 'Lô dữ liệu đã tiếp nhận', en: 'Received data batch'},
  },
  {
    title: {vi: 'Chuẩn hóa và kiểm kê', en: 'Normalize and inventory'},
    shortTitle: {vi: 'Chuẩn hóa', en: 'Normalize'},
    purpose: {
      vi: 'Chuẩn hóa mã học sinh, lớp, môn, kiểu dữ liệu và cấu trúc cột; so sánh số thực nhận với số dự kiến trước khi chạy quy tắc nghiệp vụ.',
      en: 'Normalize learner, class, subject, data type and column structure; compare received versus expected counts before business-rule validation.',
    },
    checks: [
      {vi: 'Mã học sinh–môn không trùng', en: 'Learner–subject keys are unique'},
      {vi: 'Ô điểm đúng kiểu số hoặc mức đánh giá', en: 'Score cells use the expected numeric or rating type'},
      {vi: 'Thiếu dữ liệu được đánh dấu, không tự điền', en: 'Missing data is flagged and never invented'},
    ],
    source: {vi: 'Lô điểm đã tiếp nhận', en: 'Received score batch'},
    operation: {vi: 'Ánh xạ schema và định danh', en: 'Map schema and identifiers'},
    output: {vi: 'Lô chuẩn hóa kèm chênh lệch số lượng', en: 'Normalized batch with count variances'},
  },
  {
    title: {vi: 'Kiểm tra toàn bộ dữ liệu', en: 'Validate the full dataset'},
    shortTitle: {vi: 'Kiểm tra', en: 'Validate'},
    purpose: {
      vi: 'Chạy bộ quy tắc theo cấp học trên toàn lô để phát hiện điểm thiếu, sai thang điểm, sai số đầu điểm, sai công thức, sai điều kiện và bản ghi trùng.',
      en: 'Run level-specific rules across the batch to detect missing values, invalid scales, wrong entry counts, formula errors, eligibility issues and duplicates.',
    },
    checks: [
      {vi: 'Critical chặn khóa và công bố', en: 'Critical findings block locking and issuance'},
      {vi: 'Warning yêu cầu rà soát nhưng không tự sửa', en: 'Warnings require review but are never auto-corrected'},
      {vi: 'Kết quả kiểm tra được ghi vào nhật ký', en: 'Validation results are written to the audit log'},
    ],
    source: {vi: 'Lô đã chuẩn hóa', en: 'Normalized batch'},
    operation: {vi: 'Rule engine kiểm tra toàn lô', en: 'Rule engine validates the full batch'},
    output: {vi: 'Danh sách lỗi theo mức độ và học sinh', en: 'Findings grouped by severity and learner'},
  },
  {
    title: {vi: 'Xử lý hàng đợi ngoại lệ', en: 'Resolve the exception queue'},
    shortTitle: {vi: 'Ngoại lệ', en: 'Exceptions'},
    purpose: {
      vi: 'Chỉ chuyển các học sinh có vấn đề cho cán bộ xử lý. Lỗi có chứng từ được sửa có lưu vết; lỗi cần thẩm quyền vẫn giữ trạng thái chặn.',
      en: 'Route only affected learners for review. Evidence-backed issues are corrected with an audit trail; authority-dependent cases remain blocked.',
    },
    checks: [
      {vi: 'Đối chiếu chứng từ trước khi sửa', en: 'Verify source evidence before correction'},
      {vi: 'Lưu giá trị trước/sau và lý do', en: 'Retain before/after values and reason'},
      {vi: 'Chạy lại kiểm tra sau mỗi nhóm sửa', en: 'Rerun validation after each correction group'},
    ],
    source: {vi: 'Danh sách critical và warning', en: 'Critical and warning queue'},
    operation: {vi: 'Phân công, xác minh và sửa có kiểm soát', en: 'Assign, verify and correct under control'},
    output: {vi: 'Ngoại lệ đã xử lý hoặc còn bị chặn', en: 'Resolved or still-blocked exceptions'},
  },
  {
    title: {vi: 'Đối soát và lập báo cáo', en: 'Reconcile and report'},
    shortTitle: {vi: 'Đối soát', en: 'Reconcile'},
    purpose: {
      vi: 'Đối chiếu nguồn trường với CSDL có thẩm quyền và Hue-S phụ trợ; kiểm tra phổ điểm, tỷ lệ dữ liệu sạch và sai lệch còn lại trước khi trình duyệt.',
      en: 'Reconcile the school source with the authoritative database and auxiliary Hue-S; review distributions, clean-record rate and remaining mismatches.',
    },
    checks: [
      {vi: 'Nguồn trường và CSDL chính phải thống nhất', en: 'School and authoritative records must agree'},
      {vi: 'Hue-S chỉ là lớp đồng bộ phụ trợ', en: 'Hue-S remains an auxiliary synchronization layer'},
      {vi: 'Bất thường phổ điểm chỉ là tín hiệu rà soát', en: 'Distribution anomalies are review signals only'},
    ],
    source: {vi: 'Dữ liệu sau xử lý ngoại lệ', en: 'Post-resolution data'},
    operation: {vi: 'Đối soát hệ thống và tạo báo cáo', en: 'Reconcile systems and generate report'},
    output: {vi: 'Báo cáo trình khóa hoặc yêu cầu xử lý tiếp', en: 'Lock recommendation or further-action report'},
  },
  {
    title: {vi: 'Khóa và công bố', en: 'Lock and issue'},
    shortTitle: {vi: 'Công bố', en: 'Issue'},
    purpose: {
      vi: 'Chỉ khóa khi critical bằng 0. Sau khóa, lô chuyển sang chỉ đọc; ký/phát hành mở tra cứu và đồng bộ Hue-S phụ trợ.',
      en: 'Lock only when critical equals zero. The batch becomes read-only; signing and issuance enable viewing and auxiliary Hue-S synchronization.',
    },
    checks: [
      {vi: 'Critical bằng 0', en: 'Critical count is zero'},
      {vi: 'Trạng thái và người thao tác được lưu vết', en: 'Status and actor are logged'},
      {vi: 'Muốn sửa bản đã công bố phải thu hồi', en: 'Issued data requires withdrawal before correction'},
    ],
    source: {vi: 'Lô đã đối soát', en: 'Reconciled batch'},
    operation: {vi: 'Khóa, ký, phát hành và lưu vết', en: 'Lock, sign, issue and log'},
    output: {vi: 'Kết quả chính thức đủ điều kiện tra cứu', en: 'Official results eligible for viewing'},
  },
];

type Props = {
  hasRunAudit: boolean;
  criticalCount: number;
  batchStatus: BatchStatus;
  metrics: WorkflowMetrics;
  onRunAudit: () => void;
  onLockBatch: () => void;
  onPublishBatch: () => void;
};

export type WorkflowMetrics = {
  expectedLearnerCount: number;
  learnerCount: number;
  totalRecords: number;
  expectedScoreValues: number;
  receivedScoreValues: number;
  educationLevels: number;
  primaryRecords: number;
  lowerSecondaryRecords: number;
  upperSecondaryRecords: number;
  vocationalRecords: number;
  levelBreakdown: Array<{
    level: EducationLevel;
    learnerCount: number;
    totalRecords: number;
    expectedScoreValues: number;
    receivedScoreValues: number;
    auditedRecords: number;
    affectedRecords: number | null;
    affectedLearners: number | null;
    critical: number | null;
    warnings: number | null;
    cleanRecords: number | null;
    issuedRecords: number;
  }>;
  critical: number | null;
  warnings: number | null;
  affectedRecords: number | null;
  affectedLearners: number | null;
  cleanRecords: number | null;
  correctableIssues: number | null;
  manualIssues: number | null;
  duplicateIssues: number | null;
  nationalMismatches: number | null;
  hueMismatches: number | null;
  correctionsApplied: number;
  auditEvents: number;
  issuedRecords: number;
};

type MetricItem = {label: L; value: string; tone?: 'danger' | 'warning' | 'success'};

const focusRing =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface';

export default function WorkflowExplorer({
  hasRunAudit,
  criticalCount,
  batchStatus,
  metrics,
  onRunAudit,
  onLockBatch,
  onPublishBatch,
}: Props) {
  const {locale} = useI18n();
  const [activeStage, setActiveStage] = useState(0);
  const stage = STAGES[activeStage];
  const numberLocale = locale === 'vi' ? 'vi-VN' : 'en-US';
  const formatNumber = (value: number | null) =>
    value === null ? '—' : value.toLocaleString(numberLocale);
  const missingIds = Math.max(0, metrics.expectedLearnerCount - metrics.learnerCount);
  const missingScores = Math.max(
    0,
    metrics.expectedScoreValues - metrics.receivedScoreValues,
  );

  const completed = useMemo(
    () => [
      true,
      missingIds === 0 && missingScores === 0,
      hasRunAudit,
      hasRunAudit && criticalCount === 0,
      hasRunAudit,
      batchStatus === 'published',
    ],
    [batchStatus, criticalCount, hasRunAudit, missingIds, missingScores],
  );
  const progress = Math.round(
    (completed.filter(Boolean).length / completed.length) * 100,
  );

  const metricsByStage = useMemo<MetricItem[][]>(() => {
    const cleanRate =
      metrics.cleanRecords === null || metrics.totalRecords === 0
        ? '—'
        : `${Math.round((metrics.cleanRecords / metrics.totalRecords) * 100)}%`;
    return [
      [
        {
          label: {vi: 'Mã học sinh nhận / dự kiến', en: 'Learner IDs received / expected'},
          value: `${formatNumber(metrics.learnerCount)} / ${formatNumber(metrics.expectedLearnerCount)}`,
          tone: missingIds > 0 ? 'warning' : 'success',
        },
        {
          label: {vi: 'Ô điểm nhận / dự kiến', en: 'Score cells received / expected'},
          value: `${formatNumber(metrics.receivedScoreValues)} / ${formatNumber(metrics.expectedScoreValues)}`,
          tone: missingScores > 0 ? 'warning' : 'success',
        },
        {
          label: {vi: 'Dòng kết quả', en: 'Result rows'},
          value: formatNumber(metrics.totalRecords),
        },
      ],
      [
        {
          label: {vi: 'Thiếu mã học sinh', en: 'Missing learner IDs'},
          value: formatNumber(missingIds),
          tone: missingIds > 0 ? 'warning' : 'success',
        },
        {
          label: {vi: 'Ô điểm còn thiếu', en: 'Missing score cells'},
          value: formatNumber(missingScores),
          tone: missingScores > 0 ? 'warning' : 'success',
        },
        {
          label: {vi: 'Nhóm cấp học', en: 'Education groups'},
          value: formatNumber(metrics.educationLevels),
        },
      ],
      [
        {
          label: {vi: 'Lỗi chặn phát hành', en: 'Blocking issues'},
          value: formatNumber(metrics.critical),
          tone: (metrics.critical ?? 0) > 0 ? 'danger' : 'success',
        },
        {
          label: {vi: 'Cảnh báo', en: 'Warnings'},
          value: formatNumber(metrics.warnings),
          tone: (metrics.warnings ?? 0) > 0 ? 'warning' : undefined,
        },
        {
          label: {vi: 'Học sinh cần xử lý', en: 'Affected learners'},
          value: formatNumber(metrics.affectedLearners),
        },
      ],
      [
        {
          label: {vi: 'Có chứng từ để sửa', en: 'Evidence-correctable'},
          value: formatNumber(metrics.correctableIssues),
        },
        {
          label: {vi: 'Cần xử lý thủ công', en: 'Manual resolution'},
          value: formatNumber(metrics.manualIssues),
          tone: (metrics.manualIssues ?? 0) > 0 ? 'warning' : undefined,
        },
        {
          label: {vi: 'Đã áp dụng chỉnh sửa', en: 'Corrections applied'},
          value: formatNumber(metrics.correctionsApplied),
          tone: metrics.correctionsApplied > 0 ? 'success' : undefined,
        },
      ],
      [
        {
          label: {vi: 'Tỷ lệ dòng sạch', en: 'Clean-row rate'},
          value: cleanRate,
          tone: metrics.critical === 0 ? 'success' : undefined,
        },
        {
          label: {vi: 'Lệch CSDL chính', en: 'Authoritative mismatches'},
          value: formatNumber(metrics.nationalMismatches),
          tone: (metrics.nationalMismatches ?? 0) > 0 ? 'warning' : undefined,
        },
        {
          label: {vi: 'Lệch Hue-S phụ trợ', en: 'Hue-S mismatches'},
          value: formatNumber(metrics.hueMismatches),
          tone: (metrics.hueMismatches ?? 0) > 0 ? 'warning' : undefined,
        },
      ],
      [
        {
          label: {vi: 'Critical còn lại', en: 'Critical remaining'},
          value: formatNumber(metrics.critical),
          tone: (metrics.critical ?? 0) > 0 ? 'danger' : 'success',
        },
        {
          label: {vi: 'Sự kiện lưu vết', en: 'Logged events'},
          value: formatNumber(metrics.auditEvents),
        },
        {
          label: {vi: 'Hồ sơ đã công bố', en: 'Issued records'},
          value: formatNumber(metrics.issuedRecords),
          tone: metrics.issuedRecords > 0 ? 'success' : undefined,
        },
      ],
    ];
  }, [locale, metrics, missingIds, missingScores]);

  const stageMetrics = metricsByStage[activeStage];
  const outcome = !hasRunAudit
    ? locale === 'vi'
      ? `Đầu vào có ${formatNumber(metrics.expectedLearnerCount)} học sinh và ${formatNumber(metrics.expectedScoreValues)} ô điểm dự kiến; hiện còn thiếu ${formatNumber(missingIds)} mã và ${formatNumber(missingScores)} ô điểm.`
      : `Input expects ${formatNumber(metrics.expectedLearnerCount)} learners and ${formatNumber(metrics.expectedScoreValues)} score cells; ${formatNumber(missingIds)} IDs and ${formatNumber(missingScores)} cells are missing.`
    : criticalCount > 0
      ? locale === 'vi'
        ? `Đã kiểm tra toàn lô: ${formatNumber(criticalCount)} lỗi đang chặn công bố. Chỉ ${formatNumber(metrics.affectedLearners)} học sinh cần đưa vào hàng đợi xử lý.`
        : `Full-batch validation found ${formatNumber(criticalCount)} blocking issues. Only ${formatNumber(metrics.affectedLearners)} learners require queue-based review.`
      : batchStatus === 'published'
        ? locale === 'vi'
          ? `${formatNumber(metrics.issuedRecords)} hồ sơ đã được công bố và lưu vết.`
          : `${formatNumber(metrics.issuedRecords)} records have been issued with an audit trail.`
        : locale === 'vi'
          ? 'Không còn lỗi chặn. Lô đủ điều kiện khóa và công bố.'
          : 'No blocking findings remain. The batch is ready to lock and issue.';

  const levelStatus = (row: WorkflowMetrics['levelBreakdown'][number]) => {
    if (!hasRunAudit) {
      return {
        label: locale === 'vi' ? 'Chờ kiểm tra' : 'Awaiting audit',
        className: 'border-line bg-surface text-muted',
      };
    }
    if ((row.critical ?? 0) > 0) {
      return {
        label: locale === 'vi' ? 'Đang bị chặn' : 'Blocked',
        className: 'border-red-400/40 bg-red-400/10 text-red-200',
      };
    }
    if (batchStatus === 'published') {
      return {
        label: locale === 'vi' ? 'Đã công bố' : 'Issued',
        className: 'border-accent/40 bg-accent/10 text-accent',
      };
    }
    return {
      label: locale === 'vi' ? 'Đủ điều kiện' : 'Eligible',
      className: 'border-accent/40 bg-accent/10 text-accent',
    };
  };

  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({behavior: 'smooth', block: 'start'});

  const primaryAction = () => {
    if (activeStage === 0) setActiveStage(1);
    else if (activeStage === 1 && !hasRunAudit) {
      onRunAudit();
      setActiveStage(2);
    } else if (activeStage === 1) setActiveStage(2);
    else if (activeStage === 2 && !hasRunAudit) onRunAudit();
    else if (activeStage === 2 && criticalCount > 0) {
      setActiveStage(3);
      scrollTo('assessment-findings');
    } else if (activeStage === 2) setActiveStage(4);
    else if (activeStage === 3 && criticalCount > 0) scrollTo('assessment-findings');
    else if (activeStage === 3) setActiveStage(4);
    else if (activeStage === 4) scrollTo('assessment-report');
    else if (activeStage === 5 && criticalCount > 0) scrollTo('assessment-findings');
    else if (activeStage === 5 && batchStatus === 'draft') setActiveStage(2);
    else if (activeStage === 5 && batchStatus === 'reviewed') onLockBatch();
    else if (activeStage === 5 && batchStatus === 'locked') onPublishBatch();
  };

  const primaryLabel =
    activeStage === 0
      ? locale === 'vi' ? 'Kiểm tra dữ liệu tiếp nhận' : 'Check received data'
      : activeStage === 1 && !hasRunAudit
        ? locale === 'vi' ? 'Chạy kiểm tra toàn lô' : 'Validate the full batch'
        : activeStage === 1
          ? locale === 'vi' ? 'Xem kết quả kiểm tra' : 'View validation results'
          : activeStage === 2 && !hasRunAudit
            ? locale === 'vi' ? 'Chạy kiểm tra toàn lô' : 'Validate the full batch'
            : activeStage === 2 && criticalCount > 0
              ? locale === 'vi' ? 'Mở hàng đợi ngoại lệ' : 'Open exception queue'
              : activeStage === 2
                ? locale === 'vi' ? 'Chuyển sang đối soát' : 'Continue to reconciliation'
                : activeStage === 3 && criticalCount > 0
                  ? locale === 'vi' ? 'Mở danh sách cần xử lý' : 'Open cases to resolve'
                  : activeStage === 3
                    ? locale === 'vi' ? 'Lập báo cáo đối soát' : 'Build reconciliation report'
                    : activeStage === 4
                      ? locale === 'vi' ? 'Mở báo cáo chi tiết' : 'Open detailed report'
                      : activeStage === 5 && criticalCount > 0
                        ? locale === 'vi' ? 'Xử lý lỗi trước khi khóa' : 'Resolve findings before locking'
                        : activeStage === 5 && batchStatus === 'draft'
                          ? locale === 'vi' ? 'Quay lại kiểm tra' : 'Return to validation'
                          : activeStage === 5 && batchStatus === 'reviewed'
                            ? locale === 'vi' ? 'Khóa lô' : 'Lock batch'
                            : activeStage === 5 && batchStatus === 'locked'
                              ? locale === 'vi' ? 'Ký và công bố' : 'Sign and issue'
                              : null;

  return (
    <section className="overflow-hidden rounded-xl border border-line bg-surface/40">
      <header className="border-b border-line bg-surface/70 px-4 py-5 md:px-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent">
              {locale === 'vi' ? 'Bài toán xử lý dữ liệu điểm' : 'Score-data processing problem'}
            </p>
            <h3 className="mt-2 text-lg font-semibold text-ink md:text-xl">
              {locale === 'vi' ? 'Pipeline vận hành một lô điểm lớn' : 'Large score-batch operating pipeline'}
            </h3>
            <p className="mt-1 max-w-3xl text-xs leading-relaxed text-muted">
              {locale === 'vi'
                ? 'Kiểm tra toàn bộ dữ liệu bằng quy tắc; cán bộ chỉ tập trung vào ngoại lệ cần xác minh.'
                : 'Validate the full dataset with rules; the officer focuses only on exceptions requiring verification.'}
            </p>
          </div>
          <div className="min-w-48">
            <div className="flex items-center justify-between font-mono text-[10px] text-muted">
              <span>{locale === 'vi' ? 'TIẾN ĐỘ XỬ LÝ' : 'PROCESSING PROGRESS'}</span>
              <span className="text-ink">{progress}%</span>
            </div>
            <div
              className="mt-2 h-1.5 overflow-hidden rounded-full bg-line"
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={progress}
              aria-label={locale === 'vi' ? 'Tiến độ xử lý lô' : 'Batch processing progress'}
            >
              <div className="h-full rounded-full bg-accent" style={{width: `${progress}%`}} />
            </div>
          </div>
        </div>

        <nav className="mt-5 overflow-x-auto pb-1" aria-label={locale === 'vi' ? 'Pipeline xử lý dữ liệu' : 'Data-processing pipeline'}>
          <ol className="grid min-w-[48rem] grid-cols-6 gap-1">
            {STAGES.map((item, index) => {
              const active = activeStage === index;
              return (
                <li key={item.title.vi} className="relative">
                  <button
                    type="button"
                    onClick={() => setActiveStage(index)}
                    aria-current={active ? 'step' : undefined}
                    className={`min-h-20 w-full rounded-md border px-3 py-2.5 text-left transition-colors ${focusRing} ${
                      active
                        ? 'border-accent bg-accent/10'
                        : 'border-line bg-surface/30 hover:border-accent/50'
                    }`}
                  >
                    <span className="flex items-center justify-between gap-2">
                      <span className="font-mono text-[10px] text-muted">0{index + 1}</span>
                      <span className={`flex h-5 w-5 items-center justify-center rounded-full border ${
                        completed[index]
                          ? 'border-accent bg-accent text-accent-ink'
                          : 'border-line text-muted'
                      }`} aria-hidden="true">
                        {completed[index] ? <Check size={11} /> : <span className="h-1.5 w-1.5 rounded-full bg-current" />}
                      </span>
                    </span>
                    <span className="mt-2 block text-xs font-medium leading-snug text-ink">{item.shortTitle[locale]}</span>
                  </button>
                  {index < STAGES.length - 1 ? (
                    <ChevronRight size={12} className="absolute -right-2 top-1/2 z-10 -translate-y-1/2 text-accent" aria-hidden="true" />
                  ) : null}
                </li>
              );
            })}
          </ol>
        </nav>
      </header>

      <div className="p-4 md:p-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div className="max-w-3xl">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-accent">
              {locale === 'vi' ? 'Bước' : 'Step'} {activeStage + 1}/{STAGES.length}
            </p>
            <h4 className="mt-2 text-xl font-semibold text-ink">{stage.title[locale]}</h4>
            <p className="mt-3 text-sm leading-relaxed text-ink">{stage.purpose[locale]}</p>
          </div>
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-line px-3 py-1.5 font-mono text-[10px] text-muted">
            {completed[activeStage] ? <Check size={12} className="text-accent" /> : <CircleAlert size={12} className="text-amber-300" />}
            {completed[activeStage]
              ? locale === 'vi' ? 'ĐÃ ĐẠT' : 'PASSED'
              : locale === 'vi' ? 'CẦN XỬ LÝ' : 'ACTION NEEDED'}
          </span>
        </div>

        <div className={`mt-5 flex items-start gap-3 border-l-2 px-4 py-3 text-sm ${
          hasRunAudit && criticalCount > 0
            ? 'border-red-400 bg-red-400/5 text-red-100'
            : 'border-accent bg-accent/5 text-ink'
        }`} aria-live="polite">
          {hasRunAudit && criticalCount > 0 ? (
            <CircleAlert size={17} className="mt-0.5 shrink-0 text-red-300" aria-hidden="true" />
          ) : (
            <ShieldCheck size={17} className="mt-0.5 shrink-0 text-accent" aria-hidden="true" />
          )}
          <p className="leading-relaxed">{outcome}</p>
        </div>

        <dl className="mt-5 grid overflow-hidden rounded-lg border border-line bg-surface/40 sm:grid-cols-3 sm:divide-x sm:divide-line">
          {stageMetrics.map((metric) => (
            <div key={metric.label.vi} className="border-b border-line px-4 py-3 last:border-b-0 sm:border-b-0">
              <dt className="text-[11px] leading-snug text-muted">{metric.label[locale]}</dt>
              <dd className={`mt-1 font-mono text-xl font-semibold ${
                metric.tone === 'danger'
                  ? 'text-red-200'
                  : metric.tone === 'warning'
                    ? 'text-amber-200'
                    : metric.tone === 'success'
                      ? 'text-accent'
                      : 'text-ink'
              }`}>
                {metric.value}
              </dd>
            </div>
          ))}
        </dl>

        <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_1fr]">
          <section className="border-y border-line py-4" aria-labelledby="operation-path-title">
            <h5 id="operation-path-title" className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
              {locale === 'vi' ? 'Cách vận hành' : 'Operating path'}
            </h5>
            <div className="mt-3 flex items-stretch gap-2">
              {[
                {label: {vi: 'Đầu vào', en: 'Input'}, value: stage.source},
                {label: {vi: 'Xử lý', en: 'Operation'}, value: stage.operation},
                {label: {vi: 'Đầu ra', en: 'Output'}, value: stage.output},
              ].map((item, index) => (
                <div key={item.label.vi} className="relative min-w-0 flex-1 border-l border-line pl-3">
                  <p className="font-mono text-[10px] uppercase text-muted">{item.label[locale]}</p>
                  <p className="mt-1 text-xs leading-relaxed text-ink">{item.value[locale]}</p>
                  {index < 2 ? <ChevronRight size={13} className="absolute -right-2 top-1/2 -translate-y-1/2 text-accent" aria-hidden="true" /> : null}
                </div>
              ))}
            </div>
          </section>

          <section className="border-y border-line py-4" aria-labelledby="control-check-title">
            <h5 id="control-check-title" className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
              {locale === 'vi' ? 'Quy tắc kiểm soát' : 'Control rules'}
            </h5>
            <ul className="mt-3 space-y-2">
              {stage.checks.map((check) => (
                <li key={check.vi} className="flex items-start gap-2 text-xs leading-relaxed text-ink">
                  <Check size={14} className="mt-0.5 shrink-0 text-accent" aria-hidden="true" />
                  <span>{check[locale]}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>

        {activeStage >= 2 ? (
          <section className="mt-6 overflow-hidden rounded-lg border border-line" aria-labelledby="batch-board-title">
            <div className="border-b border-line bg-surface/50 px-4 py-3">
              <h5 id="batch-board-title" className="font-mono text-xs font-semibold text-ink">
                {locale === 'vi' ? 'ĐIỀU PHỐI XỬ LÝ THEO CẤP HỌC' : 'PROCESSING CONTROL BY LEVEL'}
              </h5>
              <p className="mt-1 text-[11px] text-muted">
                {locale === 'vi' ? 'Kiểm tra toàn lô; chỉ chuyển học sinh có ngoại lệ sang xử lý.' : 'Validate the full batch; route only affected learners for review.'}
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-[56rem] w-full text-left text-xs">
                <thead className="bg-surface/70 font-mono text-[10px] uppercase tracking-wide text-muted">
                  <tr>
                    <th scope="col" className="px-3 py-2.5 font-normal">{locale === 'vi' ? 'Cấp học' : 'Level'}</th>
                    <th scope="col" className="px-3 py-2.5 text-right font-normal">{locale === 'vi' ? 'HS nhận / dự kiến' : 'Learners received / expected'}</th>
                    <th scope="col" className="px-3 py-2.5 text-right font-normal">{locale === 'vi' ? 'Ô điểm nhận / dự kiến' : 'Score cells received / expected'}</th>
                    <th scope="col" className="px-3 py-2.5 text-right font-normal">{locale === 'vi' ? 'HS cần xử lý' : 'Affected learners'}</th>
                    <th scope="col" className="px-3 py-2.5 text-right font-normal">Critical</th>
                    <th scope="col" className="px-3 py-2.5 text-right font-normal">Warning</th>
                    <th scope="col" className="px-3 py-2.5 font-normal">{locale === 'vi' ? 'Trạng thái' : 'Status'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {metrics.levelBreakdown.map((row) => {
                    const status = levelStatus(row);
                    return (
                      <tr key={row.level} className="text-ink">
                        <th scope="row" className="px-3 py-3 font-medium">{LEVEL_LABEL[row.level][locale]}</th>
                        <td className="px-3 py-3 text-right font-mono">{formatNumber(row.learnerCount)} / {formatNumber(row.totalRecords)}</td>
                        <td className="px-3 py-3 text-right font-mono">{formatNumber(row.receivedScoreValues)} / {formatNumber(row.expectedScoreValues)}</td>
                        <td className="px-3 py-3 text-right font-mono">{formatNumber(row.affectedLearners)}</td>
                        <td className="px-3 py-3 text-right font-mono text-red-200">{formatNumber(row.critical)}</td>
                        <td className="px-3 py-3 text-right font-mono text-amber-200">{formatNumber(row.warnings)}</td>
                        <td className="px-3 py-3"><span className={`inline-flex rounded border px-2 py-1 font-mono text-[10px] ${status.className}`}>{status.label}</span></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        ) : null}

        <footer className="mt-6 flex flex-col gap-3 border-t border-line pt-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => setActiveStage((current) => Math.max(0, current - 1))} disabled={activeStage === 0} className={`inline-flex min-h-10 items-center gap-1.5 rounded-md border border-line px-3 py-2 text-xs text-muted hover:border-accent hover:text-ink disabled:cursor-not-allowed disabled:opacity-40 ${focusRing}`}>
              <ChevronLeft size={14} aria-hidden="true" />
              {locale === 'vi' ? 'Bước trước' : 'Previous'}
            </button>
            <button type="button" onClick={() => setActiveStage((current) => Math.min(STAGES.length - 1, current + 1))} disabled={activeStage === STAGES.length - 1} className={`inline-flex min-h-10 items-center gap-1.5 rounded-md border border-line px-3 py-2 text-xs text-ink hover:border-accent disabled:cursor-not-allowed disabled:opacity-40 ${focusRing}`}>
              {locale === 'vi' ? 'Bước tiếp' : 'Next'}
              <ChevronRight size={14} aria-hidden="true" />
            </button>
          </div>
          {primaryLabel ? (
            <button type="button" onClick={primaryAction} className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-accent px-4 py-2.5 font-mono text-xs font-semibold text-accent-ink hover:brightness-105 ${focusRing}`}>
              {activeStage === 5 ? <LockKeyhole size={14} aria-hidden="true" /> : activeStage >= 2 ? <ShieldCheck size={14} aria-hidden="true" /> : <FileCheck2 size={14} aria-hidden="true" />}
              {primaryLabel}
            </button>
          ) : null}
        </footer>
      </div>
    </section>
  );
}
