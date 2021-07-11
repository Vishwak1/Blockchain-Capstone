const SolnSquareVerifier = artifacts.require('SolnSquareVerifier');
const zokrates = require("../../zokrates/code/square/proof.json");

contract('TestSolnSquareVerifier', accounts => {
    describe('Exercise SolnSquareVerifier', function () {
      beforeEach(async function () { 
        this.contract = await SolnSquareVerifier.new();
      });

      // Test if a new solution can be added for contract - SolnSquareVerifier
      it('should be able to  add new solutions', async function () { 
        let tx = await this.contract.addSolution(
          1, accounts[1],
          ...Object.values(zokrates.proof), zokrates.inputs);
          //console.log(tx.logs.length);
        let solutionAdded = tx.logs[0].event;
       
        
        assert.equal(
          solutionAdded, 'SolutionAdded', 'Invalid event emitted');
           

      });

      // Test if an ERC721 token can be minted for contract - SolnSquareVerifier
      it('should mint tokens for contract', async function () { 
        await this.contract.addSolution(
          1, accounts[1],
          ...Object.values(zokrates.proof), zokrates.inputs);
        let tx = await this.contract.mint(
          accounts[1], 1, {from: accounts[0]});
        let tokenTransferred = tx.logs[0].event; // transferred == minted
        assert.equal(
          tokenTransferred, 'Transfer', 'Invalid event emitted');
      });
  });
});
