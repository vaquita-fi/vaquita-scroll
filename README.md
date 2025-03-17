# Protocol Vaquita

![Texto alternativo](/vaquina.png)

Protocol Vaquinha is a community savings protocol inspired by the traditional Andean savings system known as Pasanaku. This protocol leverages blockchain technology to solve trust issues, allowing users to organize and participate in group savings systems with complete transparency and security. Vaquita Protocol scales these traditional systems to the digital world, providing global access to communities that need reliable shared savings solutions.

## 🌐 Resources

- 🚀 **Demo:** Check out the live demo of the project [here](https://scroll.vaquita.fi/)
- 📂 **Repository:** Access the project repo [here](https://github.com/Vaquita-Fi/vaquita-scroll)
- 🎥 **Pitch Deck:** This is the pitch deck for the project, providing a concise overview of its key elements. It helps to understand the problem, solution, business model, and overall impact more clearly. [Watch the Pitch Deck](https://www.loom.com/share/be6c6954782e4445821939e9abac9cae?sid=bb914012-fea0-475d-88a1-629201a30d8c)
- 💻 **Optimism Sepolia contract:** `0xCEFfc2bB0930C18D553185a2acd7cf06593461AC` — View the [Vaquita Contract](https://sepolia.scrollscan.com/address/0xCEFfc2bB0930C18D553185a2acd7cf06593461AC).

  **Methods:**

  - 🏁 `initializeRound`: Creates a new Round and adds collateral.
  - 🙋‍♂️ `addPlayer`: Adds a player to the round and their collateral.
  - 💰 `payTurn`: Pays the current turn in the round.

- 💸 **Faucet USDC:** Use the [USDC Faucet](https://faucet.circle.com).
- 💡 **Faucet ETH Scroll Sepolia:** Use the [ETH Scroll Sepolia Faucet](https://docs.scroll.io/en/user-guide/faucet/#scroll-sepolia-faucets).

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
