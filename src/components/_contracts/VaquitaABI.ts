const abi = [
    {
      inputs: [],
      name: "CannotPayOwnTurn",
      type: "error"
    },
    {
      inputs: [],
      name: "CollateralAlreadyWithdrawn",
      type: "error"
    },
    {
      inputs: [],
      name: "InsufficientFunds",
      type: "error"
    },
    {
      inputs: [],
      name: "InterestAlreadyWithdrawn",
      type: "error"
    },
    {
      inputs: [],
      name: "InvalidTurn",
      type: "error"
    },
    {
      inputs: [],
      name: "RoundAlreadyExists",
      type: "error"
    },
    {
      inputs: [],
      name: "RoundFull",
      type: "error"
    },
    {
      inputs: [],
      name: "RoundNotActive",
      type: "error"
    },
    {
      inputs: [],
      name: "RoundNotCompleted",
      type: "error"
    },
    {
      inputs: [],
      name: "RoundNotPending",
      type: "error"
    },
    {
      inputs: [],
      name: "TurnAlreadyPaid",
      type: "error"
    },
    {
      inputs: [],
      name: "TurnAlreadyWithdrawn",
      type: "error"
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "string",
          name: "roundId",
          type: "string"
        },
        {
          indexed: false,
          internalType: "address",
          name: "player",
          type: "address"
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "amount",
          type: "uint256"
        }
      ],
      name: "CollateralWithdrawn",
      type: "event"
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "string",
          name: "roundId",
          type: "string"
        },
        {
          indexed: false,
          internalType: "address",
          name: "player",
          type: "address"
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "amount",
          type: "uint256"
        }
      ],
      name: "InterestWithdrawn",
      type: "event"
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "string",
          name: "roundId",
          type: "string"
        },
        {
          indexed: false,
          internalType: "address",
          name: "player",
          type: "address"
        }
      ],
      name: "PlayerAdded",
      type: "event"
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "string",
          name: "roundId",
          type: "string"
        },
        {
          indexed: false,
          internalType: "address",
          name: "initializer",
          type: "address"
        }
      ],
      name: "RoundInitialized",
      type: "event"
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "string",
          name: "roundId",
          type: "string"
        },
        {
          indexed: false,
          internalType: "address",
          name: "payer",
          type: "address"
        },
        {
          indexed: false,
          internalType: "uint8",
          name: "turn",
          type: "uint8"
        }
      ],
      name: "TurnPaid",
      type: "event"
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "string",
          name: "roundId",
          type: "string"
        },
        {
          indexed: false,
          internalType: "address",
          name: "player",
          type: "address"
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "amount",
          type: "uint256"
        }
      ],
      name: "TurnWithdrawn",
      type: "event"
    },
    {
      inputs: [
        {
          internalType: "string",
          name: "roundId",
          type: "string"
        }
      ],
      name: "_rounds",
      outputs: [
        {
          internalType: "uint256",
          name: "paymentAmount",
          type: "uint256"
        },
        {
          internalType: "contract IERC20",
          name: "token",
          type: "address"
        },
        {
          internalType: "uint8",
          name: "numberOfPlayers",
          type: "uint8"
        },
        {
          internalType: "uint256",
          name: "totalAmountLocked",
          type: "uint256"
        },
        {
          internalType: "uint8",
          name: "availableSlots",
          type: "uint8"
        },
        {
          internalType: "uint256",
          name: "frequencyOfTurns",
          type: "uint256"
        },
        {
          internalType: "enum Vaquita.RoundStatus",
          name: "status",
          type: "uint8"
        },
        {
          internalType: "uint256",
          name: "startTimestamp",
          type: "uint256"
        },
        {
          internalType: "uint256",
          name: "endTimestamp",
          type: "uint256"
        }
      ],
      stateMutability: "view",
      type: "function"
    },
    {
      inputs: [
        {
          internalType: "string",
          name: "roundId",
          type: "string"
        },
        {
          internalType: "uint8",
          name: "position",
          type: "uint8"
        }
      ],
      name: "addPlayer",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function"
    },
    {
      inputs: [
        {
          internalType: "string",
          name: "roundId",
          type: "string"
        }
      ],
      name: "getRoundInfo",
      outputs: [
        {
          internalType: "uint256",
          name: "paymentAmount",
          type: "uint256"
        },
        {
          internalType: "address",
          name: "tokenAddress",
          type: "address"
        },
        {
          internalType: "uint8",
          name: "numberOfPlayers",
          type: "uint8"
        },
        {
          internalType: "uint256",
          name: "totalAmountLocked",
          type: "uint256"
        },
        {
          internalType: "uint8",
          name: "availableSlots",
          type: "uint8"
        },
        {
          internalType: "uint256",
          name: "frequencyOfTurns",
          type: "uint256"
        },
        {
          internalType: "enum Vaquita.RoundStatus",
          name: "status",
          type: "uint8"
        }
      ],
      stateMutability: "view",
      type: "function"
    },
    {
      inputs: [
        {
          internalType: "string",
          name: "roundId",
          type: "string"
        },
        {
          internalType: "uint256",
          name: "paymentAmount",
          type: "uint256"
        },
        {
          internalType: "contract IERC20",
          name: "token",
          type: "address"
        },
        {
          internalType: "uint8",
          name: "numberOfPlayers",
          type: "uint8"
        },
        {
          internalType: "uint256",
          name: "frequencyOfTurns",
          type: "uint256"
        },
        {
          internalType: "uint8",
          name: "position",
          type: "uint8"
        }
      ],
      name: "initializeRound",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function"
    },
    {
      inputs: [
        {
          internalType: "string",
          name: "roundId",
          type: "string"
        },
        {
          internalType: "uint8",
          name: "turn",
          type: "uint8"
        }
      ],
      name: "payTurn",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function"
    },
    {
      inputs: [
        {
          internalType: "string",
          name: "roundId",
          type: "string"
        }
      ],
      name: "withdrawCollateral",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function"
    },
    {
      inputs: [
        {
          internalType: "string",
          name: "roundId",
          type: "string"
        }
      ],
      name: "withdrawInterest",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function"
    },
    {
      inputs: [
        {
          internalType: "string",
          name: "roundId",
          type: "string"
        }
      ],
      name: "withdrawTurn",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function"
    }
  ] as const;
  
  export default abi;