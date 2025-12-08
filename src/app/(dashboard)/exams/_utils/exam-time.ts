type ExamTime = {
  savedTime: string | null;
  savedtartTime: string | null;
};

export function getRemainingTime({ savedTime, savedtartTime }: ExamTime) {
  if (!savedTime || !savedtartTime) return 0;

  const now = Date.now();
  const diff = Math.floor((now - parseInt(savedtartTime)) / 1000);
  const remainingTime = parseInt(savedTime) - diff;

  return remainingTime > 0 ? remainingTime : 0;
}
