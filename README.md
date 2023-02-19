# 🤖 Metlin - Discord Bot
The full open source repository of my Discord Bot, **Metlin**.

This repository includes a wide variety of interesting functions and features exclusively made for the bot from scratch. You can check out most of them in the **src/utils** folder.

## 💻 Running

- Install Node.js if you don't have it. The bot was developed and tested in version **18+**.
- Clone this repository.
- Install all the required dependencies with `npm install`.
- Copy the contents of `.example.env` in a new file called `.env` and fill in everything that is needed. Then do the same for `config.example.ts`, here the new file has to be called `config.ts`. The `.example` files contain comments to help you understand what the settings do.
- Build the proyect using `npm run build`. Then run `npm run start:build` to start the bot.
- You can also just run `npm start` to run the proyect using **ts-node**.
- `npm clean` will delete the `dist` folder, in where the compiled JavaScript files are generated.

**Important**: all the commands must be executed in the root directory of the proyect. Avoid running from folders like `dist` or `src`. It's also recommended to only use the scripts that the proyect has (from `package.json`) to build or run it. If you don't do any of these, you can probably get file/module find errors.

## ❤️ Mentions
Here is a list of proyects and resources that I would like to mention. They helped as a reference to make specific parts of the code.
- [wiki.vg:](https://wiki.vg/) A place where the community stores technical documentation of knowledge mainly based on reverse engineering efforts on Minecraft.
- [PassTheMayo/minecraft-server-util:](https://github.com/PassTheMayo/minecraft-server-util) A Node.js library for Minecraft servers that can retrieve status, query, RCON, and send Votifier votes.
- [chrisdickinson/varint:](https://github.com/chrisdickinson/varint) encode whole numbers to an array of protobuf-style varint bytes and also decode them.