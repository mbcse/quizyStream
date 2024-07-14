import type { Abi } from "viem";

import type { ABI_TYPE } from "./types";

export const QuizyStreamABI = [
    {
      "type": "constructor",
      "inputs": [
        {
          "name": "_superToken",
          "type": "address",
          "internalType": "contract ISuperToken"
        }
      ],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "aggregate_answers",
      "inputs": [
        { "name": "quiz_id", "type": "string", "internalType": "string" },
        {
          "name": "question_number",
          "type": "uint256",
          "internalType": "uint256"
        },
        {
          "name": "answer",
          "type": "tuple[]",
          "internalType": "struct QuizyStream.Answer[]",
          "components": [
            { "name": "answer", "type": "string", "internalType": "string" },
            { "name": "question", "type": "string", "internalType": "string" },
            {
              "name": "timestamp",
              "type": "uint256",
              "internalType": "uint256"
            },
            { "name": "quiz_id", "type": "string", "internalType": "string" },
            {
              "name": "question_number",
              "type": "uint256",
              "internalType": "uint256"
            },
            { "name": "player", "type": "address", "internalType": "address" },
            { "name": "signature", "type": "bytes", "internalType": "bytes" }
          ]
        },
        {
          "name": "questionsalt",
          "type": "uint256",
          "internalType": "uint256"
        },
        {
          "name": "correct_question",
          "type": "string",
          "internalType": "string"
        },
        { "name": "correct_answer", "type": "string", "internalType": "string" }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "connectPool",
      "inputs": [
        { "name": "quizid", "type": "string", "internalType": "string" }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "distributeFlow",
      "inputs": [
        {
          "name": "pool",
          "type": "address",
          "internalType": "contract ISuperfluidPool"
        },
        { "name": "flowRate", "type": "int96", "internalType": "int96" }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "get_member_flow_rate",
      "inputs": [
        { "name": "quizid", "type": "string", "internalType": "string" },
        { "name": "member", "type": "address", "internalType": "address" }
      ],
      "outputs": [{ "name": "", "type": "int96", "internalType": "int96" }],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "id_to_quizinstance",
      "inputs": [{ "name": "", "type": "string", "internalType": "string" }],
      "outputs": [
        { "name": "flowrate", "type": "int96", "internalType": "int96" },
        { "name": "admin", "type": "address", "internalType": "address" },
        { "name": "start_time", "type": "uint256", "internalType": "uint256" },
        { "name": "end_time", "type": "uint256", "internalType": "uint256" },
        { "name": "questions_num", "type": "uint8", "internalType": "uint8" },
        { "name": "interval", "type": "uint8", "internalType": "uint8" },
        {
          "name": "pool",
          "type": "address",
          "internalType": "contract ISuperfluidPool"
        }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "payout",
      "inputs": [
        {
          "name": "pool",
          "type": "address",
          "internalType": "contract ISuperfluidPool"
        },
        { "name": "player", "type": "address", "internalType": "address" },
        {
          "name": "correct_answer",
          "type": "string",
          "internalType": "string"
        },
        {
          "name": "correct_question",
          "type": "string",
          "internalType": "string"
        },
        { "name": "playeranswer", "type": "string", "internalType": "string" },
        { "name": "playerquestion", "type": "string", "internalType": "string" }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "pooladdress",
      "inputs": [
        { "name": "quizid", "type": "string", "internalType": "string" }
      ],
      "outputs": [{ "name": "", "type": "address", "internalType": "address" }],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "start_new_quiz",
      "inputs": [
        { "name": "flowrate", "type": "int96", "internalType": "int96" },
        { "name": "admin", "type": "address", "internalType": "address" },
        { "name": "id", "type": "string", "internalType": "string" },
        { "name": "start_time", "type": "uint256", "internalType": "uint256" },
        { "name": "end_time", "type": "uint256", "internalType": "uint256" },
        { "name": "question_num", "type": "uint8", "internalType": "uint8" },
        { "name": "interval", "type": "uint8", "internalType": "uint8" },
        { "name": "players", "type": "address[]", "internalType": "address[]" },
        { "name": "hashes", "type": "bytes32[]", "internalType": "bytes32[]" }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "superToken",
      "inputs": [],
      "outputs": [
        {
          "name": "",
          "type": "address",
          "internalType": "contract ISuperToken"
        }
      ],
      "stateMutability": "view"
    },
    {
      "type": "function",
      "name": "updateMemberUnits",
      "inputs": [
        {
          "name": "pool",
          "type": "address",
          "internalType": "contract ISuperfluidPool"
        },
        { "name": "member", "type": "address", "internalType": "address" },
        { "name": "units", "type": "uint128", "internalType": "uint128" }
      ],
      "outputs": [],
      "stateMutability": "nonpayable"
    },
    {
      "type": "function",
      "name": "user_to_id_to_answer",
      "inputs": [
        { "name": "", "type": "address", "internalType": "address" },
        { "name": "", "type": "string", "internalType": "string" }
      ],
      "outputs": [
        { "name": "answer", "type": "string", "internalType": "string" },
        { "name": "question", "type": "string", "internalType": "string" },
        { "name": "timestamp", "type": "uint256", "internalType": "uint256" },
        { "name": "quiz_id", "type": "string", "internalType": "string" },
        {
          "name": "question_number",
          "type": "uint256",
          "internalType": "uint256"
        },
        { "name": "player", "type": "address", "internalType": "address" },
        { "name": "signature", "type": "bytes", "internalType": "bytes" }
      ],
      "stateMutability": "view"
    }
  ]

export const ERC20ABI = [
    {
      "constant": true,
      "inputs": [],
      "name": "name",
      "outputs": [
        {
          "name": "",
          "type": "string"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "_spender",
          "type": "address"
        },
        {
          "name": "_value",
          "type": "uint256"
        }
      ],
      "name": "approve",
      "outputs": [
        {
          "name": "",
          "type": "bool"
        }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "totalSupply",
      "outputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "_from",
          "type": "address"
        },
        {
          "name": "_to",
          "type": "address"
        },
        {
          "name": "_value",
          "type": "uint256"
        }
      ],
      "name": "transferFrom",
      "outputs": [
        {
          "name": "",
          "type": "bool"
        }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "decimals",
      "outputs": [
        {
          "name": "",
          "type": "uint8"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "name": "_owner",
          "type": "address"
        }
      ],
      "name": "balanceOf",
      "outputs": [
        {
          "name": "balance",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "symbol",
      "outputs": [
        {
          "name": "",
          "type": "string"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "_to",
          "type": "address"
        },
        {
          "name": "_value",
          "type": "uint256"
        }
      ],
      "name": "transfer",
      "outputs": [
        {
          "name": "",
          "type": "bool"
        }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "name": "_owner",
          "type": "address"
        },
        {
          "name": "_spender",
          "type": "address"
        }
      ],
      "name": "allowance",
      "outputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "payable": true,
      "stateMutability": "payable",
      "type": "fallback"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "name": "owner",
          "type": "address"
        },
        {
          "indexed": true,
          "name": "spender",
          "type": "address"
        },
        {
          "indexed": false,
          "name": "value",
          "type": "uint256"
        }
      ],
      "name": "Approval",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "name": "from",
          "type": "address"
        },
        {
          "indexed": true,
          "name": "to",
          "type": "address"
        },
        {
          "indexed": false,
          "name": "value",
          "type": "uint256"
        }
      ],
      "name": "Transfer",
      "type": "event"
    }
]


export const QuezyStreamAddress = "0xf20eCAcE226725FB905b7c141e40215e2D78B2eD"