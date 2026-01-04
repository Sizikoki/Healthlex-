// ================================
// AUTH STORAGE (JWT + REFRESH)
// ================================

const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";

export function getAccessToken() {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getRefreshToken() {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function setTokens({ access_token, refresh_token }) {
  if (access_token) {
    localStorage.setItem(ACCESS_TOKEN_KEY, access_token);
  }
  if (refresh_token) {
    localStorage.setItem(REFRESH_TOKEN_KEY, refresh_token);
  }
}

export function clearTokens() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
}

// ================================
// PROGRESS (LOCAL – OFFLINE OK)
// ================================

const STORAGE_KEYS = {
  PROGRESS: "medterm_progress",
  FLASHCARD_PROGRESS: "medterm_flashcard",
  QUIZ_SCORES: "medterm_quiz_scores",
  MATCH_SCORES: "medterm_match_scores",
  STUDY_STREAK: "medterm_streak",
};

// --------------------
// Term progress
// --------------------

export const saveProgress = (termId, isLearned) => {
  const progress = getProgress();
  progress[termId] = {
    learned: isLearned,
    lastReviewed: new Date().toISOString(),
    reviewCount: (progress[termId]?.reviewCount || 0) + 1,
  };
  localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(progress));
};

export const getProgress = () => {
  const data = localStorage.getItem(STORAGE_KEYS.PROGRESS);
  return data ? JSON.parse(data) : {};
};

// --------------------
// Flashcard progress
// --------------------

export const saveFlashcardSession = (categoryId, completedCount, totalCount) => {
  const sessions = getFlashcardSessions();
  sessions.push({
    categoryId,
    completedCount,
    totalCount,
    date: new Date().toISOString(),
  });
  localStorage.setItem(STORAGE_KEYS.FLASHCARD_PROGRESS, JSON.stringify(sessions));
};

export const getFlashcardSessions = () => {
  const data = localStorage.getItem(STORAGE_KEYS.FLASHCARD_PROGRESS);
  return data ? JSON.parse(data) : [];
};

// --------------------
// Quiz scores
// --------------------

export const saveQuizScore = (categoryId, score, total) => {
  const scores = getQuizScores();
  scores.push({
    categoryId,
    score,
    total,
    percentage: Math.round((score / total) * 100),
    date: new Date().toISOString(),
  });
  localStorage.setItem(STORAGE_KEYS.QUIZ_SCORES, JSON.stringify(scores));
};

export const getQuizScores = () => {
  const data = localStorage.getItem(STORAGE_KEYS.QUIZ_SCORES);
  return data ? JSON.parse(data) : [];
};

// --------------------
// Match game scores
// --------------------

export const saveMatchScore = (categoryId, time, moves) => {
  const scores = getMatchScores();
  scores.push({
    categoryId,
    time,
    moves,
    date: new Date().toISOString(),
  });
  localStorage.setItem(STORAGE_KEYS.MATCH_SCORES, JSON.stringify(scores));
};

export const getMatchScores = () => {
  const data = localStorage.getItem(STORAGE_KEYS.MATCH_SCORES);
  return data ? JSON.parse(data) : [];
};

// --------------------
// Study streak
// --------------------

export const updateStreak = () => {
  const streak = getStreak();
  const today = new Date().toDateString();
  const lastStudy = streak.lastStudyDate
    ? new Date(streak.lastStudyDate).toDateString()
    : null;

  if (lastStudy === today) return streak;

  const yesterday = new Date(Date.now() - 86400000).toDateString();

  if (lastStudy === yesterday) {
    streak.currentStreak += 1;
    streak.longestStreak = Math.max(
      streak.longestStreak,
      streak.currentStreak
    );
  } else {
    streak.currentStreak = 1;
  }

  streak.lastStudyDate = new Date().toISOString();
  streak.totalDays += 1;

  localStorage.setItem(STORAGE_KEYS.STUDY_STREAK, JSON.stringify(streak));
  return streak;
};

export const getStreak = () => {
  const data = localStorage.getItem(STORAGE_KEYS.STUDY_STREAK);
  return data
    ? JSON.parse(data)
    : {
      currentStreak: 0,
      longestStreak: 0,
      totalDays: 0,
      lastStudyDate: null,
    };
};
