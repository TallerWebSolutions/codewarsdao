import { useAddress, useEditionDrop, useMetamask } from "@thirdweb-dev/react";
import { useEffect, useState } from "react";

const App = () => {
  const address = useAddress()
  const connectWithMetamask = useMetamask()
  const editionDrop = useEditionDrop(process.env.REACT_APP_EDITION_DROP_ADDRESS);
  const [isMember, setIsMember] = useState(false);

  useEffect(() => {
    // Exit if wallet is not connected.
    if (!address) {
      return;
    }

    const checkBalance = async () => {
      const MEMBERSHIP_TOKEN_ID = 0;
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

  return (
    <div className="landing">
      <h1>👀 wallet connected, now what!</h1>
    </div>
  )
};

export default App;
