import { BigInt, Address, ethereum } from "@graphprotocol/graph-ts"
import {
  Lore,
  Transfer
} from "../generated/Lore/Lore"
import { Sentence } from "../generated/schema"

// Note: If a handler doesn't require existing field values, it is faster
  // _not_ to load the entity from the store. Instead, create it fresh with
  // `new Entity(...)`, set the fields that should be updated and save the
  // entity back to the store. Fields that were not set or unset remain
  // unchanged, allowing for partial updates to be applied.

  // It is also possible to access smart contracts from mappings. For
  // example, the contract that has emitted the event can be connected to
  // with:
  //
  // let contract = Contract.bind(event.address)
  //
  // The following functions can then be called on this contract to access
  // state variables and other data:
  //
  // - contract.ROYALTY_AMOUNT_BIPS(...)
  // - contract.adapter(...)
  // - contract.balanceOf(...)
  // - contract.children(...)
  // - contract.contractURI(...)
  // - contract.getAllChildren(...)
  // - contract.getAllParents(...)
  // - contract.getApproved(...)
  // - contract.getMerkleLeaf(...)
  // - contract.getNumChildren(...)
  // - contract.hasClaimedAllowlist(...)
  // - contract.imageStyle(...)
  // - contract.isApprovedForAll(...)
  // - contract.isTrustedForwarder(...)
  // - contract.name(...)
  // - contract.nativeTokenCost(...)
  // - contract.owner(...)
  // - contract.ownerOf(...)
  // - contract.parent(...)
  // - contract.royaltyInfo(...)
  // - contract.sentence(...)
  // - contract.storyAt(...)
  // - contract.supportsInterface(...)
  // - contract.symbol(...)
  // - contract.tokenURI(...)
  // - contract.totalSupply(...)
  // - contract.wethCost(...)

export function handleTransfer(event: Transfer): void {
  let id = event.params.tokenId.toString();
  let entity: Sentence;
  

  if (event.params.from.equals(Address.zero())) {
    // it's a mint -- sentence being added
    entity = new Sentence(id)
    let lore: Lore = Lore.bind(event.address)
    let tokenId: BigInt = event.params.tokenId
    
    entity.imageStyle = BigInt.fromU32(lore.imageStyle(tokenId))
    entity.sentence = lore.sentence(tokenId)
    entity.adapter = lore.adapter(tokenId)

    // get parent
    let parentId = lore.parent(tokenId);
    let parentEntity = Sentence.load(parentId.toString());
    entity.parent = parentEntity ? parentEntity.id : null
    
  } else {
    entity = Sentence.load(id)!;
  }

  entity.owner = event.params.to;
  entity.save()
}
