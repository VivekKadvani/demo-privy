import './App.css';
import { usePrivy, useWallets } from '@privy-io/react-auth';
const { ethers } = require('ethers');

function App() {
  const { wallets } = useWallets();
  const {
    ready,
    authenticated,
    user,
    login,
    logout,
    createWallet,
    exportWallet,
    signMessage,
    sendTransaction,
  } = usePrivy();

  // Wait until the Privy client is ready before taking any actions
  if (!ready) {
    return null;
  }
  async function createwallet() {
    try {
      createWallet();
    } catch (e) {
      console.log('wallet alredy exist');
    }
  }
  async function checkWalletInfo(response) {
    if (response && response.wallet && response.wallet.address) {
      // Wallet information is available
      const walletAddress = response.wallet.address;
      const chainType = response.wallet.chainType;
      const chainId = response.wallet.chainId;

      console.log(`Address: ${walletAddress}`);
      console.log(`Chain Type: ${chainType}`);
      console.log(`Chain ID: ${chainId}`);
      const wallet = wallets.find(
        (wallet) =>
          wallet.address === '0x3db65e327739C1a747a2347359303963aB8376E8',
      );
      await wallet.switchChain(11155111);
      return true;
    } else {
      console.log(`No wallet information available in the response.`);
      return false;
    }
  }

  // Check that your user is authenticated
  const isAuthenticated = ready && authenticated;

  // Check that your user has an embedded wallet
  let hasEmbeddedWallet;
  if (user) {
    hasEmbeddedWallet = !!user.linkedAccounts.find(
      (account) =>
        account.type === 'wallet' && account.walletClientType === 'privy',
    );
  }

  const message = 'Hello world';
  // Replace this with the text you'd like on your signature modal,
  // if you do not have `noPromptsOnSignature` enabled
  const uiConfig = {
    title: 'Sample title text',
    description: 'this is sample sign message',
    buttonText: 'Sign message',
  };

  const unsignedTx = {
    to: '0xc96Be35EbBdCB7aCa63FE4Ef47E9f3aA14cDfB6e',
    chainId: 11155111,
    value: ethers.utils.hexlify(1000000000000000),
  };
  return (
    <div className="App">
      <header className="App-header">
        {/* If the user is not authenticated, show a login button */}
        {/* If the user is authenticated, show the user object and a logout button */}
        {ready && authenticated ? (
          <div>
            <textarea
              readOnly
              value={JSON.stringify(user, null, 2)}
              style={{ width: '600px', height: '250px', borderRadius: '6px' }}
            />
            <br />
            {/* {checkWalletInfo(user) ? ( */}
            <button
              disabled={!(ready && authenticated)}
              onClick={() => {
                createwallet();
              }}
              style={{
                marginTop: '20px',
                margin: '10px',
                padding: '12px',
                backgroundColor: '#9ADE7B',
                color: '#FFF',
                border: 'none',
                borderRadius: '6px',
              }}
            >
              Create a wallet
            </button>
            {/* ) : ( */}
            <>
              {/* export key */}
              <button
                onClick={exportWallet}
                disabled={!isAuthenticated || !hasEmbeddedWallet}
                style={{
                  marginTop: '20px',
                  margin: '10px',
                  padding: '12px',
                  backgroundColor: '#FF8F8F',
                  color: '#FFF',
                  border: 'none',
                  borderRadius: '6px',
                }}
              >
                Export wallet key
              </button>
              {/* sign */}
              <button
                disabled={!user.wallet}
                style={{
                  marginTop: '20px',
                  margin: '10px',
                  padding: '12px',
                  backgroundColor: '#FF8F8F',
                  color: '#FFF',
                  border: 'none',
                  borderRadius: '6px',
                }}
                onClick={async () => {
                  const signature = await signMessage(message, uiConfig);
                  // Use `signature` however you'd like
                  console.log(signature);
                }}
              >
                Sign
              </button>
              {/* send tn */}
              <button
                disabled={!user.wallet}
                style={{
                  marginTop: '20px',
                  margin: '10px',
                  padding: '12px',
                  backgroundColor: '#EEF296',
                  color: '#FFF',
                  border: 'none',
                  borderRadius: '6px',
                }}
                onClick={async () => {
                  const txReceipt = await sendTransaction(unsignedTx, uiConfig);
                  // `txReceipt` is an object of type `TransactionReceipt`. From this object, you can
                  // access your transaction's `transactionHash`, `blockNumber`, `gasUsed`, and
                  // more.
                  console.log(txReceipt);
                }}
              >
                Send Tn
              </button>
            </>
            {/* )} */}
            {/* logout */}
            <button
              onClick={logout}
              style={{
                marginTop: '20px',
                padding: '12px',
                backgroundColor: '#069478',
                color: '#FFF',
                border: 'none',
                borderRadius: '6px',
              }}
            >
              Log Out
            </button>
          </div>
        ) : null}
      </header>
    </div>
  );
}

export default App;
