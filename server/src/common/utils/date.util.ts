import dayjs from 'dayjs';
import 'dayjs/locale/vi';

dayjs.locale('vi');

export function formatDate(date: Date | string): string {
  return dayjs(date).format('DD/MM/YYYY');
}

export function formatDateTime(date: Date | string): string {
  return dayjs(date).format('DD/MM/YYYY HH:mm');
}

export function now(): Date {
  return new Date();
}