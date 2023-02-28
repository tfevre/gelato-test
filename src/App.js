import logo from './logo.svg';
import './App.css';
import { ethers } from "ethers";
import { GelatoRelay, SponsoredCallERC2771Request } from "@gelatonetwork/relay-sdk";
import { smartContract } from './abi';
const relay = new GelatoRelay();

function App() {
  async function test(){
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const accounts = await provider.send("eth_requestAccounts", []);
    
    // Set up on-chain variables, such as target address
    // const counter = "0x01A9B3d53b009A1c9Ea01589235848c5e2bAD2e4"; Goerli
    const counter = "0xBE13A62A7eb0eD47811a85631DcB1b535DBa346F"; // Mumbai
    const abi = ["function captureTheFlag()"];
    
    const signer = provider.getSigner();
    const user = signer.getAddress();

    // Generate the target payload
    const contract = new ethers.Contract(counter, abi, signer);
    const { data } = await contract.populateTransaction.captureTheFlag();

    // Populate a relay request
    const request = {
      chainId: provider.network.chainId,
      target: counter,
      data: data,
      user: await user,
    };
    console.log(request)
    // Without a specific API key, the relay request will fail! 
    // Go to https://relay.gelato.network to get a testnet API key with 1Balance.
    // Send a relay request using Gelato Relay!
    const apiKey = 'PIEXdwAXAf3Yna4yZcOi_MAv7IBs3UfSqiNDM9n2Pi0_'; 
   
    const relayResponse = await relay.sponsoredCallERC2771(request, provider, apiKey);
    console.log(relayResponse);
  }

  async function getCurrentHolder(){
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const accounts = await provider.send("eth_requestAccounts", []);
    
    // Set up on-chain variables, such as target address
    // const counter = "0x01A9B3d53b009A1c9Ea01589235848c5e2bAD2e4"; Goerli
    const counter = "0xBE13A62A7eb0eD47811a85631DcB1b535DBa346F"; // Mumbai
  
    
    const signer = provider.getSigner();
    const user = signer.getAddress();
    const contract = new ethers.Contract(counter, smartContract.abi, signer);
    const { data } = await contract.getCurrentHolder();
    console.log(data);
  }
  

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <button onClick={test}>Test</button>
        <button onClick={getCurrentHolder}>Current Holder</button>
      </header>
    </div>
  );
}

export default App;
