import { differenceInDays, isPast, isToday, isTomorrow } from 'date-fns';

/**
 * D-day 계산
 * @param dueDate 마감일
 * @returns D-day 문자열 (D-3, D-Day, D+2 등)
 */
export function calculateDday(dueDate: string | Date): string {
  const due = typeof dueDate === 'string' ? new Date(dueDate) : dueDate;
  const today = new Date();

  // 오늘 자정과 마감일 자정 비교
  today.setHours(0, 0, 0, 0);
  due.setHours(0, 0, 0, 0);

  const diff = differenceInDays(due, today);

  if (diff === 0) return 'D-Day';
  if (diff > 0) return `D-${diff}`;
  return `D+${Math.abs(diff)}`;
}

/**
 * D-day 상태 (긴급도)
 */
export function getDdayStatus(dueDate: string | Date): 'overdue' | 'urgent' | 'soon' | 'normal' {
  const due = typeof dueDate === 'string' ? new Date(dueDate) : dueDate;
  const today = new Date();

  today.setHours(0, 0, 0, 0);
  due.setHours(0, 0, 0, 0);

  const diff = differenceInDays(due, today);

  if (diff < 0) return 'overdue'; // 지남
  if (diff === 0) return 'urgent'; // 오늘
  if (diff <= 3) return 'soon'; // 3일 이내
  return 'normal'; // 그 외
}

/**
 * D-day 색상
 */
export function getDdayColor(dueDate: string | Date): {
  bg: string;
  text: string;
  border: string;
} {
  const status = getDdayStatus(dueDate);

  switch (status) {
    case 'overdue':
      return {
        bg: 'bg-accent-danger/10',
        text: 'text-accent-danger',
        border: 'border-accent-danger',
      };
    case 'urgent':
      return {
        bg: 'bg-accent-warning/10',
        text: 'text-accent-warning',
        border: 'border-accent-warning',
      };
    case 'soon':
      return {
        bg: 'bg-accent-primary/10',
        text: 'text-accent-primary',
        border: 'border-accent-primary',
      };
    default:
      return {
        bg: 'bg-light-surface-2 dark:bg-dark-surface-2',
        text: 'text-light-text-secondary dark:text-dark-text-secondary',
        border: 'border-light-border dark:border-dark-border',
      };
  }
}

/**
 * D-day 한글 설명
 */
export function getDdayDescription(dueDate: string | Date): string {
  const due = typeof dueDate === 'string' ? new Date(dueDate) : dueDate;

  if (isToday(due)) return '오늘까지';
  if (isTomorrow(due)) return '내일까지';
  if (isPast(due)) return '기한 지남';

  const diff = differenceInDays(due, new Date());
  return `${diff}일 남음`;
}
