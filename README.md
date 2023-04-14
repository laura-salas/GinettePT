# GinettePT - A simple ChatGPT API Front-end

# <img src="assets/ginette.png" width="200px">

GinettePT is a React front-end project that provides a visually appealing interface for interacting with the ChatGPT API. It allows users to chat with the AI model and see the responses in real-time. The messages can be persisted in JSON format, and the application also features typing indicators to enhance the user experience.

# <img src="assets/Screenshot 2023-04-11 at 12.05.09 AM.png" width="500px">

## Features

- Visually appealing chat interface ;-) 
- Real-time conversation with ChatGPT
- ~~Message persistence in JSON format~~ **NOTE: currently broken in deployed flask server as next API endpoints are not exported in build. will be fixed by instead using sql queries to persist.**
- Typing indicators

____

## Note: repo structure 

### Source code 

The github repo's "main" page (aka, the one where you can see the readme) is the **source code**. in the source code, the python script is made to be run alongside the node server (`npm run dev` & `python3 app.py` from the root folder, after running a `npm install` to install the dependencies, of course)

### Downloadable (and easy to run) server 

This is available in the github's releases, and __the instructions below for the rest of the readme concern the release unless specified otherwise__. 

____

## Requirements (again, for the release)

* Python 3 
* 1.8gb space in your disk, sorry hehe 
* A GPT API key. if you don't know how to obtain one, see [this tutorial](https://platform.openai.com/docs/quickstart)

## Installation (release)

(this is done from a command line)

1. Download and unzip the `.zip` file from the releases page (you can also [click here](https://github.com/laura-salas/GinettePT/releases/tag/release-build))

2. Open a terminal, and navigate to the project directory:

```
cd ginettept1_0_0.zip
```

3. Open the `.env` file (located in the root directory) in your favorite editor, and enter your open ai API KEY (again - if you don't yet have one see see [this](https://platform.openai.com/docs/quickstart)) where it says `YOUR_API_KEY_HERE`.  Save the file. NOTE: this is all stored locally - this information will never leave your laptop. **Do not share your API key with anyone!**

```
OPENAI_API="YOUR_API_KEY_HERE"
```

4. Install dependencies for python: 

```
pip3 install -r requirements.txt
```

5. Start the server! 

```
pip3 app.py
```

6. Open your browser and go to [http://localhost:5000](http://localhost:5000) to start chatting with Ginette :-) 

## Usage (release)

1. Type your message in the input field at the bottom of the chat window.
2. Press `Enter` to send the message or click on the "Send" icon.
3. You can use markdown to format your messages
4. To clear the conversation, press `Shift + Delete` on your keyboard.

## Future releases 

What I plan to add:

* Persisting the conversation in build (it works in the source code by launching npm and flask server, in `messages.json`) so that closing your browser doesn't lose the chat
* **Support for code block syntax highlighting (through [hljs](https://highlightjs.org))** from both sending and receiving messages - got it working at one point, but it was too wonky to include it.

## Customization (source code)

If you want to customize the application, you can modify the following:

- `components/message.js`: Modify the `Message` component to change the appearance of individual messages.
- `pages/index.jsx`: Modify the main application page to change the layout or add new features.
- `scripts/utils.js`: Add or modify utility functions if needed.
- `scripts/api/backend.js`: Communication with the python backend. 
- `app.py` handles all communications to and fro GPT api server. You can change which model version to use (it's GPT-4 by default), tokenization logic, etc.

## Contributing

If you'd like to contribute, feel free to fork this repository, create a new branch with your changes, and open a pull request. We appreciate your help!

## License

This project is licensed under the [MIT License](LICENSE).

