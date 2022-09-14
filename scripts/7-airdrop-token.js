import sdk from "./1-initialize-sdk.js";
import { users as usersAirtable } from "./lib/airtable.js";
import codewars from "./lib/codewars.js";
import distributeTokens from "./lib/distributeTokens.js";

// This is the address to our ERC-1155 membership NFT contract.
const editionDrop = sdk.getEditionDrop(
  process.env.REACT_APP_EDITION_DROP_ADDRESS
);

const MEMBERSHIP_TOKEN_ID = 0;


// This is the address to our ERC-20 token contract.
const token = sdk.getToken(process.env.GOVERNANCE_TOKEN_ADDRESS);

(async () => {
  try {
    const membersAddress = await editionDrop.history.getAllClaimerAddresses(
      MEMBERSHIP_TOKEN_ID
    );

    const membersToDistribute = await usersAirtable
      .get()
      .then((data) => data.records)
      // Flat fields
      .then((users) => users.map((user) => user.fields))
      // Only Members
      .then((users) =>
        users.filter((user) => membersAddress.includes(user.walletAddress))
      )
      // With partial honor from Codewars
      .then((users) => {
        const withPartialHonor = (user) =>
          codewars.get(`/users/${user.name}`).then((data) => ({
            ...user,
            partialHonor: data.honor - user.savedHonor,
          }));
        return Promise.all(users.map(withPartialHonor));
      })
      // Only users which partial honor greater than zero.
      .then((users) => users.filter((user) => user.partialHonor > 0));

    if (membersToDistribute.length === 0) {
      console.log("🥺 None of the members gained Honor since last distribution!")
      return;
    }

    const tokenDistribution = distributeTokens({ users: membersToDistribute, totalTokens: 500 })
    
    const transferTargets = tokenDistribution.map(
      ({ walletAddress, tokensAmount }) => ({
        toAddress: walletAddress,
        amount: tokensAmount,
      })
    );
    console.log("🌈 Starting distribution of tokens...");
    await token.transferBatch(transferTargets);

    console.log(
      "✅ Successfully distribute tokens to all the members!",
      tokenDistribution
    );
  } catch (err) {
    console.error("Failed to distribute tokens", err);
  }
})();