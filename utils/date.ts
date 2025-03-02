// 定义时间单位（秒）
const TIME_UNITS = {
  year: 31536000,
  month: 2592000,
  week: 604800,
  day: 86400,
  hour: 3600,
  minute: 60,
  second: 1,
} as const;

/**
 * 将日期格式化为"几分钟前"、"几小时前"等形式
 */
export function formatDistanceToNow(date: Date): string {
  const now = new Date();
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diff < 0) {
    return "刚刚";
  }

  // 使用TIME_UNITS常量计算时间差
  if (diff < TIME_UNITS.minute) {
    return "刚刚";
  } else if (diff < TIME_UNITS.hour) {
    const minutes = Math.floor(diff / TIME_UNITS.minute);
    return `${minutes}分钟前`;
  } else if (diff < TIME_UNITS.day) {
    const hours = Math.floor(diff / TIME_UNITS.hour);
    return `${hours}小时前`;
  } else if (diff < TIME_UNITS.month) {
    const days = Math.floor(diff / TIME_UNITS.day);
    return `${days}天前`;
  } else if (diff < TIME_UNITS.year) {
    const months = Math.floor(diff / TIME_UNITS.month);
    return `${months}个月前`;
  } else {
    const years = Math.floor(diff / TIME_UNITS.year);
    return `${years}年前`;
  }
}

/**
 * 格式化日期为 YYYY-MM-DD
 */
export function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

/**
 * 格式化日期和时间为 YYYY-MM-DD HH:MM:SS
 */
export function formatDateTime(date: Date): string {
  const formattedDate = formatDate(date);
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  return `${formattedDate} ${hours}:${minutes}:${seconds}`;
}
