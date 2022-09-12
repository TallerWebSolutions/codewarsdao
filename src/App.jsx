import { useAddress, useEditionDrop, useMetamask } from "@thirdweb-dev/react";
import { useEffect, useState } from "react";

const App = () => {
  const address = useAddress()
  const connectWithMetamask = useMetamask()
  const editionDrop = useEditionDrop(process.env.REACT_APP_EDITION_DROP_ADDRESS);
  const [isMember, setIsMember] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false)
  const MEMBERSHIP_TOKEN_ID = 0;

  useEffect(() => {
    // Exit if wallet is not connected.
    if (!address) {
      return;
    }

    const checkBalance = async () => {
      try {
        const balance = await editionDrop.balanceOf(address, MEMBERSHIP_TOKEN_ID);
        if (balance.gt(0)) {
          setIsMember(true)
          console.log("🌟 this user has a membership NFT!");
        }
        else {
          setIsMember(false)
          console.log("😭 this user doesn't have a membership NFT.");
        }
      } catch (error) {
        setIsMember(false)
        console.error("Failed to get balance", error);
      }
    }

    checkBalance();
  }, [address, editionDrop])

  const mintNft = async () => {
    try {
      setIsClaiming(true)
      await editionDrop.claim(MEMBERSHIP_TOKEN_ID, 1)
      console.log(`🌊 Successfully Minted! Check it out on OpenSea: https://testnets.opensea.io/assets/${editionDrop.getAddress()}/0`);
      setIsClaiming(true);
    } catch (error) {
      setIsClaiming(false);
      console.error("Failed to mint NFT", error);
    } finally {
      setIsClaiming(false);
    }
  }
  
  console.log(`👋 Address: ${address}`)

  if (!address) {
    return (
      <div className="landing">
        <h1>Welcome to CodewarsDAO</h1>
        <button onClick={connectWithMetamask} className="btn-hero">
          Connect your wallet
        </button>
      </div>
    );
  }

  if (isMember) {
    return (
      <div className="member-page">
        <h1>CodewarsDAO Member Page</h1>
        <p>Congratulations on being a member!</p>
      </div>
    );
  }

  return (
    <div className="mint-nft">
      <h1>Claim your free CodewarsDAO membership NFT!</h1>
      <button
        disabled={isClaiming}
        onClick={mintNft}
      >
        {isClaiming ? "Minting..." : "Mint your NFT"}
      </button>
    </div>
  )
};

export default App;
