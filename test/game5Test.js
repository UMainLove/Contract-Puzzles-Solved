const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers');
const { assert } = require('chai');
const { ethers } = require('hardhat');

describe('Game5', function () {
  async function deployContractAndSetVariables() {
    const Game = await ethers.getContractFactory('Game5');
    const game = await Game.deploy();
    await game.deployed();

    // Generate a wallet with an address lower than the threshold
    let wallet;
    const threshold = ethers.utils.getAddress("0x00FfFFfFFFfFFFFFfFfFfffFFFfffFfFffFfFFFf");
    do {
      wallet = ethers.Wallet.createRandom().connect(ethers.provider);
    } while (wallet.address >= threshold);

    // Fund the new wallet with some Ether to perform transactions
    const [deployer] = await ethers.getSigners();
    await deployer.sendTransaction({
      to: wallet.address,
      value: ethers.utils.parseEther('1'), // Send 1 Ether
    });

    return { game, wallet };
  }

  it('should be a winner', async function () {
    const { game, wallet } = await loadFixture(deployContractAndSetVariables);

    // Call the win function with the wallet
    await game.connect(wallet).win();

    // Leave this assertion as-is
    assert(await game.isWon(), 'You did not win the game');
  });
});
