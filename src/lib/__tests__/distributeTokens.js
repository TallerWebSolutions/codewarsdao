import distributeTokens, { calculateFromTotal } from "../../../scripts/lib/distributeTokens.js"

describe("Calculate Distribution", () => {
  const userA = { partialHonor: 35 }
  const userB = { partialHonor: 10 }
  const userC = { partialHonor: 82 }
  const totalUsersHonorMock = userA.partialHonor + userB.partialHonor + userC.partialHonor
  
  it("should calculate how much the user has to recieve from total", () => {
    const tokensToReceiveA = calculateFromTotal({
      honor: userA.partialHonor,
      totalUsersHonor: totalUsersHonorMock,
      totalTokens: 500,
    });
    expect(tokensToReceiveA).toBe(137.8);
  })

  it("should ignore calculation from total in case honor is 0", () => {
    const tokensToReceiveB = calculateFromTotal({
      honor: 0,
      totalUsersHonor: 0,
      totalTokens: 500,
    });
    expect(tokensToReceiveB).toBe(0);
  })

  it("should map users with the distribution relative to the total", () => {
    const usersWithDistribution = distributeTokens({
      users: [userA, userB, userC],
      totalTokens: 500
    });
    expect(usersWithDistribution[0].tokensAmount).toBe(137.8)
    expect(usersWithDistribution[1].tokensAmount).toBe(39.4);
    expect(usersWithDistribution[2].tokensAmount).toBe(322.8);
  })

  it("should gain 0 tokens in case user didn't earned honor", () => {
    const usersWithDistribution = distributeTokens({
      users: [{ partialHonor: 0 }],
      totalTokens: 500,
    });
    expect(usersWithDistribution[0].tokensAmount).toBe(0);
  })
})
