import { AddressZero } from '@ethersproject/constants'
import sdk from '../pages/api/lib/sdk'
;(async () => {
  try {
    const token = await sdk.getToken(process.env.GOVERNANCE_TOKEN_ADDRESS || '')

    const supplyAmount = 1_000_000
    // Mint supply
    await token.mintTo(process.env.WALLET_ADDRESS || '', supplyAmount)

    // Verify and get total supply.
    const totalSupply = await token.totalSupply()

    // Print out how many of our token's are out there now!
    console.log(
      '✅ There now is',
      totalSupply.displayValue,
      '$HACK in circulation'
    )
  } catch (error) {
    console.error('Failed to print money', error)
  }
})()
