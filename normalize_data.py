import json
from janome.tokenizer import Tokenizer

limit = 1000
num_of_anchors = 20

data_path = './public/data/postcrisis_pq2011.json'
count_tokens_path = './public/data/count_tokens.json'
normalized_data_path = f'./public/data/normalized_tweet_data_{limit}.json'

count_of_tokens = {}

anchors = []

candidates_of_part_of_speech = ['名詞', '固有名詞']

min_values = {}
max_values = {}

t = Tokenizer()

row_count = 0

with open(data_path, encoding='UTF-8', mode='r') as f_r:
    for row in f_r:
        obj = json.loads(row.strip())
        for token in t.tokenize(obj['text']):
            for p_o_s in candidates_of_part_of_speech:
                if(p_o_s in token.part_of_speech):
                    if token.surface in count_of_tokens:
                        count_of_tokens[token.surface] += 1
                    else:
                        count_of_tokens[token.surface] = 1
                    break

        row_count += 1
        if(row_count == limit):
            count_of_tokens = sorted(
                count_of_tokens.items(), key=lambda x: x[1], reverse=True)
            for token in count_of_tokens:
                if len(anchors) == num_of_anchors:
                    break
                anchors.append(token[0])
            break

row_count = 0

with open(count_tokens_path, mode='w') as f_w:
    with open(data_path, encoding='UTF-8', mode='r') as f_r:
        for anchor in anchors:
            min_values[anchor] = float('inf')
            max_values[anchor] = 0

        for row in f_r:
            row_count += 1
            if row_count == limit:
                break
            obj = json.loads(row.strip())
            d = {'text': obj['text'], 'user_name': obj['user']
                 ['name'], 'created_at': obj['created_at'], 'values': {}}

            for anchor in anchors:
                d['values'][anchor] = 0

            for token in t.tokenize(obj['text']):
                if token.surface in d['values']:
                    d['values'][token.surface] += 1

            for anchor in anchors:
                if d['values'][anchor] < min_values[anchor]:
                    min_values[anchor] = d['values'][anchor]
                if max_values[anchor] < d['values'][anchor]:
                    max_values[anchor] = d['values'][anchor]
            f_w.write(json.dumps(d, ensure_ascii=False)+'\n')

with open(normalized_data_path, mode='w') as f_w:
    f_w.write('{\n')

    f_w.write(f'"anchors":{json.dumps(anchors, ensure_ascii=False)},\n')

    f_w.write('"data": [\n')
    with open(count_tokens_path, encoding='UTF-8', mode='r') as f_r:
        for i, row in enumerate(f_r):
            obj = json.loads(row.strip())
            for anchor in anchors:
                obj['values'][anchor] = 0 if max_values[anchor] == 0 else (
                    obj['values'][anchor] - min_values[anchor]) / (max_values[anchor] - min_values[anchor])

            f_w.write(json.dumps(obj, ensure_ascii=False) +
                      (',\n' if i != row_count - 1 - 1 else '\n'))

    f_w.write(']\n')
    f_w.write('}\n')
