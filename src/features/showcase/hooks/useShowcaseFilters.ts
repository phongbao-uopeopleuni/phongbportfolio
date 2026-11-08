import {useMemo, useState} from 'react';
import {PROJECTS} from '../data/registry';
import type {ShowcaseCategory, ShowcaseStatus} from '../types/showcase';

export type CategoryFilter = ShowcaseCategory | 'all';
export type StatusFilter = ShowcaseStatus | 'all';

/** Loc theo linh vuc va trang thai. Danh sach tuy chon do trang tu suy ra
 *  tu registry nen danh muc khong co du an se khong bao gio hien. */
export function useShowcaseFilters() {
  const [category, setCategory] = useState<CategoryFilter>('all');
  const [status, setStatus] = useState<StatusFilter>('all');

  const projects = useMemo(
    () =>
      PROJECTS.filter(
        (p) =>
          (category === 'all' || p.category === category) &&
          (status === 'all' || p.status === status),
      ),
    [category, status],
  );

  const reset = () => {
    setCategory('all');
    setStatus('all');
  };

  return {category, setCategory, status, setStatus, projects, reset};
}
