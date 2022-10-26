import type { NextApiRequest, NextApiResponse } from 'next'
import sdk from './lib/sdk'
import { users as usersAirtable } from './lib/airtable'
import codewars from './lib/codewars'
import distributeTokens from './lib/distributeTokens'

// @TODO Move to a useCase
export default async (req: NextApiRequest, res: NextApiResponse) => {
  // This is the address to our ERC-20 token contract.
  const token = await sdk.getContract(
    process.env.GOVERNANCE_TOKEN_ADDRESS || '',
    'token'
  )

  // member users from airtable
  const membersToDistribute = await usersAirtable
    .get()
    .then((data) => data.records)
    // Flat fields
    .then((users) => users.map((user) => user.fields))
    // Only members with wallets
    .then((users) =>
      users.filter((user) => Object.hasOwn(user, 'walletAddress'))
    )
    // With partial honor from Codewars
    .then((users) => {
      const withPartialHonor = (user: any) =>
        codewars.get(`/users/${user.name}`).then((data: any) => ({
          ...user,
          partialHonor: data.honor - user.savedHonor,
        }))
      return Promise.all(users.map(withPartialHonor))
    })
    // Only users which partial honor greater than zero.
    .then((users) => users.filter((user) => user.partialHonor > 0))

  if (membersToDistribute.length === 0) {
    console.log('🥺 None of the members gained Honor since last distribution!')
    return
  }

  const tokenDistribution = distributeTokens({
    users: membersToDistribute,
    totalTokens: 500,
  })

  const transferTargets = tokenDistribution.map(
    ({ walletAddress, tokensAmount }) => ({
      toAddress: walletAddress,
      amount: tokensAmount,
    })
  )

  console.log('🌈 Starting distribution of tokens...')

  try {
    await token.transferBatch(transferTargets)

    console.log(
      '✅ Successfully distribute tokens to all the members!',
      tokenDistribution
    )

    res.status(200).json(transferTargets)
  } catch (err) {
    console.error('Failed to distribute tokens', err)
  }
}
