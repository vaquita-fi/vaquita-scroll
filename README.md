# Protocol Vaquita

![Texto alternativo](/vaquina.png)

Protocol Vaquinha is a community savings protocol inspired by the traditional Andean savings system known as Pasanaku. This protocol leverages blockchain technology to solve trust issues, allowing users to organize and participate in group savings systems with complete transparency and security. Vaquinha Protocol scales these traditional systems to the digital world, providing global access to communities that need reliable shared savings solutions.

## 🌐 Resources

- 🚀 **Demo:** Check out the live demo of the project [here](https://vaquita-psi.vercel.app/)
- 🎥 **Pitch Deck:** This is the pitch deck for the project, providing a concise overview of its key elements. It helps to understand the problem, solution, business model, and overall impact more clearly. [Watch the Pitch Deck](https://www.loom.com/share/15fc8cf534db4c16beb92dab2e8d7879?sid=e9c3014d-ae1e-44f1-90dc-107cba3aa933)
- 💻 **Sepolia Base contract:** `0x8522D7762A8C3a71ddf5f52b6DA19849BAB87F1d` — View the [Vaquinta Program](https://sepolia.basescan.org/address/0x8522D7762A8C3a71ddf5f52b6DA19849BAB87F1d).

  **Methods:**

  - 🏁 `initializeRound`: Creates a new Round and adds collateral.
  - 🙋‍♂️ `addPlayer`: Adds a player to the round and their collateral.
  - 💰 `payTurn`: Pays the current turn in the round.
 

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

## Need more help?

If you have any questions or need help, feel free to reach out to us on [Discord](https://discord.gg/8gW3h6w5) 
or open a [Github issue](https://github.com/coinbase/onchainkit/issues) or DMs us 
on X at [@onchainkit](https://x.com/onchainkit), [@zizzamia](https://x.com/zizzamia), [@fkpxls](https://x.com/fkpxls).
