import assert from 'node:assert/strict';
import {describe, it} from 'node:test';
import {
  computeAnnualAverage,
  computeVocationalResult,
  createSyntheticDataset,
} from './syntheticData';
import {
  resolveFromEvidence,
  runAudit,
  summarizeAudit,
} from './auditEngine';

describe('assessment data integrity rules', () => {
  it('keeps the verified 2,000-school-learner batch and separate vocational scenario clean', () => {
    const records = createSyntheticDataset('verified');
    const issues = runAudit(records);
    const summary = summarizeAudit(records, issues);
    assert.equal(records.length, 2200);
    assert.deepEqual(
      Object.fromEntries(
        ['primary', 'lower-secondary', 'upper-secondary', 'vocational'].map(
          (level) => [
            level,
            records.filter((record) => record.level === level).length,
          ],
        ),
      ),
      {
        primary: 800,
        'lower-secondary': 700,
        'upper-secondary': 500,
        vocational: 200,
      },
    );
    assert.equal(summary.critical, 0);
    assert.equal(summary.warnings, 0);
  });

  it('detects seeded incidents without using hidden issue flags', () => {
    const records = createSyntheticDataset('incidents');
    const issues = runAudit(records);
    const rules = new Set(issues.map((item) => item.ruleId));
    assert.ok(rules.has('primary-integer'));
    assert.ok(rules.has('periodic-required'));
    assert.ok(rules.has('average-formula'));
    assert.ok(rules.has('vocational-formula'));
    assert.ok(rules.has('vocational-exam-eligibility'));
    assert.ok(rules.has('national-mismatch'));
    assert.ok(rules.has('hue-mismatch'));
    assert.ok(rules.has('duplicate-student-subject'));
  });

  it('uses the Circular 22 semester and annual weighting', () => {
    const record = createSyntheticDataset('verified').find(
      (item) => item.kind === 'secondary',
    );
    assert.ok(record && record.kind === 'secondary');
    assert.equal(computeAnnualAverage(record), record.schoolResult);
  });

  it('uses the vocational 0.4 coursework and 0.6 final-exam weighting', () => {
    const record = createSyntheticDataset('verified').find(
      (item) => item.kind === 'vocational',
    );
    assert.ok(record && record.kind === 'vocational');
    const expected =
      Math.round(
        (0.4 * record.continuousAverage +
          0.6 * (record.finalExamScore ?? 0)) *
          10,
      ) / 10;
    assert.equal(computeVocationalResult(record), expected);
  });

  it('restores a correctable value from verified evidence and records no mutation', () => {
    const record = createSyntheticDataset('incidents').find(
      (item) =>
        item.kind === 'primary' &&
        item.periodicScore !== null &&
        !Number.isInteger(item.periodicScore),
    );
    assert.ok(record && record.kind === 'primary');
    const fixed = resolveFromEvidence(record, 'primary-integer');
    assert.equal(fixed.kind, 'primary');
    assert.equal(fixed.periodicScore, fixed.evidence.periodicScore);
    assert.notEqual(fixed, record);
  });

  it('does not silently approve a reassessment workflow', () => {
    const record = createSyntheticDataset('incidents').find(
      (item) => item.kind === 'secondary' && item.retakeScore !== null,
    );
    assert.ok(record && record.kind === 'secondary');
    const issue = runAudit([record]).find(
      (item) => item.ruleId === 'retake-approval',
    );
    assert.equal(issue?.canResolveFromEvidence, false);
  });
});
