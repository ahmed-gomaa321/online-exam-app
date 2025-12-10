type ExamTime = {
  duration: number;
  startTime: string | null;
};

export function getRemainingTime({ duration, startTime }: ExamTime) {
  if (!startTime) return duration;

  const now = Date.now();
  const diff = Math.floor((now - parseInt(startTime)) / 1000);
  const remaining = duration - diff;

  return remaining > 0 ? remaining : 0;
}
