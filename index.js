const ethers = require("ethers");
const ERC_721_ABI = require("./abi/erc721");
const crypto = require("crypto").webcrypto;
const { getReabableEtherNumber } = require("./helpers/getReadableEtherNumber");

const ETH_NAME = "perrpoco1113331";
const ETH_REGISTRAR_CONTROLLER = "0x283Af0B28c62C092C9727F1Ee09c02CA627EB7F5";
const provider = new ethers.providers.getDefaultProvider("goerli", "15344a862df64a4caf67a612a7b2acd4");
const privateKey = "3308cab5b93c783530104247bf459075b33b016ac8bfa60b8c450c5a947d9db3";
const MY_ADDRESS = "0x3B1a0a2f15d1b2D9cB53456e07665aAC52559058";
const wallet = new ethers.Wallet(privateKey, provider);

const registerEns = async () => {
  const contract = new ethers.Contract(
    ETH_REGISTRAR_CONTROLLER,
    ERC_721_ABI,
    provider
  );
  const contractWithWallet = await contract.connect(wallet);

  const commitmentAge = await contractWithWallet.MIN_REGISTRATION_DURATION();
  console.log("max commitment age: ", commitmentAge.toString() / 60 / 60 / 24);

  const random = new Uint8Array(32);
  crypto.getRandomValues(random);
  let r = '';
  for (const b of random) {
    r += ('0' + b.toString(16)).slice(-2);
  }
  const salt = '0x' + r;
  console.log(salt);
  const price =
    getReabableEtherNumber(
      await contractWithWallet.rentPrice(ETH_NAME, 31556952)
    ) * 1.1;

  console.log("PRICE: ", price);

  const commitment = await contractWithWallet.makeCommitmentWithConfig(
    ETH_NAME,
    MY_ADDRESS,
    salt,
    "0x4B1488B7a6B320d2D721406204aBc3eeAa9AD329",
    MY_ADDRESS
  );

  console.log("commitment: ", commitment);

  const tx = await contractWithWallet.commit(commitment);

  console.log("waiting");

  let hasRegistrationInitiated = false;
  provider.on("block", async (b) => {
    let
      receipt = await provider.getTransactionReceipt(tx.hash);
    if (receipt !== null && hasRegistrationInitiated === false && receipt.confirmations >= 1) {
      hasRegistrationInitiated = true;
      console.log("Waiting 60 sec... ");
      setTimeout(async () => {
        const tx2 = await contractWithWallet.registerWithConfig(
          ETH_NAME,
          MY_ADDRESS,
          31556952,
          salt,
          "0x4B1488B7a6B320d2D721406204aBc3eeAa9AD329",
          MY_ADDRESS,
          { gasLimit: 300000, value: ethers.BigNumber.from("100000000000000000").toHexString() }
        );
        await tx2.wait();
        console.log("TX2: ", tx2);
      }, 65000);
    }
  });

};

registerEns();
