export function calculateFromTotal({ honor, totalUsersHonor, totalTokens }) {
  if (honor < 1) {
    return 0;
  }
  return Number(((honor * totalTokens) / totalUsersHonor).toFixed(1));
}

export default function distributeTokens({ users, totalTokens }) {
  const totalUsersHonor = users.reduce(
    (prev, next) => prev + next.partialHonor,
    0
  );
  return users.map((user) => ({
    ...user,
    tokensAmount: calculateFromTotal({
      honor: user.partialHonor,
      totalUsersHonor,
      totalTokens,
    }),
  }));
}
