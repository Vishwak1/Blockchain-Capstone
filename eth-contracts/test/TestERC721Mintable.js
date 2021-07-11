var CustomERC721Token = artifacts.require('CustomERC721Token');

contract('TestERC721Mintable', accounts => {

    const account_one = accounts[0];
    const account_two = accounts[1];
    const account_three=accounts[2];

    describe('match erc721 spec', function () {
        beforeEach(async function () { 
            this.contract = await CustomERC721Token.new( "Capstones", "[", {from: account_one});
            await this.contract.mint(account_two, 1);
            await this.contract.mint(account_two, 2);
            await this.contract.mint(account_three, 3);        
            await this.contract.mint(account_three, 4);
            await this.contract.mint(account_three, 5);

            // TODO: mint multiple tokens
        })

        it('should return total supply', async function () { 
            let totalSupply = await this.contract.totalSupply.call();
            assert.equal(totalSupply, 5, "Does not match actual supply");
            
        })

        it('should get token balance', async function () { 
            let balanceOf2 = await this.contract.balanceOf.call(account_two);
            let balanceOf3 = await this.contract.balanceOf.call(account_three);
            assert.equal(balanceOf2, 2, "Does not match balance of acct #2");
            assert.equal(balanceOf3, 3, "Does not match balance of acct #3");
            
        })

        // token uri should be complete i.e: https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1
        it('should return token uri', async function () { 
            let tokenURI = await this.contract.tokenURI.call(1);
            assert.equal(
              tokenURI,
              "https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1",
              "Does not match expected tokenURI");
            
        })

        it('should transfer token from one owner to another', async function () { 
            await this.contract.safeTransferFrom(
                account_two, account_three, 1, {from: account_two});
              let token1Owner = await this.contract.ownerOf(1);
              assert.equal(token1Owner, account_three, "Token not transferred");
            });
        })


    describe('have ownership properties', function () {
        beforeEach(async function () { 
                       this.contract = await CustomERC721Token.new( "Capstones", "[", {from: account_one});

        })

        it('should fail when minting when address is not contract owner', async function () { 
            let failed = false;
            try {
                await this.contract.mint(account_three,5,{from: account_two});
              } catch (e) {
                failed = true;
              }
    
              assert.equal(failed, true, "should fail when address is not account owner");
        })

        it('should return contract owner', async function () { 
            let owner = await this.contract.getOwner.call();
        assert.equal(owner, account_one, "Contract owner not returned");
            
        })
    })
});

    