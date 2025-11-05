import { format, startOfDay, endOfDay } from 'date-fns';
import { toZonedTime, fromZonedTime } from 'date-fns-tz';

const KOREA_TIMEZONE = 'Asia/Seoul';

/**
 * 현재 한국시간 가져오기
 */
export function getKoreaTime(): Date {
  return toZonedTime(new Date(), KOREA_TIMEZONE);
}

/**
 * 한국시간으로 포맷팅
 */
export function formatKoreaTime(date: Date | string, formatString: string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const koreaTime = toZonedTime(d, KOREA_TIMEZONE);
  return format(koreaTime, formatString);
}

/**
 * 오늘 8시인지 체크 (한국시간)
 */
export function isKorea8AM(): boolean {
  const now = getKoreaTime();
  const hour = now.getHours();
  return hour === 8;
}

/**
 * 다음 한국시간 8시까지 남은 밀리초
 */
export function getMillisecondsUntilNextKorea8AM(): number {
  const now = getKoreaTime();
  const next8AM = new Date(now);
  next8AM.setHours(8, 0, 0, 0);

  // 이미 8시가 지났으면 내일 8시
  if (now.getHours() >= 8) {
    next8AM.setDate(next8AM.getDate() + 1);
  }

  // 한국시간 -> UTC로 변환
  const next8AMUTC = fromZonedTime(next8AM, KOREA_TIMEZONE);
  const nowUTC = new Date();

  return next8AMUTC.getTime() - nowUTC.getTime();
}

/**
 * 오늘 날짜인지 체크 (한국시간 기준)
 */
export function isTodayKorea(date: Date | string): boolean {
  const d = typeof date === 'string' ? new Date(date) : date;
  const koreaDate = toZonedTime(d, KOREA_TIMEZONE);
  const koreaToday = getKoreaTime();

  return (
    koreaDate.getFullYear() === koreaToday.getFullYear() &&
    koreaDate.getMonth() === koreaToday.getMonth() &&
    koreaDate.getDate() === koreaToday.getDate()
  );
}

/**
 * 오늘의 시작/끝 시간 (한국시간)
 */
export function getTodayKoreaRange(): { start: Date; end: Date } {
  const today = getKoreaTime();
  const start = startOfDay(today);
  const end = endOfDay(today);

  return {
    start: fromZonedTime(start, KOREA_TIMEZONE),
    end: fromZonedTime(end, KOREA_TIMEZONE),
  };
}
