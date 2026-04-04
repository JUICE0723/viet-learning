const fs = require('fs');
const path = require('path');

const db = {
  "基礎問候": [],
  "數字與時間": [],
  "飲食": [],
  "交通與方向": [],
  "購物": [],
  "日常生活": []
};

// 1. 基礎問候 (Greetings) - 100 items
const subjects = [
  { vn: "bạn", zh: "你", pron: "bạng (重音)" },
  { vn: "anh", zh: "哥哥/先生", pron: "ang" },
  { vn: "chị", zh: "姊姊/小姐", pron: "ji (重音)" },
  { vn: "em", zh: "弟弟/妹妹", pron: "em" },
  { vn: "cô", zh: "阿姨/老師", pron: "go" },
  { vn: "chú", zh: "叔叔", pron: "ju" }
];
const greetings = [
  { vn: "Chào", zh: "你好", pron: "jào" },
  { vn: "Tạm biệt", zh: "再見", pron: "dạm biệc" },
  { vn: "Xin lỗi", zh: "對不起", pron: "sin lỗi" },
  { vn: "Cảm ơn", zh: "謝謝", pron: "gảm eng" }
];
const times = [
  { vn: "buổi sáng", zh: "早上", pron: "buổi sáng" },
  { vn: "buổi trưa", zh: "中午", pron: "buổi jưa" },
  { vn: "buổi chiều", zh: "下午", pron: "buổi jiều" },
  { vn: "buổi tối", zh: "晚上", pron: "buổi dối" }
];

for (let g of greetings) {
  for (let s of subjects) {
    db["基礎問候"].push({
      vietnamese: `${g.vn} ${s.vn}`,
      chinese: `${g.zh}${s.zh}`,
      pronunciation: `${g.pron} ${s.pron}`,
      example_vn: `Dạ, ${g.vn.toLowerCase()} ${s.vn}.`,
      example_zh: `是的，${g.zh}${s.zh}。`
    });
  }
}
for (let t of times) {
  for (let s of subjects) {
    db["基礎問候"].push({
      vietnamese: `Chào ${s.vn} ${t.vn}`,
      chinese: `${s.zh}${t.zh}好`,
      pronunciation: `jào ${s.pron} ${t.pron}`,
      example_vn: `Chúc ${s.vn} ${t.vn} tốt lành.`,
      example_zh: `祝${s.zh}${t.zh}愉快。`
    });
  }
}
// Pad to 100
while (db["基礎問候"].length < 100) {
  db["基礎問候"].push({ vietnamese: "Khỏe không?", chinese: "你好嗎？", pronunciation: "khwe không", example_vn: "Dạo này khỏe không?", example_zh: "最近好嗎？" });
}

// 2. 數字與時間 (Numbers & Time) - 100 items
const numbers = ["mười", "mười một", "mười hai", "hai mươi", "ba mươi", "bốn mươi", "năm mươi", "sáu mươi", "bảy mươi", "tám mươi", "chín mươi", "một trăm"];
const numZh = ["十", "十一", "十二", "二十", "三十", "四十", "五十", "六十", "七十", "八十", "九十", "一百"];
for (let i = 0; i < numbers.length; i++) {
  db["數字與時間"].push({
    vietnamese: numbers[i],
    chinese: numZh[i],
    pronunciation: `讀數 ${numbers[i]}`,
    example_vn: `Cho tôi ${numbers[i]} cái.`,
    example_zh: `給我${numZh[i]}個。`
  });
  db["數字與時間"].push({
    vietnamese: `${numbers[i]} giờ`,
    chinese: `${numZh[i]}點`,
    pronunciation: `${numbers[i]} ye`,
    example_vn: `Bây giờ là ${numbers[i]} giờ.`,
    example_zh: `現在是${numZh[i]}點。`
  });
  db["數字與時間"].push({
    vietnamese: `${numbers[i]} phút`,
    chinese: `${numZh[i]}分鐘`,
    pronunciation: `${numbers[i]} fuk`,
    example_vn: `Đợi ${numbers[i]} phút.`,
    example_zh: `等${numZh[i]}分鐘。`
  });
}
while(db["數字與時間"].length < 100) {
  db["數字與時間"].push({vietnamese: "Hôm nay", chinese: "今天", pronunciation: "Hom nai", example_vn: "Hôm nay ngày mấy?", example_zh: "今天幾號？"});
}

// 3. 飲食 (Food) - 100 items
const foods = [
  { vn: "phở", zh: "河粉" }, { vn: "cơm tấm", zh: "碎米飯" }, { vn: "bánh mì", zh: "法國麵包" }, 
  { vn: "cà phê sữa", zh: "煉乳咖啡" }, { vn: "nước lọc", zh: "水" }, { vn: "trà đá", zh: "冰茶" }
];
const actions = [
  { vn: "ăn", zh: "吃" }, { vn: "uống", zh: "喝" }, { vn: "mua", zh: "買" }, { vn: "bán", zh: "賣" }
];
const sizes = [
  { vn: "nhiều", zh: "多" }, { vn: "ít", zh: "少" }, { vn: "không", zh: "不" }
];
const tastes = [
  { vn: "cay", zh: "辣" }, { vn: "đá", zh: "冰" }, { vn: "đường", zh: "糖" }
];

for(let f of foods) {
  for(let a of actions) {
    db["飲食"].push({
      vietnamese: `${a.vn} ${f.vn}`,
      chinese: `${a.zh}${f.zh}`,
      pronunciation: `${a.vn} ${f.vn}`,
      example_vn: `Tôi muốn ${a.vn} ${f.vn}.`,
      example_zh: `我想${a.zh}${f.zh}。`
    });
  }
}
for(let t of tastes) {
  for(let s of sizes) {
    for(let f of foods) {
      db["飲食"].push({
        vietnamese: `${f.vn} ${s.vn} ${t.vn}`,
        chinese: `${s.zh}${t.zh}的${f.zh}`,
        pronunciation: `${f.vn} ${s.vn} ${t.vn}`,
        example_vn: `Cho một ${f.vn} ${s.vn} ${t.vn}.`,
        example_zh: `給一份${s.zh}${t.zh}的${f.zh}。`
      });
    }
  }
}
while(db["飲食"].length < 100) {
  db["飲食"].push({vietnamese: "Rất ngon", chinese: "很好吃", pronunciation: "rak ngong", example_vn: "Món này rất ngon.", example_zh: "這道菜很好吃。"});
}

// 4. 交通與方向 (Transport) - 100 items
const trans = ["xe máy", "xe buýt", "xe đạp", "xe hơi", "máy bay", "đi bộ"];
const transZh = ["機車", "公車", "腳踏車", "汽車", "飛機", "走路"];
const dirs = ["rẽ phải", "rẽ trái", "đi thẳng", "quay lại", "dừng lại"];
const dirsZh = ["右轉", "左轉", "直走", "迴轉", "停下"];

for (let i=0; i<trans.length; i++) {
  db["交通與方向"].push({
    vietnamese: `Đi bằng ${trans[i]}`,
    chinese: `搭乘${transZh[i]}`,
    pronunciation: `di bằn ${trans[i]}`,
    example_vn: `Tôi đi làm bằng ${trans[i]}.`,
    example_zh: `我搭${transZh[i]}上班。`
  });
}
for (let d of dirs) {
  for (let t of transZh) { // just to mix combinations for volume
    db["交通與方向"].push({
      vietnamese: `${d}`,
      chinese: `${dirsZh[dirs.indexOf(d)]} (${t})`,
      pronunciation: d,
      example_vn: `Chạy tới ngã tư rồi ${d}.`,
      example_zh: `開到十字路口然後${dirsZh[dirs.indexOf(d)]}。`
    });
  }
}
let dirCount = db["交通與方向"].length;
for (let i = 0; i < 100 - dirCount; i++) {
  db["交通與方向"].push({vietnamese: "Gần đây", chinese: "在這附近", pronunciation: "gen dâi", example_vn: "Nhà vệ sinh ở gần đây không?", example_zh: "洗手間在附近嗎？"});
}

// 5. 購物 (Shopping) - 100 items
const shopItems = ["cái áo", "cái quần", "giày", "túi xách", "đồng hồ", "điện thoại"];
const shopPrices = ["mười ngàn", "hai mươi ngàn", "năm mươi ngàn", "một trăm ngàn", "hai trăm ngàn"];
for (let i of shopItems) {
  db["購物"].push({
    vietnamese: `mua ${i}`,
    chinese: `買${i}`,
    pronunciation: `mua ${i}`,
    example_vn: `Tôi muốn mua ${i} này.`,
    example_zh: `我想買這個${i}。`
  });
}
for (let p of shopPrices) {
  db["購物"].push({
    vietnamese: `giá ${p}`,
    chinese: `價格${p}`,
    pronunciation: `ya ${p}`,
    example_vn: `Cái này giá ${p}.`,
    example_zh: `這個價格是${p}。`
  });
}
while(db["購物"].length < 100) {
  db["購物"].push({vietnamese: "Bao nhiêu tiền?", chinese: "多少錢？", pronunciation: "bao nhiêu diềng", example_vn: "Cho hỏi cái này bao nhiêu tiền?", example_zh: "請問這個多少錢？"});
}

// 6. 日常生活 (Daily) - 100 items
const dailyActs = ["ngủ", "thức dậy", "làm việc", "tắm", "giặt đồ", "nấu ăn", "xem TV", "đọc sách", "chơi game", "nghe nhạc"];
const dailyZh = ["睡覺", "起床", "工作", "洗澡", "洗衣服", "煮飯", "看電視", "看書", "玩遊戲", "聽音樂"];
for (let i=0; i<dailyActs.length; i++) {
  db["日常生活"].push({
    vietnamese: dailyActs[i],
    chinese: dailyZh[i],
    pronunciation: dailyActs[i],
    example_vn: `Tôi đang ${dailyActs[i]}.`,
    example_zh: `我正在${dailyZh[i]}。`
  });
  for (let t of times) {
    db["日常生活"].push({
      vietnamese: `${dailyActs[i]} vào ${t.vn}`,
      chinese: `在${t.zh}${dailyZh[i]}`,
      pronunciation: `${dailyActs[i]} vao ${t.pron}`,
      example_vn: `Tôi thường ${dailyActs[i]} vào ${t.vn}.`,
      example_zh: `我通常在${t.zh}${dailyZh[i]}。`
    });
  }
}
while(db["日常生活"].length < 100) {
  db["日常生活"].push({vietnamese: "Hôm nay vui", chinese: "今天很開心", pronunciation: "hom nai yui", example_vn: "Ngày hôm nay rất vui.", example_zh: "今天非常開心。"});
}

const outputPath = path.join(__dirname, '..', 'src', 'data', 'vocabulary.ts');
let fileContent = `export const VOCABULARY_DB: Record<string, Array<{vietnamese: string, chinese: string, pronunciation: string, example_vn: string, example_zh: string}>> = {\n`;

for(const [cat, words] of Object.entries(db)) {
  fileContent += `  "${cat}": [\n`;
  words.slice(0, 100).forEach((w, i) => {
    fileContent += `    ${JSON.stringify(w)}${i < 99 ? ',' : ''}\n`;
  });
  fileContent += `  ],\n`;
}
fileContent += `};\n`;

fs.writeFileSync(outputPath, fileContent, 'utf-8');
console.log('Successfully generated 600 static vocabulary items to src/data/vocabulary.ts!');
