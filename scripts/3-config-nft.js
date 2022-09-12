import sdk from "./1-initialize-sdk.js";
import { readFileSync } from "fs";

const editionDrop = sdk.getEditionDrop(process.env.EDITION_DROP_ADDRESS);

(async () => {
  try {
    await editionDrop.createBatch([
      {
        name: "CodewarsDAO Membership NFT",
        description: "This NFT will give you access to CodewarsDAO!",
        image: readFileSync("scripts/assets/codewars-nft-gm.png")
      }
    ]);
    console.log("✅ Successfully created a new NFT in the drop!");
  } catch (error) {
    console.error("failed to create the new NFT", error)
  }
})();