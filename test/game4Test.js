const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers');
const { assert } = require('chai');

describe('Game4', function () {
  async function deployContractAndSetVariables() {
    const Game = await ethers.getContractFactory('Game4');
    const game = await Game.deploy();
    await game.deployed();

    // Get two different signers
    const signer1 = ethers.provider.getSigner(0);
    const signer2 = ethers.provider.getSigner(1);

    // Get their addresses
    const address1 = await signer1.getAddress();
    const address2 = await signer2.getAddress();

    return { game, signer1, signer2, address1, address2 };
  }

  it('should be a winner', async function () {
    const { game, signer1, signer2, address1, address2 } = await loadFixture(deployContractAndSetVariables);

    // Call the write function to set nested[address2][address1] to true
    await game.connect(signer2).write(address1);

    // Call the win function with the correct address
    await game.connect(signer1).win(address2);

    // Leave this assertion as-is
    assert(await game.isWon(), 'You did not win the game');
  });
});

