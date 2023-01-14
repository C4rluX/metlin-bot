# 🤖 Metlin - Discord Bot
The full open source repository of my Discord Bot, **Metlin**.

This repository includes a wide variety of interesting functions and features exclusively made for the bot from scratch. You can check out most of them in the **src/utils** folder.

## 💻 Running

- Install Node.js if you don't have it. The bot was developed and tested in version **18+**.
- Install all the required dependencies with `npm install`.
- Create a file called `.env` in the proyect root folder. Copy the contents of `.env.example` and fill in everything that is needed.
- Copy the contents of `config.example.json` into another file, fill in everything that is needed and then remove the comments. I would recommend a tool like [sindresorhus/strip-json-comments-cli](https://github.com/sindresorhus/strip-json-comments-cli). It can create a copy of a JSON file without the comments with in a simple manner. If you are using Visual Studio Code, you can edit that file without getting errors using language mode "**jsonc**" (JSON with comments).
- Build the proyect using `npm run build`. Then run `npm run start:build` to start the bot.
- You can also just run `npm start` to run the proyect using **ts-node**.
- `npm clean` will delete the `dist` folder, in where the compiled JavaScript files are generated.

## ❤️ Mentions
Here is a list of proyects and resources that I would like to mention. They helped as a reference to make specific parts of the code.
- [wiki.vg:](https://wiki.vg/) A place where the community stores technical documentation of knowledge mainly based on reverse engineering efforts on Minecraft.
- [PassTheMayo/minecraft-server-util:](https://github.com/PassTheMayo/minecraft-server-util) A Node.js library for Minecraft servers that can retrieve status, query, RCON, and send Votifier votes.
- [chrisdickinson/varint:](https://github.com/chrisdickinson/varint) encode whole numbers to an array of protobuf-style varint bytes and also decode them.