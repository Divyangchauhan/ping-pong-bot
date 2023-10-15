## Description

This Repositroy holds Bot written in typescript using NestJS framework. It take connects to goerli testnet and read past events from a particular block number and listens to new events. All nessesaory information like contract address, block number etc are stored in .env file, So that same bot can be used for multiple instance of contract. An example env file is given rename it to .env and store with the deployed bot.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start
```

## Technical Details

Code is divided into services.

1. event reader service which reads contract events.
2. event processor service which checks if event is processed already if not then calls pong function.
3. event db service and transaction db service has code to work with events and transactions in database.
4. transaction cron service is cron job that is run every hour to check on unmined transactions and resend them with higher gas fees.

FallBack provider from ethers is used. It connects to multiple providers and handles failure of providers. It currently has Alchemy, Infura and Pocket as providers.

## Architecture for future scalability

split event reader and process services in its own app and use message broker like kafka to send eventes for processing to processing service. This will only be required for huge amounts of events.
Other strategy is to use multiple instances of bot but in that case we need to switch from sqlite to other db like postgres or mysql since state needs to be stored outside for load balancing to work.
