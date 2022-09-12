import { AddressZero } from "@ethersproject/constants";
import sdk from "./1-initialize-sdk.js";
import { readFileSync } from "fs";

(async () => {
  try {

    // Deploy an Edition which can be dropped tokens.
    const editionDropAddress = await sdk.deployer.deployEditionDrop({
      name: "CodewarsDAO",
      description:
        "A DAO which pays given your monthly amount of points you make at Codewars",
      image: readFileSync("scripts/assets/codewars.png"),
      // We need to pass in the address of the person who will be receiving the proceeds from sales of nfts in the contract.
      // We're planning on not charging people for the drop, so we'll pass in the 0x0 address
      // you can set this to your own wallet address if you want to charge for the drop.
      primary_sale_recipient: AddressZero,
    });

    // Load Edition Drop instance through thirdweb sdk.
    const editioDrop = sdk.getEditionDrop(editionDropAddress)
    const metadata = await editioDrop.metadata.get()

    console.log(
      "✅ Successfully deployed editionDrop contract, address:",
      editionDropAddress
    );
    console.log("✅ editionDrop metadata:", metadata);
  } catch (error) {
    console.log("failed to deploy editionDrop contract", error);
  }
})();