import sdk from "./1-initialize-sdk.js"
import { MaxUint256 } from "@ethersproject/constants"

const editionDrop = sdk.getEditionDrop(
  process.env.REACT_APP_EDITION_DROP_ADDRESS
);

(async () => {
  try {
    // Define our claim conditions which can be more than one at different
    // phases starting at different times.
    const claimConditions = [
      {
        // When people are gonna be able to start claiming their NFT, now.
        startTime: new Date(),
        // The maximum number of NFTs that can be claimed.
        maxQuantity: 50_000,
        // The price of our NFT, free.
        price: 0,
        // The amount of NFTs people can claim in one transaction.
        quantityLimitPerTransaction: 1,
        // Define the wait between transactions to MaxUint256, which means
        // people are only allowd to claim once.
        waitInSeconds: MaxUint256,
      }
    ];

    const NFT_TOKEN_ID = "0"
    await editionDrop.claimConditions.set(NFT_TOKEN_ID, claimConditions);
    console.log("✅ Successfully set claim condition!");
  } catch (error) {
    console.error("Failed to set claim condition", error);
  }
})();