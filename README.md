# Protocol Vaquita

![Texto alternativo](/vaquina.png)

Protocol Vaquinha is a community savings protocol inspired by the traditional Andean savings system known as Pasanaku. This protocol leverages blockchain technology to solve trust issues, allowing users to organize and participate in group savings systems with complete transparency and security. Vaquinha Protocol scales these traditional systems to the digital world, providing global access to communities that need reliable shared savings solutions.

## 🌐 Resources

- 🚀 **Demo:** Check out the live demo of the project [here](https://vaquita-op.vercel.app/)
- 📂 **Repository:** Access the project repo [here](https://github.com/Vaquita-Fi/vaquita-op)
- 🎥 **Pitch Deck:** This is the pitch deck for the project, providing a concise overview of its key elements. It helps to understand the problem, solution, business model, and overall impact more clearly. [Watch the Pitch Deck](https://www.loom.com/share/15fc8cf534db4c16beb92dab2e8d7879?sid=e9c3014d-ae1e-44f1-90dc-107cba3aa933)
- 💻 **Optimism Sepolia contract:** `0x1250e296dEfbe47fbFd5c3eD1B8194120f21497B` — View the [Vaquinha Program](https://optimism-sepolia.blockscout.com/address/0x1250e296dEfbe47fbFd5c3eD1B8194120f21497B).

  **Methods:**

  - 🏁 `initializeRound`: Creates a new Round and adds collateral.
  - 🙋‍♂️ `addPlayer`: Adds a player to the round and their collateral.
  - 💰 `payTurn`: Pays the current turn in the round.

- 💸 **Faucet USDC:** Use the [USDC Faucet](https://optimism-sepolia.blockscout.com/token/0x00D2d1162c689179e8bA7a3b936f80A010A0b5CF?tab=read_write_contract).
- 💡 **Faucet ETH Sepolia:** Use the [ETH Sepolia Faucet](https://faucet.quicknode.com/optimism/sepolia).

## Setup

To ensure all components work seamlessly, set the following environment variables in your `.env` file using `.env.local.example` as a reference.

You can find the API key on the [Coinbase Developer Portal's OnchainKit page](https://portal.cdp.coinbase.com/products/onchainkit). If you don't have an account, you will need to create one.

You can find your Wallet Connector project ID at [Wallet Connect](https://cloud.walletconnect.com).

```sh
# See https://portal.cdp.coinbase.com/products/onchainkit
NEXT_PUBLIC_CDP_API_KEY="GET_FROM_COINBASE_DEVELOPER_PLATFORM"

# See https://cloud.walletconnect.com
NEXT_PUBLIC_WC_PROJECT_ID="GET_FROM_WALLET_CONNECT"
```

<br />

## Locally run

```sh
# Install bun in case you don't have it
curl -fsSL https://bun.sh/install | bash

# Install packages
bun i

# Run Next app
bun run dev
```

<br />

## Resources

- [OnchainKit documentation](https://onchainkit.xyz)
- We use the [OnchainKit Early Adopter](https://github.com/neodaoist/onchainkit-early-adopter) contract written by neodaoist [[X]](https://x.com/neodaoist)

<br />

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
