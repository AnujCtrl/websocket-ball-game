# WebSocket Ball Game

This repository contains the code for a simple ball game that uses WebSockets for real-time communication between players.

## How to Play

To play the game, simply open the `index.html` file in your web browser. You will be able to control a ball on the screen using the arrow keys on your keyboard. The game supports multiple players, so you can invite your friends to join in and play together.

## How it Works

The game uses WebSockets to enable real-time communication between the players. When a player moves their ball, their movements are sent to the server using a WebSocket connection. The server then broadcasts these movements to all other connected players, allowing everyone to see each other's movements in real-time.

## Technologies Used

- HTML/CSS/JavaScript: Used to create the front-end of the game.
- Node.js: Used to create the back-end server that handles WebSocket connections.
- WebSocket: Used to enable real-time communication between players.
