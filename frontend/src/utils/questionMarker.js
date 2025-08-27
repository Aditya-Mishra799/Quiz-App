// questionMarker.js
const KEY = "questionActive";
export function setQuestionActive() {
  sessionStorage.setItem(KEY, "true");
}

export function clearQuestionActive() {
  sessionStorage.removeItem(KEY);
}

export const calcRemTime = (startedAt, duration) => {
  if (
    startedAt === undefined ||
    startedAt === null ||
    duration === undefined ||
    duration === null
  ) {
    return 0;
  }
  const elapsed = Math.floor((Date.now() - startedAt) / 1000);
  const rem = duration - elapsed;
  return Math.max(rem, 0);
};

export function removeIfExpired(startedAt, duration) {
  const rem = calcRemTime(startedAt, duration);
  if (rem == 0) {
    clearQuestionActive();
  }
}

export function isQuestionActive(startedAt, duration) {
  return sessionStorage.getItem(KEY) === "true";
}