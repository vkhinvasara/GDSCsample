/* test/sample-test.js */
describe("NFTMarket", function() {
  it("Should create and execute market sales", async function() {
    /* deploy the marketplace */
    const NFTMarketplace = await ethers.getContractFactory("NFTMarketplace")
    const nftMarketplace = await NFTMarketplace.deploy()
    await nftMarketplace.deployed()

    let listingPrice = await nftMarketplace.getListingPrice()
    listingPrice = listingPrice.toString()

    const auctionPrice = ethers.utils.parseUnits('1', 'ether')

    /* create two tokens */
    await nftMarketplace.createToken("https://www.mytokenlocation.com", { value: listingPrice })
    await nftMarketplace.createToken("https://www.mytokenlocation2.com", { value: listingPrice })
      
    const [_, auth, reciever1] = await ethers.getSigners()
  
    /* execute sale of token to another user */
    await nftMarketplace.connect(auth).createMarketSale(1, reciever1.address,{ value: auctionPrice })
   

    /* query for and return the unsold items */
    items = await nftMarketplace.fetchMarketItems()
    items = await Promise.all(items.map(async i => {
      const tokenUri = await nftMarketplace.tokenURI(i.tokenId)
      let item = {
        tokenId: i.tokenId.toString(),
        issuer: i.issuer,
        owner: i.owner,
        tokenUri
      }
      return item
    }))
    console.log('items: ', items)

    await nftMarketplace.connect(reciever1)
    items = await nftMarketplace.fetchMyNFTs()
    items = await Promise.all(items.map(async i => {
      const tokenUri = await nftMarketplace.tokenURI(i.tokenId)
      let item = {
        tokenId: i.tokenId.toString(),
        issuer: i.issuer,
        owner: i.owner,
        tokenUri
      }
      return item
    }))
    console.log("my documents",items)


  })
})