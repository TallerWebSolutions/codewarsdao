import sdk from "./1-initialize-sdk.js";
import { readFileSync } from "fs";

const editionDrop = sdk.getEditionDrop(process.env.DROP_MODULE);

(async () => {
  try {
    await editionDrop.createBatch([
      {
        name: "CodeWarsDAO Member Token",
        description: "This NFT will give you access to CodeWarsDAO!",
        image: readFileSync("scripts/assets/codewars-nft-gm.png"),
      },
    ]);
    console.log("✅ Successfully created a new NFT in the drop!");
  } catch (error) {
    console.error("failed to create the new NFT", error);
  }
})();