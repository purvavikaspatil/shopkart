import { useState, useEffect } from 'react';

/**
 * Counts down to a target timestamp, ticking once a second.
 * @param {number|string|Date} target
 * @returns {{days:number, hours:number, minutes:number, seconds:number, expired:boolean, total:number}}
 */
export function useCountdown(target) {
  const targetTime = target instanceof Date ? target.getTime() : new Date(target).getTime();
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const total = Math.max(0, targetTime - now);
  return {
    total,
    expired: total === 0,
    days: Math.floor(total / 86400000),
    hours: Math.floor((total % 86400000) / 3600000),
    minutes: Math.floor((total % 3600000) / 60000),
    seconds: Math.floor((total % 60000) / 1000),
  };
}

export default useCountdown;
