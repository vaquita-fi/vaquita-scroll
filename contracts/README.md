## Vaquita - Decentralized Rotating Savings and Credit Association (ROSCA)

Vaquita is a smart contract implementation of a ROSCA (Rotating Savings and Credit Association) with yield generation through Aave. It allows a group of players to pool funds together, take turns receiving the pooled amount, and earn interest on their locked collateral.

### New Features

- **Aave Integration**: Funds are deposited into Aave to generate yield while locked in the contract
- **Incentive Mechanism**: Players who pay on time receive more interest, while late payers are penalized
- **Random Position Assignment**: Player positions are randomly assigned using block data
- **Cutoff Dates**: Each turn has a specific cutoff date based on the frequency of payments
- **Unified Withdrawal**: Players can withdraw both collateral and interest in a single transaction

### How It Works

1. A round is initialized with a specified number of players, payment amount, and frequency of payments
2. Players join the round by depositing collateral (payment amount × number of players)
3. Each player is assigned a random position (turn number)
4. During each turn, all players except the one whose turn it is pay the payment amount to the contract
5. The player whose turn it is receives the pooled amount
6. All funds are deposited into Aave to generate yield
7. When the round completes, players can withdraw their collateral plus interest
8. Interest distribution is based on payment behavior - on-time payments are rewarded, late payments are penalized

### Deployment to Sepolia

To deploy the contract to the Sepolia testnet:

1. Create a `.env` file with your private key:
```
PRIVATE_KEY=your_private_key_here
```

2. Deploy using Foundry:
```shell
$ forge script script/DeployVaquitaSepolia.s.sol:DeployVaquitaSepolia --rpc-url sepolia --broadcast --verify
```

### Testing

```shell
$ forge test
```

### Interacting with the Contract

After deployment, you can interact with the contract using the following functions:

- `initializeRound`: Create a new round
- `addPlayer`: Join an existing round
- `payTurn`: Pay for a specific turn
- `withdrawTurn`: Withdraw the pooled amount for your turn
- `withdrawFunds`: Withdraw your collateral and interest after the round completes

## Foundry

**Foundry is a blazing fast, portable and modular toolkit for Ethereum application development written in Rust.**

Foundry consists of:

-   **Forge**: Ethereum testing framework (like Truffle, Hardhat and DappTools).
-   **Cast**: Swiss army knife for interacting with EVM smart contracts, sending transactions and getting chain data.
-   **Anvil**: Local Ethereum node, akin to Ganache, Hardhat Network.
-   **Chisel**: Fast, utilitarian, and verbose solidity REPL.

## Documentation

https://book.getfoundry.sh/

## Usage

### Build

```shell
$ forge build
```

### Test

```shell
$ forge test
```

### Format

```shell
$ forge fmt
```

### Gas Snapshots

```shell
$ forge snapshot
```

### Anvil

```shell
$ anvil
```

### Deploy

```shell
$ forge script script/Counter.s.sol:CounterScript --rpc-url <your_rpc_url> --private-key <your_private_key>
```

### Cast

```shell
$ cast <subcommand>
```

### Help

```shell
$ forge --help
$ anvil --help
$ cast --help
```
