const abi = [
  {
    "type": "constructor",
    "inputs": [
      {
        "name": "_aavePool",
        "type": "address",
        "internalType": "address"
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "_findNextTurn",
    "inputs": [
      {
        "name": "number",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "numberOfPlayers",
        "type": "uint8",
        "internalType": "uint8"
      },
      {
        "name": "position",
        "type": "uint8",
        "internalType": "uint8"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "uint8",
        "internalType": "uint8"
      }
    ],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "_rounds",
    "inputs": [
      {
        "name": "",
        "type": "bytes16",
        "internalType": "bytes16"
      }
    ],
    "outputs": [
      {
        "name": "paymentAmount",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "token",
        "type": "address",
        "internalType": "contract IERC20"
      },
      {
        "name": "numberOfPlayers",
        "type": "uint8",
        "internalType": "uint8"
      },
      {
        "name": "totalAmountLocked",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "availableSlots",
        "type": "uint8",
        "internalType": "uint8"
      },
      {
        "name": "frequencyOfPayments",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "status",
        "type": "uint8",
        "internalType": "enum Vaquita.RoundStatus"
      },
      {
        "name": "startTimestamp",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "endTimestamp",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "totalInterestEarned",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "protocolFeeTaken",
        "type": "bool",
        "internalType": "bool"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "aavePool",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "contract IPool"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "addPlayer",
    "inputs": [
      {
        "name": "roundId",
        "type": "bytes16",
        "internalType": "bytes16"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "getPaymentStatus",
    "inputs": [
      {
        "name": "roundId",
        "type": "bytes16",
        "internalType": "bytes16"
      },
      {
        "name": "turn",
        "type": "uint8",
        "internalType": "uint8"
      },
      {
        "name": "player",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "uint8",
        "internalType": "enum Vaquita.PaymentStatus"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getPlayerPosition",
    "inputs": [
      {
        "name": "roundId",
        "type": "bytes16",
        "internalType": "bytes16"
      },
      {
        "name": "player",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "uint8",
        "internalType": "uint8"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getRoundInfo",
    "inputs": [
      {
        "name": "roundId",
        "type": "bytes16",
        "internalType": "bytes16"
      }
    ],
    "outputs": [
      {
        "name": "paymentAmount",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "tokenAddress",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "numberOfPlayers",
        "type": "uint8",
        "internalType": "uint8"
      },
      {
        "name": "totalAmountLocked",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "availableSlots",
        "type": "uint8",
        "internalType": "uint8"
      },
      {
        "name": "frequencyOfPayments",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "status",
        "type": "uint8",
        "internalType": "enum Vaquita.RoundStatus"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getTurnCutoffDate",
    "inputs": [
      {
        "name": "roundId",
        "type": "bytes16",
        "internalType": "bytes16"
      },
      {
        "name": "turn",
        "type": "uint8",
        "internalType": "uint8"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "initializeRound",
    "inputs": [
      {
        "name": "roundId",
        "type": "bytes16",
        "internalType": "bytes16"
      },
      {
        "name": "paymentAmount",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "token",
        "type": "address",
        "internalType": "contract IERC20"
      },
      {
        "name": "numberOfPlayers",
        "type": "uint8",
        "internalType": "uint8"
      },
      {
        "name": "frequencyOfPayments",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "owner",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "payTurn",
    "inputs": [
      {
        "name": "roundId",
        "type": "bytes16",
        "internalType": "bytes16"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "protocolFees",
    "inputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "registerAToken",
    "inputs": [
      {
        "name": "token",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "aToken",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "tokenToAToken",
    "inputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "transferOwnership",
    "inputs": [
      {
        "name": "newOwner",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "withdrawFunds",
    "inputs": [
      {
        "name": "roundId",
        "type": "bytes16",
        "internalType": "bytes16"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "withdrawProtocolFee",
    "inputs": [
      {
        "name": "token",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "withdrawTurn",
    "inputs": [
      {
        "name": "roundId",
        "type": "bytes16",
        "internalType": "bytes16"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "event",
    "name": "ATokenRegistered",
    "inputs": [
      {
        "name": "token",
        "type": "address",
        "indexed": false,
        "internalType": "address"
      },
      {
        "name": "aToken",
        "type": "address",
        "indexed": false,
        "internalType": "address"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "FundsWithdrawn",
    "inputs": [
      {
        "name": "roundId",
        "type": "bytes16",
        "indexed": true,
        "internalType": "bytes16"
      },
      {
        "name": "player",
        "type": "address",
        "indexed": false,
        "internalType": "address"
      },
      {
        "name": "collateralAmount",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      },
      {
        "name": "interestAmount",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "OwnershipTransferred",
    "inputs": [
      {
        "name": "previousOwner",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "newOwner",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "PlayerAdded",
    "inputs": [
      {
        "name": "roundId",
        "type": "bytes16",
        "indexed": true,
        "internalType": "bytes16"
      },
      {
        "name": "player",
        "type": "address",
        "indexed": false,
        "internalType": "address"
      },
      {
        "name": "position",
        "type": "uint8",
        "indexed": false,
        "internalType": "uint8"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "ProtocolFeeWithdrawn",
    "inputs": [
      {
        "name": "token",
        "type": "address",
        "indexed": false,
        "internalType": "address"
      },
      {
        "name": "amount",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "RoundInitialized",
    "inputs": [
      {
        "name": "roundId",
        "type": "bytes16",
        "indexed": true,
        "internalType": "bytes16"
      },
      {
        "name": "initializer",
        "type": "address",
        "indexed": false,
        "internalType": "address"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "TurnPaid",
    "inputs": [
      {
        "name": "roundId",
        "type": "bytes16",
        "indexed": true,
        "internalType": "bytes16"
      },
      {
        "name": "payer",
        "type": "address",
        "indexed": false,
        "internalType": "address"
      },
      {
        "name": "turn",
        "type": "uint8",
        "indexed": false,
        "internalType": "uint8"
      },
      {
        "name": "status",
        "type": "uint8",
        "indexed": false,
        "internalType": "enum Vaquita.PaymentStatus"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "TurnWithdrawn",
    "inputs": [
      {
        "name": "roundId",
        "type": "bytes16",
        "indexed": true,
        "internalType": "bytes16"
      },
      {
        "name": "player",
        "type": "address",
        "indexed": false,
        "internalType": "address"
      },
      {
        "name": "amount",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      }
    ],
    "anonymous": false
  },
  {
    "type": "error",
    "name": "CannotPayOwnTurn",
    "inputs": []
  },
  {
    "type": "error",
    "name": "FundsAlreadyWithdrawn",
    "inputs": []
  },
  {
    "type": "error",
    "name": "InsufficientFunds",
    "inputs": []
  },
  {
    "type": "error",
    "name": "InvalidAToken",
    "inputs": []
  },
  {
    "type": "error",
    "name": "InvalidPosition",
    "inputs": []
  },
  {
    "type": "error",
    "name": "InvalidTurn",
    "inputs": []
  },
  {
    "type": "error",
    "name": "NotOwner",
    "inputs": []
  },
  {
    "type": "error",
    "name": "RoundAlreadyExists",
    "inputs": []
  },
  {
    "type": "error",
    "name": "RoundFull",
    "inputs": []
  },
  {
    "type": "error",
    "name": "RoundNotActive",
    "inputs": []
  },
  {
    "type": "error",
    "name": "RoundNotCompleted",
    "inputs": []
  },
  {
    "type": "error",
    "name": "RoundNotPending",
    "inputs": []
  },
  {
    "type": "error",
    "name": "SafeERC20FailedOperation",
    "inputs": [
      {
        "name": "token",
        "type": "address",
        "internalType": "address"
      }
    ]
  },
  {
    "type": "error",
    "name": "TurnAlreadyPaid",
    "inputs": []
  },
  {
    "type": "error",
    "name": "TurnAlreadyWithdrawn",
    "inputs": []
  },
  {
    "type": "error",
    "name": "ZeroAddress",
    "inputs": []
  }
] as const;

export default abi;