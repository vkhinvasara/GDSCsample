import { useState } from 'react'
import { ethers } from 'ethers'
// import { create as ipfsHttpClient } from 'ipfs-http-client'
import { useRouter } from 'next/router'
import {app} from './src/base'
import Web3Modal from 'web3modal'



// const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0')

import {
  marketplaceAddress
} from '../config'

import NFTMarketplace from '../artifacts/contracts/NFTMarketplace.sol/NFTMarketplace.json'
const db = app.firestore();

export default function CreateItem() {
  const [fileUrl, setFileUrl] = useState(null)
  const [formInput, updateFormInput] = useState({  name: '',documentName:'', description: '' })
  const router = useRouter()

  // async function onChange(e) {
  //   const file = e.target.files[0]
  //   try {
  //     const added = await client.add(
  //       file,
  //       {
  //         progress: (prog) => console.log(`received: ${prog}`)
  //       }
  //     )
  //     const url = `https://ipfs.infura.io/ipfs/${added.path}`
  //     setFileUrl(url)
  //   } catch (error) {
  //     console.log('Error uploading file: ', error)
  //   }  
  // }

  // async function uploadToIPFS() {
  //   const { name, description, price } = formInput
  //   if (!name || !description || !price || !fileUrl) return
  //   /* first, upload to IPFS */
  //   const data = JSON.stringify({
  //     name, description, image: fileUrl
  //   })
  //   try {
  //     const added = await client.add(data)
  //     const url = `https://ipfs.infura.io/ipfs/${added.path}`
  //     /* after file is uploaded to IPFS, return the URL to use it in the transaction */
  //     return url
  //   } catch (error) {
  //     console.log('Error uploading file: ', error)
  //   }  
  // }
  const onFileChange= async (e)=>{
     const file = e.target.files[0]
     const storageRef = app.storage().ref()
     const fileRef = storageRef.child(file.name)
     await fileRef.put(file);
     const url =  await fileRef.getDownloadURL()
     setFileUrl(url)
     return url
  }
  async function onSubmit(e){
    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()
   

    e.preventDefault();
    const { name ,documentName, description} = formInput
    
    if (!name || !description||!documentName ) {
      console.log("No name or url")
      return;
    }
    await db.collection("Name").doc(name).set({
      documentName: documentName,
      receiver: name,
      description: description,
      document: fileUrl,
    });
    
   

    /* next, create the item */
    let contract = new ethers.Contract(marketplaceAddress, NFTMarketplace.abi, signer)
    let listingPrice = await contract.getListingPrice()
    listingPrice = listingPrice.toString()
    let transaction = await contract.createToken(fileUrl,{ value: listingPrice })
    await transaction.wait()

    
   
    router.push('/')
  }


  // async function listDocument() {
    
  //   const web3Modal = new Web3Modal()
  //   const connection = await web3Modal.connect()
  //   const provider = new ethers.providers.Web3Provider(connection)
  //   const signer = provider.getSigner()

  //   /* next, create the item */
  //   let contract = new ethers.Contract(marketplaceAddress, NFTMarketplace.abi, signer)
  //   let listingPrice = await contract.getListingPrice()
  //   listingPrice = listingPrice.toString()
  //   let transaction = await contract.createToken(url,{ value: listingPrice })
  //   await transaction.wait()
   
  //   router.push('/dashboard')
    
  // }

  return (
    <div className="flex justify-center">
      <div className="w-1/2 flex flex-col pb-12">
        <input 
          type = "text"
          placeholder="Document type"
          className="mt-8 border rounded p-4"
          onChange={e => updateFormInput({ ...formInput, documentName: e.target.value })}
        />
        <input 
          type = "text"
          placeholder="Receiver Name"
          className="mt-8 border rounded p-4"
          onChange={e => updateFormInput({ ...formInput, name: e.target.value })}
        />
        <textarea
          placeholder="Description"
          className="mt-2 border rounded p-4"
          onChange={e => updateFormInput({ ...formInput, description: e.target.value })}
        />
        
        <input
          type="file"
          name="Asset"
          className="my-4"
          onChange={onFileChange}
        />
        {
          fileUrl && (
            <img className="rounded mt-4" width="350" src={fileUrl} />
          )
        }
        <button onClick={onSubmit} className="font-bold mt-4 bg-indigo-500 text-white rounded p-4 shadow-lg">
          Create Document
        </button>
      </div>
    </div>
  )
}