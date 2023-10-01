import crypto from 'crypto';

export function convertTo24HourFormat(time12: string): string {
  const [hrmn, a] = time12.split(' ');
  const [hour, minute] = hrmn.split(':');

  let hour24 = parseInt(hour, 10);

  if (a === 'PM' && hour24 !== 12) {
    hour24 += 12;
  } else if (a === 'AM' && hour24 === 12) {
    hour24 = 0;
  }

  const hour24String = hour24.toString().padStart(2, '0');
  const minuteString = minute.padStart(2, '0');

  return `${hour24String}:${minuteString}`;
}

export function isEarlierTime(obj1: any, obj2: any) {
  const time1 = convertTo24HourFormat(obj1.from);
  const time2 = convertTo24HourFormat(obj2.from);

  const [hour1, minute1] = time1.split(':').map((str) => parseInt(str, 10));
  const [hour2, minute2] = time2.split(':').map((str) => parseInt(str, 10));

  if (hour1 != hour2) {
    return hour1 < hour2 ? -1 : 1;
  } else return minute1 < minute2 ? -1 : 1;
}

export function isEarlierTime1(obj1: any, obj2: any) {
  const timeFormat = 'hh:mm A';

  const time1 = obj1.from;
  const time2 = obj2.from;

  const [hourMin1, a1] = time1.split(' ');
  const [hourMin2, a2] = time2.split(' ');

  const [hour1, min1] = hourMin1.split(':');
  const [hour2, min2] = hourMin2.split(':');

  if (a1 !== a2) {
    return a1 === 'AM' ? -1 : 1;
  }
  if (hour1 !== hour2) {
    const hour1Num = parseInt(hour1, 10);
    const hour2Num = parseInt(hour2, 10);

    return hour1 < hour2 ? -1 : 1;
  } else {
    const min1Num = parseInt(min1, 10);
    const min2Num = parseInt(min2, 10);

    return min1Num < min2Num ? -1 : 1;
  }
}

export function passwordResetToken() {
  let bufferValue = new Buffer(64);

  for (let i = 0; i < bufferValue.length; i++) {
    bufferValue[i] = Math.floor(Math.random() * 256);
  }

  return bufferValue.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}
