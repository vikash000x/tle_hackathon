exports.computeStatsFromSubmissions = (submissions, days=30) => {
  const solved = new Set();
  const solvedByDate = {};
  const ratingBuckets = {};
  let totalRating = 0;

  let maxProblem = { rating: 0 };
  const now = Date.now();
  const cutoff = now - days * 24 * 60 * 60 * 1000; // milliseconds

  for (let sub of submissions) {
    const subTime = sub.creationTimeSeconds * 1000;

    // 🔽 Filter by selected days
    if (sub.verdict === "OK" && subTime >= cutoff) {
      const pid = sub.problem.contestId + sub.problem.index;
      if (!solved.has(pid)) {
        solved.add(pid);

        const rating = sub.problem.rating || 0;
        const bucket = `${Math.floor(rating / 100) * 100}-${Math.floor(rating / 100) * 100 + 99}`;
        ratingBuckets[bucket] = (ratingBuckets[bucket] || 0) + 1;

        if (rating > maxProblem.rating) {
          maxProblem = {
            name: sub.problem.name,
            rating,
            link: `https://codeforces.com/problemset/problem/${sub.problem.contestId}/${sub.problem.index}`
          };
        }

        totalRating += rating;

        const date = new Date(subTime).toISOString().split('T')[0];
        solvedByDate[date] = (solvedByDate[date] || 0) + 1;
      }
    }
  }

  const daysWithActivity = Object.keys(solvedByDate).length || 1;

  return {
    timeRange: `${days}days`,
    totalSolved: solved.size,
    mostDifficultProblem: maxProblem,
    averageRating: Math.round(totalRating / solved.size) || 0,
   averageProblemsPerDay: Math.round((solved.size / days) * 100) / 100,
    solvedPerRatingBucket: ratingBuckets,
    heatmapData: Object.entries(solvedByDate).map(([date, count]) => ({ date, count }))
  };
};


exports.getLastSubmissionDate = (submissions) => {
  const acceptedSubs = submissions.filter(sub => sub.verdict === "OK");
  if (acceptedSubs.length === 0) return null;

  // Sort by creation time and get the last accepted submission
  const lastAccepted = acceptedSubs.sort((a, b) => b.creationTimeSeconds - a.creationTimeSeconds)[0];
  return new Date(lastAccepted.creationTimeSeconds * 1000);
}