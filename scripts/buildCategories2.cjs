const fs = require('fs');
const path = require('path');

function generateFile(categoryName, filename, rawData) {
  const lines = rawData.trim().split('\n').filter(l => l.trim().length > 0);
  const jsonArr = lines.map(line => {
    const [vn, zh, pron, ex_vn, ex_zh] = line.split('|');
    return {
      vietnamese: vn.trim(),
      chinese: zh.trim(),
      pronunciation: pron ? pron.trim() : '',
      example_vn: ex_vn ? ex_vn.trim() : '',
      example_zh: ex_zh ? ex_zh.trim() : ''
    };
  });
  
  if (jsonArr.length !== 100) {
     console.warn(`WARNING: ${categoryName} has ${jsonArr.length} items (expected 100)`);
  }

  const outPath = path.join(__dirname, '../src/data/categories', filename);
  const content = `export const ${categoryName} = ${JSON.stringify(jsonArr, null, 2)};\n`;
  fs.writeFileSync(outPath, content, 'utf-8');
  console.log(`Generated ${filename} with ${jsonArr.length} items.`);
}

const foodRaw = `
Ăn|吃|ăng|Tôi đang ăn phở.|我正在吃河粉。
Uống|喝|uống|Buổi sáng tôi hay uống cà phê.|早上我常喝咖啡。
Ngon|好吃/好喝|ngong|Trời ơi món này ngon quá!|天阿這道菜太好吃了！
Đói bụng|肚子餓|đói bọng (肚子唸bọng)|Tôi đói bụng rồi, đi ăn thôi.|我肚子餓了，去吃飯吧。
Khát nước|口渴|khác nước|Nóng quá, khát nước ghê.|太熱了，超口渴。
No rồi|飽了|no ròi|Cảm ơn anh, tôi ăn no rồi.|謝謝大哥，我吃飽了。
Chưa no|還沒飽|jưa no|Ăn một tô hủ tiếu chưa no.|吃一碗粿條還沒飽。
Thực đơn / Menu|菜單|thực đươn|Cho tôi đi xin cái menu xíu.|讓我拿一下菜單。
Món ăn|菜色/餐點|móng ăng|Món ăn ở đây đa dạng lắm.|這裡的菜色很多樣。
Gọi món|點餐|gọi móng|Dạ em ơi, cho gọi món nè.|(招呼服務生) 妹妹，我要點餐。
Tính tiền|結帳/買單|đính điềng|Dạ tính tiền bàn này giùm.|麻煩這桌結帳。
Mang về|外帶|mang yề|Dạ cho hai phần cơm tấm mang về.|給我兩份碎米飯外帶。
Ăn ở đây|內用|ăng ở đai|Anh ăn ở đây hay mang về?|大哥你要內用還是外帶？
Cơm tấm|碎米飯(南越特產)|gơm dấm|Sáng nào tui cũng ăn cơm tấm.|我每天早上都吃碎米飯。
Bún bò Huế|順化牛肉粉|búng bò huế|Nhà hàng kia bán bún bò Huế ngon.|那家餐廳順化牛肉粉好吃。
Hủ tiếu|粿條(南越特產)|hủ điếu|Cho tô hủ tiếu gõ đầy đủ.|給一碗料全加的敲擊粿條。
Phở bò|牛肉河粉|phở bò|Sang Việt Nam phải ăn phở bò.|來越南一定要吃牛肉河粉。
Phở tái|生牛肉河粉|phở đái|Tôi thích ăn phở tái hơn phở chín.|比起熟牛肉河粉我比較喜歡生牛。
Bánh mì chảo|鐵板法國麵包|bánh mì jảo|Hôm nay ăn thử bánh mì chảo đi.|今天試吃看鐵板法國麵包吧。
Bánh cuốn|腸粉|bánh guống|Một dĩa bánh cuốn chả lụa.|一盤豬肉捲腸粉。
Bún chả|烤肉米線|búng jả|Bún chả là món miền Bắc.|烤肉米線是北部的菜。
Bún riêu|蟹膏米線|búng riêu|Hôm qua mẹ tôi nấu bún riêu cua.|昨天我媽煮螃蟹米線。
Bánh xèo|越式煎餅|bánh xèo|Cuối tuần đổ bánh xèo ăn đê.|週末來煎越式煎餅吃吧。
Gỏi cuốn|越式生春捲|gỏi guống|Cho tôi năm cuốn gỏi cuốn.|給我五條越式生春捲。
Chả giò|炸春捲(南越說法)|jả yò|Chả giò chiên giòn rụm.|炸春捲炸得酥脆。
Thịt heo|豬肉|thịc heo|Món cơm phần có thịt heo quay.|便當有脆皮燒肉。
Thịt bò|牛肉|thịc bò|Thịt bò xào củ hành thơm quá.|洋蔥炒牛肉好香。
Thịt gà|雞肉|thịc gà|Tui khoái ăn cơm gà xối mỡ.|我喜歡吃炸雞腿飯。
Hải sản|海鮮|hải sảng|Chợ đó bán hải sản tươi sống.|那家市場有賣活海鮮。
Tôm|蝦子|đôm|Tôm nướng muối ớt cay lắm.|椒鹽烤蝦很辣。
Cá|魚|gá|Người Nam hay ăn cá lóc kho tộ.|南方人常吃砂鍋滷鱧魚。
Mực|魷魚/花枝|mực|Tối nay đi ăn mực nướng không?|今晚去吃烤魷魚嗎？
Trứng gà|雞蛋|jứng gà|Ốp la hai trứng gà nha cô.|阿姨，給我兩顆太陽煮蛋。
Cơm trắng|白飯|gơm jắng|Cho xin thêm một chén cơm trắng.|拜託多給我一小碗白飯。
Rau muống|空心菜|rau muống|Rau muống xào tỏi là món khoái khẩu.|蒜炒空心菜是我的最愛。
Canh chua|酸湯(南越名菜)|ganh jua|Canh chua cá lóc ăn với cơm là ghiền.|酸湯魚配飯吃會上癮。
Nước lèo|高湯/湯頭(南越說法)|nước lèo|Xin thêm một xíu nước lèo ạ.|請再給我一點高湯。
Nước mắm|魚露|nước mắm|Ăn cơm tấm phải có nước mắm chua ngọt.|吃碎米飯要有酸甜魚露。
Nước tương|醬油|nước dương|Cho miếng nước tương vô phở cho mặn.|加點醬油進河粉比較鹹。
Tương ớt|辣椒醬|dương ớc|Tương ớt này xịt vô bánh mì ngon nè.|這辣椒醬擠進法國麵包好吃。
Đường|糖|đường|Người miền Nam nấu ăn hay nêm đường.|南方人煮飯常加糖。
Muối|鹽|muối|Bỏ ít muối thôi, mặn lắm.|放少一點鹽，很鹹。
Tiêu|胡椒|điêu|Cho tui miếng tiêu cho thơm.|給我一點胡椒提香。
Bột ngọt|味精|bộc ngọc|Quán này xài nhiều bột ngọt.|這家店用很多味精。
Chanh|檸檬|janh|Dạ vắt nặn miếng chanh vô tô phở.|麻煩擠點檸檬在河粉裡。
Ớt|辣椒|ớc|Chị ơi có trái ớt tươi không?|姊姊有新鮮辣椒嗎？
Hành lá|蔥|hành lá|Em không ăn hành lá nha.|我不吃蔥喔。
Tỏi|大蒜|đỏi|Đập dập tép tỏi bỏ vô chảo.|拍碎一瓣蒜頭放進鍋裡。
Ngọt|甜|ngọc|Chè này ngọt vừa phải.|這甜品甜度剛好。
Mặn|鹹|mặng|Đồ ăn mặn quá, tui uống nước hoài.|食物太鹹了，我一直喝水。
Chua|酸|jua|Xoài này chua lét à.|這芒果酸溜溜的。
Cay|辣|gai|Phở này bỏ ớt cay muốn khóc.|這河粉加辣椒辣到想哭。
Đắng|苦|đắng|Cà phê đen nguyên chất hơi đắng.|黑咖啡原汁有點苦。
Lạt / Nhạt|清淡/沒味道|lạc|Trà đá này bị lạt rồi.|這冰茶變淡了。
Nóng|熱/燙|nóng|Tô bún đang còn nóng hổi.|米線碗還熱騰騰的。
Lạnh|冷/冰|lạnh|Cho xin ly nước lạnh.|請給我一杯冷水。
Cà phê đen|黑咖啡|gà fê đeng|Cho một ly cà phê đen đá.|給一杯冰黑咖啡。
Cà phê sữa đá|冰煉乳咖啡|gà fê sữa đá|Sài Gòn nổi tiếng cà phê sữa đá.|西貢的冰煉乳咖啡很有名。
Bạc xỉu|少咖啡多煉乳(南越特色)|bạc sỉu|Ai không uống đắng thì uống bạc xỉu.|不喝苦的人就喝Bạc Xỉu。
Sinh tố|冰沙/果汁牛奶|sin dố|Cho một sinh tố bơ.|給我一杯酪梨冰沙。
Nước ép|果汁(純)|nước ép|Tôi thích uống nước ép cam nguyên chất.|我喜歡喝純柳橙汁。
Trà sữa|珍珠奶茶|jà sữa|Tụi nhỏ rất thích uống trà sữa.|年輕人很喜歡喝珍奶。
Trà chanh|檸檬茶|jà janh|Ra lề đường uống trà chanh chém gió.|去路邊喝檸檬茶聊是非。
Trà đá|冰茶|jà đá|Trà đá ở quán ăn thường miễn phí.|餐館的冰茶通常免費。
Bia|啤酒|bia|Tối nay ra quán nhậu uống vài chai bia.|今晚去熱炒店喝幾瓶啤酒。
Rượu|酒(烈酒)|rượu|Ông ấy tối ngày uống rượu say xỉn.|他整天喝酒醉醺醺。
Nước ngọt|汽水|nước ngọc|Con nít uống nhiều nước ngọt không tốt.|小孩喝太多汽水不好。
Đá|冰塊|đá|Cho tui thêm cục đá vô ly.|幫我加塊冰進杯子裡。
Trái cây|水果|jái gâi|Ăn trái cây cho đẹp da.|吃水果讓皮膚變好。
Chuối|香蕉|juối|Chuối chiên là món ăn vặt ngon.|炸香蕉是好吃的零食。
Táo|蘋果|đáo|Mua được mấy trái táo đỏ ngon chát.|買到幾顆很好吃的紅蘋果。
Cam|橘子/柳橙|gam|Cam Vĩnh Long ngọt lắm.|永隆的橘子很甜。
Dưa hấu|西瓜|yưa hấu|Mùa nóng ăn dưa hấu giải nhiệt.|熱天吃西瓜消暑。
Xoài|芒果|soài|Xoài keo chấm muối mặn ngọt.|熟芒果沾甜鹹鹽。
Sầu riêng|榴槤|sầu riên|Nhiều người nước ngoài sợ mùi sầu riêng.|很多外國人怕榴槤味。
Đu đủ|木瓜|đu đủ|Canh đu đủ hầm xương.|大骨燉木瓜湯。
Nhãn|龍眼|nhãn|Trái nhãn lồng này ngọt lịm.|這龍眼甜滋滋的。
Măng cụt|山竹|măng gục|Măng cụt chua chua ngọt ngọt.|山竹酸酸甜甜的。
Dừa|椰子|yừa|Uống nước dừa tươi vừa mát vừa khỏe.|喝新鮮椰子水又涼又健康。
Chén|小碗|jén|Nhà tui rửa chén dùng nước rửa chén Sunlight.|我家洗碗用陽光洗碗精。
Dĩa / Đĩa|盤子(念yĩa)|yĩa|Xếp đồ ăn lên dĩa cho đẹp.|把食物排在盤子上好看點。
Đũa|筷子|đũa|Anh làm rớt đôi đũa rồi kìa.|你弄掉一雙筷子了。
Muỗng / Thìa|湯匙(南越稱muỗng)|muỗng|Cho em xin cái muỗng ăn cơm.|給我一根吃飯的湯匙。
Nĩa|叉子|nĩa|Cho một cái nĩa để ăn bít tết.|給一把叉子吃牛排。
Ly/Cốc|杯子(南越常說ly)|ly|Dô! Cạn ly nào!|乾杯！喝光！
Ống hút|吸管|ống húc|Dùng ống hút giấy bảo vệ môi trường.|使用紙吸管保護環境。
Khăn giấy|衛生紙/面紙|khăng yấy|Xin hỏi khăn giấy để đâu vậy?|請問衛生紙放哪裡？
Tăm xỉa răng|牙籤|đăm sỉa răng|Ăn xong xỉa răng bằng tăm.|吃完用牙籤剃牙。
Chay|素食|jai|Mùng 1 tháng nào gia đình tui cũng ăn chay.|每個月初一我家都吃素。
Mặn (đồ ăn)|葷食|mặng|Hôm nay tui ăn mặn, không ăn chay.|今天我吃葷，不吃素。
Dị ứng|過敏|yị ứng|Tôi bị dị ứng với tôm cua.|我對蝦蟹過敏。
Không đá|去冰|khom đá|Dạ cà phê sữa không đá nha.|冰煉乳咖啡去冰喔。
Ít đường|少糖|íc đường|Sinh tố ít đường thôi nha em.|果汁少糖就好喔。
Không cay|不辣|khom gai|Tui ăn không cay được không cô?|阿姨我可以不要加辣嗎？
Nướng|烤|nướng|Thịt ba rọi nướng thơm phức.|烤五花肉香噴噴。
Chiên|炸/煎(南越用法)|jiêng|Cơm chiên hột gà đê.|雞蛋炒飯來囉。
Xào|炒|sào|Mì xào hải sản là món tủ.|海鮮炒麵是拿手菜。
Hấp|蒸|hấp|Cá diêu hồng hấp xì dầu.|醬油蒸紅魚。
Luộc|水煮|luộc|Gà luộc chấm muối tiêu chanh.|水煮雞沾胡椒檸檬鹽。
Kho|滷/燉|kho|Thịt kho hột vịt ngày Tết.|過年吃的滷肉滷鴨蛋。
`;

const transportRaw = `
Đi đâu đó?|去哪裡？|đi đao đó|Anh ơi, sáng nay đi đâu đó?|大哥，今天早上要去哪呀？
Đường|路/街道|đường|Đường này bây giờ kẹt xe lắm.|這條路現在很塞。
Xe hơi|汽車|se hơi|Nhà ổng mới mua xe hơi.|他家剛買汽車。
Xe máy|機車(南越唸se mai)|se máy|Ở Sài Gòn người ta đi xe máy rất nhiều.|在西貢人們常騎機車。
Xe đạp|腳踏車|se đạp|Buổi chiều tôi hay đạp xe đạp ra công viên.|下午我常騎腳踏車去公園。
Xe buýt|公車|se bít|Trạm xe buýt này có đi về bến xe Miền Đông không?|這公車站有去東部客運站嗎？
Taxi|計程車|đắc si|Kêu taxi ra sân bay giùm.|幫忙叫計程車去機場。
Xe ôm|傳統載客機車|se ôm|Giờ ít ai đi xe ôm truyền thống.|現在很少人搭傳統xe ôm了。
Xe công nghệ|網約車/科技機車(Grab等)|se gông nghệ|Book xe công nghệ cho lẹ và rẻ.|叫網約車比較快又便宜。
Máy bay|飛機|mái bai|Tôi sẽ đi máy bay ra Hà Nội.|我搭飛機會去河內。
Tàu hỏa / Xe lửa|火車|đàu hỏa/se lửa|Đi xe lửa từ Nam ra Bắc mất mấy ngày.|搭火車從南到北要幾天。
Phà|渡輪|fà|Người miền Tây đi lại thường qua phà.|西部人交通常搭渡輪。
Bến xe|客運站/公車站|bếng se|Anh chở tui ra bến xe Miền Tây nha.|你載我去西部客運站喔。
Sân bay|機場|sâng bai|Sân bay Tân Sơn Nhất hôm nay đông lắm.|新山一機場今天很多人。
Trạm xăng|加油站|jạm xăng|Dừng lại ở trạm xăng để tui đổ xăng xíu.|停在加油站讓我加個油。
Đổ xăng|加油|đổ xăng|Đổ đầy bình nha anh.|幫我加滿喔大哥。
Kẹt xe|塞車|gẹc se|Giờ cao điểm kẹt xe dữ lắm.|尖峰時段塞車超嚴重。
Tai nạn|車禍/意外|đai nạng|Phía trước có tai nạn giao thông.|前面有交通事故。
Công an|警察|gông ang|Công an giao thông đang bắt xe kìa.|交警在那邊抓車(開單)了。
Mũ bảo hiểm|安全帽(南越也叫nón bảo hiểm)|mũ bảo hiểm|Nhớ đội mũ bảo hiểm khi đi xe máy.|騎機車記得戴安全帽。
Bằng lái xe|駕照|bằng lái se|Xin xuất trình bằng lái xe!|請出示駕照！
Đèn đỏ|紅燈|đèng đỏ|Vượt đèn đỏ là vi phạm luật.|闖紅燈是違規的。
Đèn xanh|綠燈|đèng sanh|Đèn xanh rồi kìa, chạy đi!|綠燈了，快騎！
Chạy|騎(車)/跑/開(車)|jạy|Chạy xe cẩn thận nha!|騎車/開車小心點喔！
Lái xe|開車(汽車)|lái se|Tôi biết lái xe hơi.|我會開汽車。
Đi bộ|走路|đi bộ|Từ đây qua đó đi bộ chừng 5 phút.|從這裡走過去大約五分鐘。
Qua đường|過馬路|wa đường|Dắt tay con qua đường nè.|牽著小孩的手過馬路。
Vỉa hè|人行道|yỉa hè|Lề đường, vỉa hè bị lấn chiếm hết.|路肩、人行道都被佔用了。
Đi thẳng|直走|đi thẳng|Anh cứ đi thẳng đường này là tới.|你就直走這條路就到了。
Quẹo phải|右轉(南越常用Quẹo)|wẹo phải|Tới ngã ba anh quẹo phải dùm.|到三岔路口麻煩右轉。
Quẹo trái|左轉|wẹo jái|Đừng có quẹo trái ở đây, cấm đó!|別在這裡左轉，禁轉！
Quay lại|迴轉|wai lại|Chạy lấn quá rồi, quay lại vòng xoay.|騎過頭了，回去圓環那迴轉。
Dừng lại|停車/停住|yừng lại|Dừng lại ngay góc cây đó nha.|在那棵樹旁邊停下來喔。
Đậu xe|停車(Parking)|đậu se|Ở đây không cho đậu xe đâu.|這裡不給停車的。
Lạc đường|迷路|lạc đường|Chết, hình như tụi mình bị lạc đường rồi.|糟了，看來我們迷路了。
Gần đây|在這附近|gen đai|Nhà hàng đó ở gần đây không?|那間餐廳在附近嗎？
Xa lắm|很遠|sa lắm|Chỗ đó xa lắm, đi bộ hổng nổi đâu.|那地方很遠，走不到的。
KM / Cây số|公里|gây số|Từ Sài Gòn xuống Cần Thơ mất trăm rưỡi cây số.|從西貢到芹苴要150公里。
Tốc độ|速度|đốc độ|Đoạn đường này giới hạn tốc độ 60.|這段路速限60。
Đường cao tốc|高速公路|đường gao đốc|Cao tốc Long Thành - Dầu Giây mới mở.|龍城油椰高速公路新開的。
Hẻm|巷子(南越特色)|hẻm|Xe vô hẻm nhỏ hơi khó xíu.|車進小巷子有點難。
Ngã ba|三岔路口|ngã ba|Tới ngã ba rẽ trái là thấy chùa.|到三岔路口左轉就看到寺廟。
Ngã tư|十字路口|ngã tư|Đợi đèn đỏ ở ngã tư này hơi lâu.|在這個十字路等紅燈有點久。
Vòng xoay|圓環/交流道|yòng xoai|Đi hết vòng xoay quẹo phải.|繞過圓環右轉。
Hầm vượt|地下道|hầm yược|Chạy qua hầm vượt sông Sài Gòn.|穿越西貢河隧道。
Cầu|橋|gầu|Sài Gòn có nhiều cây cầu lớn.|西貢有很多大橋。
Đường một chiều|單行道|đường mộc jiều|Coi chừng, đường này đường một chiều đó!|小心，這條是單行道！
Lề đường|路邊|lề đường|Đậu xe sát lề đường để người ta đi.|車停靠路邊讓別人過。
Bảng chỉ đường|路標|bảng jỉ đường|Nhìn bảng chỉ đường đi theo mũi tên.|看路標跟著箭頭走。
Chậm lại|慢一點|jậm lại|Chạy chậm lại xíu anh ơi.|騎慢一點啦老哥。
Nhanh lên|快一點|nhang lên|Nhanh lên kẻo trễ tàu bây giờ.|快一點不然趕不上火車了。
Bóp kèn|按喇叭(南越說法)|bóp gèng|Đừng bóp kèn ồn ào quá.|別一直按喇叭太吵了。
Kính chiếu hậu|後照鏡|gính jiếu hậu|Nhớ coi kính chiếu hậu trước khi quẹo.|轉彎前記得看後照鏡。
Đăng kiểm|驗車|đăng giểm|Xe này sắp tới hạn đăng kiểm rồi.|這台車快到驗車期限了。
Thủng lốp / Bể bánh|爆胎(南越常說bể bánh xe)|bể bánh se|Xui quá, đang đi thì bể bánh xe.|真衰，騎到一半爆胎。
Sửa xe|修車|sửa se|Gần đây có tiệm sửa xe nào không?|這附近有修車店嗎？
Bơm xe|打氣|bơm se|Ghé vô lề bơm bánh xe cái đã.|靠邊停先幫輪胎打氣。
Rửa xe|洗車|rửa se|Xe dơ quá, chiều nay đi rửa xe.|車太髒，下午去洗車。
Thuê xe|租車|thuê se|Mình thuê xe máy đi du lịch Tà Phớ.|我們租機車去茶葩玩吧。
Tiền taxi|計程車費|điềng đắc si|Hết bao nhiêu tiền taxi vậy chú?|計程車費共多少錢阿叔？
Tiền xe|車費|điềng se|Tui trả tiền xe cho.|我來付車費。
Bản đồ|地圖|bảng đồ|Mở bản đồ Google Maps lên coi.|打開Google地圖看一下。
Định vị|導航/定位|định yị|Gửi định vị qua Zalo cho tui đi.|把定位傳Zalo給我。
Chuyến đi|旅程/班次|juyến đi|Chuyến bay này sẽ cất cánh lúc 3 giờ.|這班次飛機會在三點起飛。
Ga tàu|火車站|ga đàu|Ga Sài Gòn nằm ở quận 3.|西貢火車站在第三郡。
Chỗ ngồi|座位|jỗ ngòi|Xin lỗi, chỗ ngồi này có người chưa?|請問這座位有人了嗎？
Vé xe|車票|yé se|Mua vé xe về quê ăn Tết.|買回鄉下過年的車票。
Đặt vé|訂票|đặc yé|Tui đặt vé máy bay qua mạng rồi.|我在網路訂好機票了。
Sốt ruột|焦急(等車/塞車用)|sốc ruộc|Kẹt xe nãy giờ sốt ruột quá.|塞車塞半天急死人了。
Say xe|暈車|sai se|Tôi hay bị say xe khi đi xe khách.|我搭客運常暈車。
Buồn nôn|想吐|buồng nôn|Uống thuốc say xe để khỏi buồn nôn.|吃暈車藥才不會想吐。
Nghỉ ngơi|休息(途中)|ngỉ ngơi|Tài xế tấp vô trạm dừng chân nghỉ ngơi.|司機開進休息站休息。
Xuống xe|下車|suống se|Xin cho tui xuống xe ở ngã tư này.|請讓我在這個十字路口下車。
Lên xe|上車|lên se|Mọi người lên xe giùm em nha.|請大家上車喔。
Chờ xe|等車|jờ se|Đang đứng chờ xe buýt sắp tới chưa.|站在這等公車快到了沒。
Chuyển tuyến|轉車|juyểng duyếng|Đi tới ngã ba rồi chuyển tuyến xe số 8.|到三叉路口然後轉8號公車。
Thắng xe|煞車(南越用法)|thắng se|Anh đạp thắng xe gấp quá tui giật mình.|你緊急煞車嚇我一跳。
Đề máy|發動引擎|đề mái|Nhấn nút đề máy xe lên.|按下按鈕發動機車。
Chân chống|駐車架(側柱/中柱)|jâng jống|Gạt chân chống lên chưa kìa?|側柱踢起來了沒阿？
Đuôi xe|車尾|đuôi se|Đụng trúng đuôi xe người ta rồi.|撞到別人的車尾了。
Biển số xe|車牌|biểng số se|Xe anh biển số xe là mấy?|你車牌號碼幾號？
Giấy tờ xe|行照/車籍資料|yấy đờ se|Quên mang theo giấy tờ xe rồi.|忘記帶行照出門了。
Chủ xe|車主|jủ se|Làm phiền gọi người chủ xe ra dời xe xíu.|麻煩叫車主出來移車一下。
Mở cửa|開門(車門)|mở gửa|Mở cửa xe hơi cẩn thận đụng xe máy.|開汽車門小心撞到機車。
Đóng cửa|關門|đóng gửa|Leo lên xe nhớ đóng cửa lẹ.|上車記得快點關門。
Ghế sau|後座|ghế sao|Tui ngồi ghế sau cho khỏe.|我坐後座比較舒服。
Lái xe cẩn thận|小心駕駛|lái se gẩn thậng|Trời mưa lái xe cẩn thận nhe.|下雨天開車小心捏。
Đường hầm|隧道|đường hầm|Xe máy không được qua đường hầm này.|機車不能過這條隧道。
Chỉ đường|指路/報路|jỉ đường|Có rảnh hông, chỉ đường tui ra chợ Bến Thành.|有空嗎，報路教我怎麼去濱城市場。
Dài|長|yài|Con đường này dài thòng.|這條路長得很。
Ngắn|短|ngắng|Đi đường hẻm này ngắn hơn.|走這條短巷比較快。
Qua cầu|過橋|wa gầu|Chạy bộ qua cầu chữ Y là tới.|慢跑過Y字橋就到了。
Dưới cầu|橋下|yưới gầu|Chỗ dưới cầu hay kẹt xe lố bịch.|橋下那邊常荒謬大塞車。
Khu vực|區域|khu yực|Khu vực này cấm bấm còi.|這個區域禁止按喇叭。
Phạt|罰款/開單|fạc|Hôm qua vượt đèn đỏ bị công an phạt.|昨天闖紅燈被交警開單。
Nhanh nhất|最快|nhang nhấc|Đi đường nào nhanh nhất vậy anh?|走哪條路最快阿大哥？
Gần nhất|最近|gen nhấc|Đổ xăng ga ra gần nhất ở đâu?|最近的加油站在哪？
Hướng nào?|哪個方向？|hướng nào|Đi hướng nào mới tới sân bay?|走哪個方向才到機場？
Đi dạo|散步|đi dạo|Tối nay ra phố đi bộ Nguyễn Huệ đi dạo.|今晚去阮惠徒步區散步。
Chuyến cuối|末班車|juyến guối|Nhanh lên, đây là chuyến cuối trong ngày.|快點，這是今天的末班車了。
`;

generateFile('food', 'food.ts', foodRaw);
generateFile('transport', 'transport.ts', transportRaw);
