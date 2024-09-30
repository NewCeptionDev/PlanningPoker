<p align="center">
  <img src="../frontend/public/logo_large.png" width="120" alt="Planning Poker Logo" />
</p>

# Planning Poker

NestJS Backend for the Planning Poker Project.
Contains HTTP Endpoints to manage sessions and a websocket server to manage communication within a session.

## HTTP Endpoints

### POST /api/management/createNewLobby

POST Endpoint that takes a body with the following fields:

| Name           | Type     | Description             |
| -------------- | -------- | ----------------------- |
| lobbyName      | string   | Name of the lobby       |
| availableCards | string[] | List of available cards |

Returns an object with a **lobbyId** field.

### GET /api/management/existsLobby/:lobbyId

GET Endpoint that takes a **lobbyId** parameter.

Returns an object with a **exists** field indicating if a lobby with this **lobbyId** exists.

### GET /api/management/lobbyInformation/:lobbyId

GET Endpoint that takes a **lobbyId** parameter.

Returns an object with a **lobbyExists** field indicating if a lobby with this **lobbyId** exists.
In Case the lobby exists, the object will also contain a field **lobbyName** that contains the name of the lobby.

## Websocket Communication

### Server Listening

#### 'joinLobby'

Message to join an existing Lobby.
Message should provide an object containing

| Name    | Type   | Description        |
| ------- | ------ | ------------------ |
| lobbyId | string | Id of the lobby    |
| userId  | string | Id of the player   |
| name    | string | Name of the player |
| role    | string | Role of the player |

#### 'leaveLobby'

Message to leave an existing Lobby.
Message should provide an object containing

| Name    | Type   | Description     |
| ------- | ------ | --------------- |
| lobbyId | string | Id of the lobby |

#### 'selectCard'

Message to select a card.
Will only work if sent by someone with Role PLAYER.
Message should provide an object containing

| Name      | Type   | Description                                                                                               |
| --------- | ------ | --------------------------------------------------------------------------------------------------------- |
| lobbyId   | string | Id of the lobby                                                                                           |
| cardValue | string | Value of the card that should be selected. Must be one of the available values for the lobby or undefined |

#### 'showCards'

Message to show the selected cards of all players.
Will only work if sent by someone with Role ADMIN.
Message should provide an object containing

| Name    | Type   | Description     |
| ------- | ------ | --------------- |
| lobbyId | string | Id of the lobby |

#### 'reset'

Message to set all selected cards to undefined and hide the cards of all players.
Will only work if sent by someone with Role ADMIN.
Message should provide an object containing

| Name    | Type   | Description     |
| ------- | ------ | --------------- |
| lobbyId | string | Id of the lobby |

### Server Sending

#### 'fullLobbyInformation'

Message that contains information on the current lobby state.
Message will include an object containing

| Name           | Type     | Description                |
| -------------- | -------- | -------------------------- |
| name           | string   | Id of the lobby            |
| users          | User[]   | List of users in the lobby |
| cardCollection | string[] | List of available cards    |
| state          | string   | State of the lobby         |

The User object contains

| Name         | Type     | Description                                                                   |
| ------------ | -------- | ----------------------------------------------------------------------------- |
| id           | string   | Id of the user                                                                |
| name         | string   | Name of the user                                                              |
| cardSelected | boolean  | Boolean indicating if the user has selected a card                            |
| selectedCard | string   | Value of the selected card or undefined if no card is selected / it is hidden |
| roles        | string[] | List of roles the user                                                        |

## Project setup

```bash
# install dependencies
$ pnpm install
```

## Compile and run the project

```bash
# development
$ pnpm run start

# watch mode
$ pnpm run start:dev

# production mode
$ pnpm run start:prod
```

## Run tests

```bash
# unit tests
$ pnpm run test

# e2e tests
$ pnpm run test:e2e

# test coverage
$ pnpm run test:cov
```
