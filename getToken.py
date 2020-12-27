import json
from janome.tokenizer import Tokenizer

path = './public/data/tweetsText.json'
file_name = './public/data/normalizedTweetData.json'

json_load = ''
tweets = []

anchors = [
    "放射",
    "被ばく",
    "被曝",
    "被爆",
    "除染",
    "線量",
    "ヨウ素",
    "セシウム",
    "シーベルト",
    "Sv",
    "mSV",
    "μSV",
    "uSV",
    "msv",
    "μsv",
    "usv",
    "ベクレル",
    "Bq",
    "ガンマ線",
    "γ線",
    "核種",
    "甲状腺",
    "甲状線",
    "チェルノブイリ",
    "規制値",
    "基準値",
    "学会",
    "警戒区域",
    "避難区域",
    "産科婦人科",
    "周産期・新生児医",
    "日本疫",
    "核医",
    "電力中央",
    "学術会議",
    "環境疫",
    "物理学会",
    "プルトニウム",
    "ストロンチウム",
    "暫定基準",
    "暫定規制",
    "屋内退避",
    "金町浄水場",
    "出荷制限",
    "管理区域",
    "避難地域",
    "モニタリング",
    "スクリーニング",
    "ホットスポット",
    "汚染",
    "検査 食品",
    "水",
    "土",
    "リスク がん",
    "ガン",
    "癌",
    "影響 妊婦",
    "妊娠",
    "出産",
    "子ども",
    "子供",
    "こども",
    "児",
    "母子避難",
    "避難弱者",
    "自主避難",
    "避難関連死",
    "避難死",
    "福島",
    "ふくしま",
    "フクシマ 避難",
    "米",
    "野菜",
    "牛肉",
    "食品",
    "産",
    "安全",
    "安心",
    "不安",
    "検査",
    "サーベイメータ",
    "半減期",
    "遮蔽",
    "疫学",
    "ICRP",
    "IAEA",
    "WHO",
    "コーデックス委員会",
    "ECRR",
    "JCO事故",
    "東海村事故",
    "東海村臨界",
    "臨界事故",
    "検査 野菜",
    "山野草",
    "魚",
    "東電",
    "東京電力",
    "安全委",
    "保安院",
    "規制庁",
    "規制委",
    "安全厨",
    "危険厨",
    "廃炉",
    "メルトダウン",
    "吉田調書",
    "再稼働",
    "反原発",
    "御用学者",
    "アイソトープ",
    "同位体",
    "同位元素",
    "いちえふ",
    "第五福竜",
    "ビキニ事件",
    "ビキニ事故",
    "死の灰",
    "風評",
]

json_open = open(path, 'r')
json_load = json.load(json_open)

t = Tokenizer()

for obj in json_load:
    tweets.append(obj['text'])

re = {"data": [], "maxs": {}, "mins": {}, "anchors": anchors}

for anchor in anchors:
    re['mins'][anchor] = float('inf')
    re['maxs'][anchor] = 0

for tweet in tweets:
    tweetData = {
        # "text": tweet,
        "tokens": [], "values": {}}
    tokens = []
    for token in t.tokenize(tweet):
        tokens.append(token.surface)
    for anchor in anchors:
        tweetData['values'][anchor] = tokens.count(anchor)
    re["data"].append(tweetData)

for anchor in anchors:
    for data in re['data']:
        count = data['values'][anchor]
        if count < re['mins'][anchor]:
            re['mins'][anchor] = count
        if re['maxs'][anchor] < count:
            re['maxs'][anchor] = count

for data in re['data']:
    for anchor in anchors:
        data['values'][anchor] = (
            data['values'][anchor] - re['mins'][anchor]) / (re['maxs'][anchor] - re['mins'][anchor])

with open(file_name, mode='w') as f:
    f.write(re)
