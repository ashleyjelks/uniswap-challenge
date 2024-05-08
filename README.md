# Mint an NFT With Me!

## Local Setup Instructions
This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-wagmi`](https://github.com/wevm/wagmi/tree/main/packages/create-wagmi).

To run this application locally:

1. Add your Wallet Connect Project ID to .env.local at `NEXT_PUBLIC_WC_PROJECT_ID`
2. Run `npm install && npm run dev` to install deps and run local server. I developed this project using Node v 18.18.2
3. Navigate to ` http://localhost:3000` where you will need to connect your wallet to interact with the application.
4. Once your wallet is connected, tap the 'Mint' button and review the transaction in your wallet connect app. Be sure you are using Sepolia ETH to mint the NFT. Assuming you have sufficient ETH to complete the transaction, after confirming the transaction you should see a confetti "eruption" indicating the mint was successful. You should also see the lastest transactions appear below the View My NFTs button. Tapping View My NFT will route you to a new page, please note there's no additional logic implemented, so aside from the header, this page will be blank.


## Developer Notes
I attempted to build this app according to the specs laid out in the instructions and Figma file, but given what was intentionally (I assume) left out, I made the following technical decisions to most closely mimic what a production app might be: 

1. Since there is no limit to the number of NFTs that can be minted, the `X/X minted` part of the spec didn't make sense to include. Instead I opted to call ether's `getTransactionCount` method, passing in the contract address and returning the number of transactions the API returns. 
2. Given that the specs visualized both a web and mobile view for connecting to the wallet I assumed you wanted 2 separate components (or at least a mobile friendly view and desktop friendly view), which is why I created a separate Mobile Wallet Connector component 
3. After a user has successfully minted the NFT the UI renders a View My NFT button. I connected the button to a route that renders a mostly empty page, to demonstrate functionality, this is an intentional omission. 
4. I felt there should be some additional visual feedback in between tapping Mint and waiting for the operation to complete so I added a div that shows the text "Minting in progress + a "stopwatch" showing the number of seconds that have passed since the transaction began.

.
## Project Instructions

This assessment was a fun one! You can view all the specific requirements [here](https://drive.google.com/drive/folders/1VO5FAgAowA2-nokW6pj1yJMk2xvsxNW9?usp=drive_link).
