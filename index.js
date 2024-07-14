const ethers = require("ethers");

 const ERC20ABI = [
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



async function main(){
    const provider = new ethers.providers.JsonRpcProvider("https://rpc-sepolia.rockx.com");
    const signer = new ethers.Wallet("0xb5d90cee9918bcd04d62fc112265f8f4cfdb3854d7f6f8eb441071bd872101a3",provider);
    console.log("signer",signer);

    const abi = ["function approve(address to ,uint256 amount) external", "function upgrade(uint256) external", "function transfer(address to ,uint amount) external"]

    let super_token_contract_instance = new ethers.Contract("0xC8e4F9AD94a36863f98298DAb7B07685CC5f831F",abi,signer);
    let ape_coin_erc20 = new ethers.Contract("0x755457DBC2aAa7568169C58942755c8Bf2b406d1",ERC20ABI,signer);
    console.log("ape coin erc20",ape_coin_erc20);

    // let approve = await ape_coin_erc20.approve("0xC8e4F9AD94a36863f98298DAb7B07685CC5f831F",ethers.utils.parseEther("100000"));

    // let mint_super_tokens = await super_token_contract_instance.upgrade(ethers.utils.parseEther("99000"));

    let send_super_token_approve = await super_token_contract_instance.transfer("0xf7454FAD1c929002A9A45074578f9F34EA940a7F",ethers.utils.parseEther("10"));
    
    // let playersigner = new ethers.Wallet("0x7bdafdffee8ea9ea493b54511854b1b5e77b12854ec4deeee698726c3c21d602",provider);
    // const quizy_abi = ["function connectPool(string id) external"];

    // let quizystream_contract = new ethers.Contract("0x695fA833CC55A5B6D198E18753447dD23852717B",quizy_abi,playersigner);

    // let connect_pool  = await quizystream_contract.connectPool("669318e35dd0356b41805f33");



}

main();