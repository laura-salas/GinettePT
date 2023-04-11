import openai
import os 
import signal
import sys
from dotenv import load_dotenv 
import spacy
from typing import List
from enum import Enum

from flask import Flask, request, jsonify, render_template, send_from_directory
import requests
from flask_cors import CORS, cross_origin

load_dotenv()

app = Flask(__name__)
cors = CORS(app)

openai.api_key = os.getenv('OPENAI_API')
nlp = spacy.load("en_core_web_sm")

start_sequence = "\nA:"
restart_sequence = "\n\nQ: "

MODEL_CHAT = "gpt-3.5-turbo-0301"
# MODEL_CHAT = "gpt-4" 

DEBUG = True 

class Author(Enum):
    SYSTEM = 1
    USER = 2
    ASSISTANT = 3


class Conversation:
    class Message:
        def __init__(self, content: str, author: Author, token_amount:int = None):
            self.content = content
            self.author_as_enum = author
            self.token_amount = token_amount if token_amount else len(nlp(content))
            if author not in Author:
                raise ValueError("Invalid author")
            else:
                if author == Author.SYSTEM:
                    self.author = "system"
                elif author == Author.USER:
                    self.author = "user"
                elif author == Author.ASSISTANT:
                    self.author = "assistant"

    def __init__(self):
        self.messages: List[self.Message] = []

    def add_message(self, content: str, author: Author, token_amount: int = None):
        self.messages.append(self.Message(content, author, token_amount))

    def get_last_n_tokens(self, n=1000):
        # if n < current amount of tokens, gets all 
        curr_amt, i = 0, 0
        conversation_excerpt = Conversation() 

        while curr_amt < n:
            if i >= len(self.messages) or self.messages[-i-1].token_amount > n:
                break
            curr_amt += self.messages[-i-1].token_amount
            conversation_excerpt.add_message(self.messages[-i-1].content,
                                    self.messages[-i-1].author_as_enum, 
                                    self.messages[-i-1].token_amount
                                    )
            i+=1 

        # reverse the messages so that they're in chronological order
        conversation_excerpt.messages.reverse()

        return conversation_excerpt

    def clear(self):
        self.messages: List[self.Message] = []


answers: Conversation = Conversation()

def parse_messages(messages):
        messages_structured = []

        for message in messages:
            messages_structured.append(
                {"role": message.author,
                "content": message.content}
            )

        return messages_structured 

def getBotResponse(history):
    attempts = 0
    response = openai.ChatCompletion.create(
        model=MODEL_CHAT,
        messages=history,
        temperature=0.5,
        max_tokens=4000,
        n=1,
    )
    while len(response["choices"][0]["message"]) == 0:
        response = openai.ChatCompletion.create(
            model=MODEL_CHAT,
            messages=history,
            temperature=0.5,
            max_tokens=4000,
            n=1,
        )
        attempts += 1
        if attempts > 5:
            return "I'm sorry. I dont think I can answer that."
    if "gpt-4" not in response["model"]:
        print ("\n[model is not gpt 4]\n\n") 
    return response["choices"][0]["message"]["content"]


def readInput():
    allInput = [""]
    q = input("Q: ")
    while ";;" not in q:
        allInput.append(q)
        q = input("")

    print("done")
    return "\n".join(allInput)

@app.route('/api/backend', methods=['POST'])
@cross_origin(origin='http://localhost:3000', headers=['Content-Type', 'Accept'])
def handle_message():
    if DEBUG:
        testString = "What is the difference between a vector and a matrix?"
        print("a")
        return jsonify({'response': testString})
    q = request.json['message'] 
    a = ""
    if "change the subject" in q:
        answers.clear()
        a = "Subject changed. Ask new question." 

    answers.add_message(q, Author.USER)
    
    shortened_history = parse_messages(answers.get_last_n_tokens(4000).messages)
    a = getBotResponse(shortened_history)
    #a = "test answer"
    #print(shortened_history)
    if "Ext" in a[0:5]:
        a = a.replace("Extbf", "\\textbf")
    answers.add_message(a, Author.ASSISTANT)
    
    return jsonify({'response': a})


if __name__ == '__main__':
    app.run(debug=True)
