type Total = {
  honor: number
  totalUsersHonor: number
  totalTokens: number
}

export function calculateFromTotal({
  honor,
  totalUsersHonor,
  totalTokens,
}: Total): number {
  if (honor < 1) {
    return 0
  }
  return Number(((honor * totalTokens) / totalUsersHonor).toFixed(1))
}

export default function distributeTokens({
  users,
  totalTokens,
}: {
  users: { partialHonor: number, walletAddress: string }[]
  totalTokens: number
}) {
  const totalUsersHonor = users.reduce(
    (prev, next) => prev + next.partialHonor,
    0
  )
  return users.map((user) => ({
    ...user,
    tokensAmount: calculateFromTotal({
      honor: user.partialHonor,
      totalUsersHonor,
      totalTokens,
    }),
  }))
}
