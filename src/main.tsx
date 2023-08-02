import React from "react";
import ReactDOM from "react-dom/client";
import App from "./app";
import "./styles/index.css";
import {
  EthereumClient,
  w3mConnectors,
  w3mProvider,
} from "@web3modal/ethereum";
import { Web3Modal } from "@web3modal/react";
import { WagmiConfig, configureChains, createClient } from "wagmi";
import { polygon } from "wagmi/chains";
import { Toaster } from "react-hot-toast";
import { RecoilRoot } from "recoil";

const chains = [polygon];

const projectId = import.meta.env.VITE_PROJECT_ID || "";

const { provider } = configureChains(chains, [w3mProvider({ projectId })]);
const wagmiClient = createClient({
  autoConnect: true,
  connectors: w3mConnectors({ version: 2, chains, projectId }),
  provider,
});

const ethereumClient = new EthereumClient(wagmiClient, chains);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <WagmiConfig client={wagmiClient}>
      <RecoilRoot>
        <App />
        <Toaster />
      </RecoilRoot>
    </WagmiConfig>
    <Web3Modal projectId={projectId} ethereumClient={ethereumClient} />
  </React.StrictMode>
);
