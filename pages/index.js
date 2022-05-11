import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Web3Modal from 'web3modal'
import { app } from "./src/base";
import hero from '../public/hero1.png'


const db = app.firestore();

import {
  marketplaceAddress
} from '../config'

import NFTMarketplace from '../artifacts/contracts/NFTMarketplace.sol/NFTMarketplace.json'

export default function Home() {
    return(<section className="text-gray-600 body-font">
    <div className="container mx-auto flex px-5 py-24 items-center justify-center flex-col">
     
      
      <div className="text-center lg:w-2/3 w-full">
        <h1 className="title-font sm:text-4xl text-3xl mb-4 font-medium text-gray-900">Issue documents on Polygon</h1>
        <p className="mb-8 leading-relaxed">FloatingCargo is a document issuance website on the polygon mumbai network, we aim to solve problems related to physical issuance of documents</p>
        <div className="flex justify-center">
          </div>
      </div>
    </div>
  </section>
    )}
  