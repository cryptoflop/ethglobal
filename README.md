## ETH Global Online Submission
DaiDaddy enables a web2 FinTech experience for accessing interest-bearing crypto protocols.  

Users retain custody over their money, while all of the complexities of navigating crypto are abstracted away using account abstraction and passkeys.  

The web application can be used as a progressive web app (PWA).  

Here is how it works! Create an account by signing in with passkeys (uses Cometh). KYC and receive a Monerium IBAN (International Bank Account Number) in order to receive $EURe on your account. On/off ramping with Monerium IBANs costs zero fees and retains a web2 experience by sending a bank transfer to the new IBAN.* Once you have sent money from your current bank account to your new Monerium IBAN, you can start depositing your Euro (or $EURe) into: a) Spark Protocols Savings DAI on Gnosis Chain. b) Compound USDC on Polygon (PoS), which bridges from Gnosis using Connext. That’s it - enjoy earning interest!  

*Step 2 is skipped due to time constraints (& Monerium is not yet operational for other dApp developers to KYC on their apps but is fully operational via their website monerium.com).  

**How it's Made**  
The project is built using Svelte and Ethers. For logging in without using a regular web2 flow, we decided to use the Cometh SDK. Cometh leverages the account abstraction from Safe to hide and batch all transactions and gas. Crosschain swaps are made via connext. The yield-bearing protocols we used are Savings DAI from Spark Protocol and USDC Compound.  

All our transactions for testing can be found here [https://gnosisscan.io/address/0x129FD5CEFF8781C16DEC3708f7527d9d366af037](https://gnosisscan.io/address/0x129FD5CEFF8781C16DEC3708f7527d9d366af037)  
