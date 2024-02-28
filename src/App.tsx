import { Suspense } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import { EthereumClient, w3mConnectors, w3mProvider } from '@web3modal/ethereum';
import { Web3Modal } from '@web3modal/react';
import { mainnet, lineaTestnet } from 'wagmi/chains';
import { ToastContainer } from 'react-toastify';
import Loading from './components/Loading';
import { LoadingProvider } from './contexts/LoadingContext';
import { MobileMenuProvider } from './contexts/MobileMenuContext';
import Routes from './Routes';
import { DialogSizeProvider } from './contexts/DialogSizeContext';
import { createPublicClient, http } from 'viem';

// -----------------------------------------------------------------------------------------------

const projectId = process.env.REACT_APP_CONNECT_PROJECT_ID || ''
const chains = [mainnet, lineaTestnet]
const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: w3mConnectors({ projectId, chains }),
  publicClient: createPublicClient({
    chain: lineaTestnet,
    transport: http()
  })
})
const ethereumClient = new EthereumClient(wagmiConfig, chains)

// -----------------------------------------------------------------------------------------------

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<Loading />}>
        <WagmiConfig config={wagmiConfig}>
          <LoadingProvider>
            <MobileMenuProvider>
              <DialogSizeProvider>
                <Routes />
                <ToastContainer className="!z-[99999]" />
              </DialogSizeProvider>
            </MobileMenuProvider>
          </LoadingProvider>
        </WagmiConfig>
        <Web3Modal projectId={projectId} ethereumClient={ethereumClient} />
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
