// ================================
// AUTH STORAGE (JWT + REFRESH) + BACKWARD COMPAT
// ================================

const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";
const AUTH_USER_KEY = "auth_user"; // user objesi (opsiyonel ama eski kodlarla uyum için)

export function getAccessToken() {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getRefreshToken() {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function setTokens({ access_token, refresh_token }) {
  if (access_token) localStorage.setItem(ACCESS_TOKEN_KEY, access_token);
  if (refresh_token) localStorage.setItem(REFRESH_TOKEN_KEY, refresh_token);
}

export function clearTokens() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
}

// ---- user cache (opsiyonel) ----
export function saveAuthUser(userData) {
  localStorage.setItem(AUTH_USER_KEY, JSON.stringify(userData));
}

export function getAuthUser() {
  const data = localStorage.getItem(AUTH_USER_KEY);
  return data ? JSON.parse(data) : null;
}

export function clearAuthUser() {
  localStorage.removeItem(AUTH_USER_KEY);
}

// ---- logout ----
export function authLogout() {
  clearTokens();
  clearAuthUser();
}

// ================================
// BACKWARD COMPAT ALIASES (eski import'lar kırılmasın)
// ================================

// Eski kodlar getAuthToken/setAuthToken bekliyor
export const getAuthToken = () => getAccessToken();
export const setAuthToken = (token) => setTokens({ access_token: token });
export const clearAuthToken = () => localStorage.removeItem(ACCESS_TOKEN_KEY);

// Eski kodlar getUser/saveUser/isLoggedIn/logout bekliyor
export const getUser = () => getAuthUser();
export const saveUser = (userData) => saveAuthUser(userData);
export const isLoggedIn = () => !!getAccessToken();
export const logout = () => authLogout();

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

// Build fix + eski import uyumu
export const getTermProgress = (termId) => {
  const progress = getProgress();
  return progress[termId] || { learned: false, reviewCount: 0 };
};

export const getLearnedCount = () => {
  const progress = getProgress();
  return Object.values(progress).filter((p) => p.learned).length;
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

export const getAverageQuizScore = () => {
  const scores = getQuizScores();
  if (scores.length === 0) return 0;
  const sum = scores.reduce((acc, s) => acc + (s.percentage || 0), 0);
  return Math.round(sum / scores.length);
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
    streak.longestStreak = Math.max(streak.longestStreak, streak.currentStreak);
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

// --------------------
// Stats summary (eski Home kullanımı için de uyumlu)
// --------------------

export const getStats = () => {
  const progress = getProgress();
  const learnedCount = Object.values(progress).filter((p) => p.learned).length;
  const totalReviews = Object.values(progress).reduce((acc, p) => acc + (p.reviewCount || 0), 0);
  const streak = getStreak();
  const quizAvg = getAverageQuizScore();
  const quizCount = getQuizScores().length;
  const matchCount = getMatchScores().length;

  return {
    learnedTerms: learnedCount,
    totalReviews,
    currentStreak: streak.currentStreak,
    longestStreak: streak.longestStreak,
    averageQuizScore: quizAvg,
    quizzesTaken: quizCount,
    matchGamesPlayed: matchCount,
  };
};
