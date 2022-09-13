import sdk from "./1-initialize-sdk.js";

const token = sdk.getToken(process.env.GOVERNANCE_TOKEN_ADDRESS);

(async () => {
  try {
    const supplyAmount = 1_000_000
    // Mint supply
    await token.mintToSelf(supplyAmount)

    // Verify and get total supply.
    const totalSupply = await token.totalSupply()

    // Print out how many of our token's are out there now!
    console.log(
      "✅ There now is",
      totalSupply.displayValue,
      "$HACK in circulation"
    );
  } catch (error) {
    console.error("Failed to print money", error);
  }
})();