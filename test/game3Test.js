const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers');
const { assert } = require('chai');

describe('Game3', function () {
  async function deployContractAndSetVariables() {
    const Game = await ethers.getContractFactory('Game3');
    const game = await Game.deploy();
    await game.deployed();

    // Get three different signers
    const signer1 = ethers.provider.getSigner(0);
    const signer2 = ethers.provider.getSigner(1);
    const signer3 = ethers.provider.getSigner(2);

    // Get their addresses
    const address1 = await signer1.getAddress();
    const address2 = await signer2.getAddress();
    const address3 = await signer3.getAddress();

    return { game, signer1, signer2, signer3, address1, address2, address3 };
  }

  it('should be a winner', async function () {
    const { game, signer1, signer2, signer3, address1, address2, address3 } = await loadFixture(deployContractAndSetVariables);

    // Make the signers buy some Ether to update their balances
    await game.connect(signer1).buy({ value: ethers.utils.parseEther('1') }); // address1 buys 1 Ether
    await game.connect(signer2).buy({ value: ethers.utils.parseEther('2') }); // address2 buys 2 Ether
    await game.connect(signer3).buy({ value: ethers.utils.parseEther('0.5') }); // address3 buys 0.5 Ether

    // Call the win function with the addresses in the correct order to satisfy the conditions
    await game.win(address1, address2, address3);

    // Leave this assertion as-is
    assert(await game.isWon(), 'You did not win the game');
  });
});
