import json
from janome.tokenizer import Tokenizer

path = './public/data/tweetsText.json'

json_load = ''
tweets = []

json_open = open(path, 'r')
json_load = json.load(json_open)

t = Tokenizer()

for obj in json_load:
    tweets.append(obj['text'])

re = []

for text in tweets:
    tweet = []
    for token in t.tokenize(text):
        tweet.append(token.surface)
    re.append({"text": text, "tokens": tweet, "values": ""})

print(re)
