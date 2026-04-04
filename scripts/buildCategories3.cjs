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

const shoppingRaw = `
Mua|買|mua|Tui muốn mua bó rau muống.|我想買一把空心菜。
Bán|賣|báng|Chỗ này có bán thẻ cào điện thoại không?|這裡有賣電話卡嗎？
Chợ|傳統市場|jợ|Mỗi sáng má hay đi chợ Bến Thành.|每天早上媽常去濱城市場。
Siêu thị|超市|siêu thị|Cuối tuần cả nhà hay vô siêu thị mua sắm.|週末全家常去超市購物。
Cửa hàng|商店/店家|gửa hàng|Cửa hàng tiện lợi kế bên nhà mở 24 giờ.|家旁邊的便利商店開24小時。
Tiền|錢|điềng|Tui hổng đem theo tiền mặt.|我沒帶現金。
Đắt / Mắc|貴(南越說mắc)|mắc|Cái áo này mắc quá xá!|這件衣服太貴了吧！
Rẻ|便宜|rẻ|Hôm nay đi chợ mua được đồ rẻ.|今天去市場買到便宜的。
Trả giá|殺價/討價還價|jả yá|Đi chợ Bến Thành là phải biết trả giá.|去濱城市場一定要會殺價。
Bớt đi|算便宜點/減價|bớc đi|Cô ơi bớt cho con xíu đi.|阿姨算我便宜一點啦。
Vừa vặn|合身|yừa yặng|Thử coi đôi giày này mang vừa vặn không.|試看看這雙鞋穿著合不合腳。
Rộng|寬/大|rộng|Cái quần này eo hơi rộng.|這條褲子腰太寬了。
Chật|緊/窄|jậc|Cái áo sơ mi vứt máy giặt riết bị chật.|襯衫被洗衣機洗到變緊了。
Đổi trả|退換貨|đổi jả|Hàng mua rồi có được đổi trả không em?|買了的商品可以退換嗎？
Kích cỡ / Size|尺寸|gích gỡ|Anh mặc áo size gì?|你穿什麼尺寸的衣服？
Màu sắc|顏色|màu sắc|Cái đầm này có màu sắc khác không?|這件裙子有別的顏色嗎？
Thử đồ|試穿|thử đồ|Phòng thử đồ nằm ở góc đằng kia.|試穿間在那個角落。
Tính tiền|結帳|đính điềng|Dạ ra quầy tính tiền giùm em nha.|麻煩到櫃檯結帳喔。
Hóa đơn|發票/收據|hóa đươn|Xin giữ lại hóa đơn để bảo hành.|請保留收據以便保固。
Tiền lẻ|零錢/散鈔|điềng lẻ|Anh có tiền lẻ thối hông?|你找得開零錢嗎？
Thối tiền|找錢|thối điềng|Cô ơi chưa thối tiền cho con nữa.|阿姨妳還沒找錢給我。
Tiền boa|小費|điềng boa|Bên này người ta không nhận tiền boa.|這邊人不收小費的。
Khuyến mãi|促銷/打折|khuyếng mãi|Siêu thị đang có chương trình khuyến mãi.|超市正在辦促銷活動。
Giảm giá|打折|yảm yá|Món này giảm giá ba mươi phần trăm.|這件打七折。
Bao nhiêu?|多少？|bao nhiêu|Cho hỏi cái giỏ này giá bao nhiêu?|請問這個包包多少錢？
Cái này|這個|gái này|Tui lấy cái này nha.|我要拿這個喔。
Cái kia|那個|gái gia|Làm ơn lấy cái kia xuống dùm tui.|麻煩幫我把那個拿下來。
Hàng mới|新貨|hàng mới|Mẫu này là hàng mới về đó.|這款是剛到的新貨。
Hết hàng|沒貨了|hết hàng|Dạ xin lỗi mẫu đó hết hàng rồi.|抱歉那款已經沒貨了。
Đắt hàng|熱賣/生意好|đắc hàng|Chúc chị mua may bán đắt hàng nha.|祝姊姊生意興隆(大賣)。
Gói lại|包起來|gói lại|Gói lại giùm tui nha, để làm quà tặng.|幫我包起來喔，要做禮物的。
Xem thử|看看/隨便看|sem thử|Tui chỉ xem thử thôi chứ chưa mua.|我只是隨便看看還沒要買。
Để tôi xem|讓我看看|để dôi sem|Để tui coi lại xem mang vừa không.|讓我再看穿不穿得下。
Chất lượng|品質|jấc lượng|Giá hơi mắc nhưng chất lượng ok.|價格有點貴但品質過關。
Hàng giả|假貨|hàng yả|Mua ngoài chợ trời cẩn thận dính hàng giả.|路邊攤買小心買到假貨。
Hàng thật|正品|hàng thật|Cửa hàng này bảo đảm bán hàng thật.|這家店保證賣正品。
Bảo hành|保固|bảo hành|Điện thoại này được bảo hành một năm.|這支手機保固一年。
Thẻ tín dụng|信用卡|thẻ đính yụng|Chỗ mình có quẹt thẻ tín dụng không em?|這裡可以刷信用卡嗎？
Quẹt thẻ|刷卡|wẹc thẻ|Máy quẹt thẻ nãy giờ bị lỗi rồi.|刷卡機剛剛出錯了。
Chuyển khoản|轉帳(南越日常常用)|juyểng khoảng|Anh quét mã QR chuyển khoản nha.|大哥你掃QR code轉帳喔。
Rút tiền|提款|rúc điềng|Tui phải ghé cây ATM rút tiền mặt ra.|我得停提款機領個現金。
Túi ni lông|塑膠袋|đúi ni lông|Cho tui xin cái bịch ni lông.|給我個薄塑膠袋。
Túi giấy|紙袋|đúi yấy|Sử dụng túi giấy cho thân thiện môi trường.|用環境友善的紙袋。
Đắt tiền|昂貴|đắc điềng|Mấy món đồ hiệu thường rất đắt tiền.|名牌貨通常很昂貴。
Sành điệu|時髦|sành điệu|Cái mắt kính này nhìn sành điệu ghê.|這副眼鏡看起來好時髦。
Quần áo|衣服|wầng áo|Shop này bán quần áo nam nữ nhập khẩu.|這間店賣進口男女裝。
Áo thun|T恤|áo thun|Tui khoái mặc áo thun cho thoải mái.|我喜歡穿T恤比較舒服。
Áo sơ mi|襯衫|áo sơ mi|Mặc áo sơ mi đi làm trông lịch sự.|穿襯衫去上班看起來得體。
Quần tây|西裝褲|wầng đai|Mua cái quần tây đi tiệc đám cưới.|買條西裝褲去吃喜酒。
Quần sọt|短褲(從Shorts音譯)|wầng sọc|Đi dạo công viên mặc quần sọt mát mẻ.|去公園散步穿短褲涼快。
Đầm / Váy|洋裝/裙子|đầm/yái|Cái đầm đó mặc đi đám cưới là xuất sắc.|那件洋裝穿去婚禮超讚。
Đồ lót|內衣褲|đồ lóc|Khu vực bán đồ lót nằm trên lầu hai.|賣內衣褲的區域在二樓。
Giày|鞋子|yài|Đôi giày này mang êm chân. |這雙鞋穿了腳不痛。
Dép|拖鞋/涼鞋|yép|Trời mưa mang dép lê lội nước.|下雨天穿拖鞋涉水。
Giày thể thao|運動鞋|yài thể thao|Đôi giày thể thao này chạy bộ rất tốt.|這雙運動鞋拿來跑步很好。
Túi xách|手提包(女包)|đúi sách|Túi xách hàng hiệu thường đắt tiền.|名牌的包包常常很貴。
Balo|後背包|ba lô|Đeo balo đi học vừa gọn vừa tiện.|背後背包上學既輕且方便。
Đồng hồ|手錶|đồng hồ|Ông đó đeo đồng hồ Thụy Sĩ sang quá.|他戴瑞士錶看起來好氣派。
Kính mát|太陽眼鏡|gính mác|Sài Gòn nắng gắt nhớ đeo kính mát.|西貢太陽烈出門記得戴墨鏡。
Mũ / Nón|帽子(南越常叫Nón)|nóng|Mặc áo dài phải đội nón lá.|穿傳統越服要戴斗笠。
Trang sức|首飾/珠寶|jang sức|Tiệm vàng bán trang sức đủ loại.|銀樓賣各式各樣的首飾。
Nhẫn|戒指|nhẵng|Nhẫn kim cương mua tặng cầu hôn.|買這鑽戒去求婚。
Dây chuyền|項鍊|yây juyềng|Dây chuyền vàng dạo này lên giá.|黃金項鍊最近漲價了。
Mỹ phẩm|化妝品|mỹ fẩm|Nước hoa rẻ thì không phải mỹ phẩm xịn đâu.|便宜的香水不會是高級化妝品。
Son môi|口紅|son môi|Màu son môi này hợp với da của em.|這口紅顏色很配妳的皮膚。
Kẹo|糖果|gẹo|Hồi nhỏ tui hảo ăn kẹo nên sâu răng.|小時候我貪吃糖所以蛀牙。
Bánh quy|餅乾|bánh wi|Tặng ba hộp bánh quy nhân dịp Tết.|趁過年送爸爸一盒餅乾。
Nước suối|礦泉水/白開水|nước suối|Cô ơi cho một chai nước suối ướp lạnh.|阿姨給我一罐冰礦泉水。
Thuốc lá|香菸|thuốc lá|Hút nhiều thuốc lá bị ung thư phổi.|抽太多香菸會得肺癌。
Đồ dùng|日用品|đồ yùng|Tui đi siêu thị mua ít đồ dùng trong nhà.|我去超市買點家用日用品。
Hóa phẩm|化學洗劑|hóa fẩm|Bên đó khu bán bột giặt với hóa phẩm.|那邊是賣洗衣粉跟洗潔劑的。
Kem đánh răng|牙膏|gem đánh răng|Kem đánh răng tuýp nhỏ bỏ đem đi du lịch.|旅行帶小包裝牙膏。
Khăn tắm|浴巾|khăng đắm|Đừng dùng chung khăn tắm coi chừng lây bệnh.|別共用浴巾小心傳染。
Chăn ga|床單/被子(南越叫 mền mùng)|mềng mùng|Giặt mền mùng sạch sẽ để ngủ cho sướng.|把棉被洗乾淨睡得才爽。
Đồ điện tử|電子產品|đồ điệng dử|Siêu thị máy lạnh điện tử lớn lắm.|那間冷氣電器商城很大。
Điện thoại|手機|điệng thoại|Điện thoại tui mới bể màn hình rồi.|我的手機螢幕剛摔破了。
Sạc dự phòng|行動電源|sạc yự fòng|Xin mượn sạc dự phòng xíu, hết pin rồi.|借一下行動電源，沒電了。
Ốp lưng|手機殼|ốp lưng|Kiếm mua cái ốp lưng cao su.|找個便宜的橡膠手機殼。
Tai nghe|耳機|đai nghe|Ngồi cà phê mang tai nghe nghe nhạc.|坐咖啡廳戴耳機聽音樂。
Máy lạnh|冷氣|mái lạnh|Kêu thợ vô vệ sinh máy lạnh.|叫師傅來洗冷氣。
Tủ lạnh|冰箱|đủ lạnh|Cất thịt heo vô trong tủ lạnh.|把豬肉收進冰箱。
Quạt máy|電風扇|wạc mái|Mùa nóng sài quạt máy không đủ màng.|夏天吹電扇不夠涼。
Tivi|電視|đi yi|Khai trương cửa hàng mua tivi mới.|慶祝開店買新電視。
Máy giặt|洗衣機|mái yặc|Máy giặt bị rò nước rồi.|洗衣機漏水了。
Lò vi sóng|微波爐|lò yi sóng|Bỏ cơm hộp vô lò vi sóng hâm nóng.|把飯盒丟微波爐加熱。
Đồ chơi|玩具|đồ jơi|Cấm khóc, không mua đồ chơi đâu nha!|不准哭，不會買玩具給你的！
Mua sắm|購物|mua sắm|Mấy chị phụ nữ khoái đi dạo mua sắm.|女人家超愛去逛街購物。
Hội chợ|園遊會/特賣展|hội jợ|Cuối tuần này quận 7 có hội chợ ẩm thực.|週末第七郡有美食展。
Sổ xố|彩券/大樂透(南越叫vé số)|yé số|Sáng nào ra quán cũng mua vé số.|每天早上出門喝茶必買彩票。
Nhà thuốc|藥房/藥局(南越叫tiệm thuốc tây)|điệm thuốc đây|Ra tiệm thuốc tây mua thuốc cảm.|去藥局買感冒藥。
Thuốc tây|西藥|thuốc đây|Uống thuốc tây nhiều bị lờn thuốc.|吃太多西藥會產生抗藥性。
Thực phẩm chức năng|保健食品|thực fẩm jức năng|Thực phẩm chức năng này hỗ trợ giấc ngủ.|這保健品有助於睡眠。
Vitamin|維他命|yi đa min|Nên bổ sung nhiều vitamin C để tăng sức|該多補充維他命C增加抵抗。
Công ty|公司|gông di|Công ty tui cuối năm thưởng một tháng lương.|我公司年底發一個月年終。
Trạm thu phí|收費站|jạm thu fí|Tới trạm thu phí chuẩn bị vé nha.|到收費站準備票喔。
Vé vào cổng|門票|yé yào gổng|Khu du lịch này phải mua vé vào cổng 50 ngàn.|這景區要買門票五十千。
Bảo hiểm|保險|bảo hiểm|Đã mua bảo hiểm y tế cho cả nhà.|幫全家買了醫療險。
Lấy lại tiền|退款|lấy lại điềng|Tôi không bằng lòng, muốn lấy lại tiền.|我不滿意，要求退款。
Gian lận|詐騙/欺騙|yang lậng|Đừng nạp thẻ, cẩn thận kẻ gian lận.|別儲值卡，小心遇詐騙。
Thiệt thòi|吃虧|thiệc thòi|Mua bán mà ép giá thì thiệt thòi người nông dân.|買賣壓價的話農民就吃虧了。

`;

const dailyRaw = `
Ngủ dậy|起床(南越常說thức dậy)|thức yậy|Sáng tui thức dậy lúc sáu giờ.|早上我六點鐘起床。
Đánh răng|刷牙|đánh răng|Nhớ đánh răng thật kỹ nha nhóc.|小鬼記得要認真刷牙。
Rửa mặt|洗臉|rửa mạc|Buổi sáng rửa mặt bằng nước lạnh cho tỉnh.|早上用冷水洗臉比較清醒。
Tắm|洗澡|đắm|Tắm lẹ lẹ còn chuẩn bị đi làm.|洗快一點還要準備出門上班。
Thay đồ|換衣服|thai đồ|Đứng chờ xíu nha, tui đang thay đồ.|等一下喔，我在換衣服。
Ăn sáng|吃早餐|ăng sáng|Sáng nay ăn sáng món gì?|今天早餐吃什麼？
Uống nước|喝水|uống nước|Mỗi ngày nên uống hai lít nước lọc.|每天應該喝兩公升過濾水。
Đi làm|去上班|đi làm|Tôi lái xe máy đi làm mỗi ngày.|我每天騎機車去上班。
Mở máy tính|開電腦|mở mái đính|Vừa tới văn phòng là mở máy tính liền.|一到辦公室就馬上開電腦。
Làm việc|工作/做事|làm yiệc|Tôi làm việc trong công ty đồ gỗ.|我在木材公司上班。
Nghỉ trưa|午休|ngỉ jưa|Làm thêm một tiếng nữa mới nghỉ trưa.|再做一個小時才午休。
Họp|開會/會議|họp|Đang trong cuộc họp, không tiện nghe điện thoại.|在開會不方便接電話。
Hút thuốc|抽煙|húc thuốc|Khu vực này cấm hút thuốc.|這個區域禁止抽菸。
Nói chuyện|聊天/講話|nói juyệng|Hai chị em đang ngồi nói chuyện phím.|兩姊妹正在閒聊。
Đồng nghiệp|同事|đồng nghiệp|Đồng nghiệp rủ đi nhậu sau giờ làm.|下班同事揪喝酒。
Công việc|工作|gông yiệc|Công việc dạo này bận bù đầu.|最近工作忙得焦頭爛額。
Tan ca / Ra về|下班|đan ga/ra yề|Tám giờ tối mới tan ca ra về.|晚上八點才下班回家。
Tập thể dục|做運動|đập thể yục|Tối nào tôi cũng ra công viên tập thể dục.|每晚我都去公園運動。
Đi dạo|散步|đi dạo|Dắt chó đi dạo vòng vòng chung cư.|牽狗在公寓附近散步。
Xem tivi|看電視|sem đi yi|Ba tôi thích ngồi xem tivi buổi tối.|我爸晚上喜歡坐著看電視。
Lướt web|上網(南越常說lướt điện thoại)|lước điệng thoại|Ngủ không được nên lướt điện thoại chờ sáng.|睡不著只好滑手機等天亮。
Nghe nhạc|聽音樂|nghe nhạc|Vừa dọn nhà vừa nghe nhạc sàn cho sung.|邊打掃邊聽電音比較嗨。
Nấu cơm|煮飯|nấu gơm|Tối nay để tôi nấu cơm cho.|今晚讓我來煮飯。
Rửa chén|洗碗|rửa jén|Ăn xong nhớ phụ rửa chén nghe chưa?|吃完記得幫忙洗碗聽到沒？
Giặt đồ|洗衣服|yặc đồ|Bỏ vô máy giặt hết đống đồ đó đi.|把那堆衣服全丟進洗衣機吧。
Phơi đồ|曬衣服|fơi đồ|Trời đang nắng gắt đem đồ ra phơi cho mau khô.|趁大太陽拿去曬才快乾。
Gấp đồ|摺衣服(南越說xếp đồ)|sếp đồ|Phơi xong thì xếp đồ cất vô tủ đi.|曬完就把衣服摺進衣櫃。
Quét nhà|掃地|wéc nhà|Lấy cây chổi quét nhà giùm tao cái.|拿把掃把幫我掃個地。
Lau nhà|拖地|lau nhà|Nhỏ em đang lau nhà đằng trước.|我妹在前面拖地。
Đổ rác|倒垃圾|đổ rác|Xe rác tới rồi, cầm bọc rác đi đổ lẹ.|垃圾車來了，快拿垃圾袋去倒。
Ngủ trưa|睡午覺|ngủ jưa|Trưa ngủ chút xíu để chiều có sức cày.|中午小憩一下下午才有力氣拚。
Chuẩn bị|準備|juẩng bị|Tôi đang chuẩn bị tài liệu cho cuộc họp.|我正在準備會議資料。
Đi siêu thị|去逛超市|đi siêu thị|Cuối tuần cả xóm rủ nhau đi siêu thị xả stress.|週末全村去逛超市抒壓。
Đón con|接小孩|đón gon|Chiều nay tôi phải về sớm để đi đón con.|今天下午我要提早走去接小孩。
Đi chợ|去傳統市場|đi jợ|Đi chợ buổi sáng sẽ lựa được thịt tươi.|早上去市場能挑到新鮮的肉。
Trang điểm|化妝|jang điểm|Chị gái tôi đang trang điểm đi tiệc đám cưới.|我姊姊正在化妝準備去喜宴。
Cạo râu|刮鬍子|gạo râu|Ba ngày rồi tôi chưa cạo râu.|我已經三天沒刮鬍子了。
Sấy tóc|吹頭髮|sấy dóc|Gội đầu xong thì nhớ sấy tóc kẻo lạnh.|洗完頭記得吹頭髮免得感冒。
Khó ngủ|失眠/難睡|khó ngủ|Dạo này già ròi cứ trằn trọc khó ngủ.|最近老了老是翻來覆去失眠。
Thuốc cảm|感冒藥|thuốc gảm|Đi mua vài viên thuốc cảm sổ mũi.|去買幾片感冒鼻水藥。
Bệnh nha/Ốm|生病/破病|bệnh|Bị dầm mưa nên hôm nay bệnh rồi.|淋到雨所以今天破病了。
Nhức đầu|頭痛|nhức đàu|Suy nghĩ nhiều tới mức nhức đầu luôn.|想太多想到頭痛。
Đau bụng|肚子痛|đao bọng|Ăn hải sản bậy bạ xong bị đau bụng nè.|亂吃海鮮結果肚子痛捏。
Uống thuốc|吃藥(越南說喝藥)|uống thuốc|Nhớ 5h chiều uống thuốc đều đặn nhe.|記得下午五點按時吃藥喔。
Thăm bệnh|探病|thăm bệnh|Chủ nhật đi bệnh viện thăm bệnh ông dượng.|禮拜天帶去醫院探阿丈的病。
Kiểm tra sức khỏe|健康檢查|giểm ja sức khwe|Mỗi năm công ty tổ chức khám kiểm tra sức khỏe.|公司每年安排勞工健康檢查。
Đọc sách|看書|đọc sách|Thói quen tôi là hay đọc sách trước khi ngủ.|我的習慣是睡前看書。
Nghe đài|聽廣播|nghe đài|Tài xế hay nghe đài trên kênh VOV giao thông.|司機常聽VOV交通廣播頻道。
Gọi điện thoại|打電話|gọi điệng thoại|Gọi điện thoại lại xác nhận với khách liền.|馬上打電話跟客人再次確認。
Nhắn tin|傳簡訊/傳訊息|nhắng đing|Ban đêm đừng nhắn tin báo thức người ta.|半夜不要傳訊息吵人睡覺。
Kiểm tra email|收信/查信|giểm ja e meo|Sếp mới kêu tôi kiểm tra email khách hàng.|老闆剛叫我查客戶信件。
Cười|笑|gười|Nhìn mặt ông ấy hài hước làm tôi buồn cười.|他長得很逗趣讓我忍不住發笑。
Khóc|哭|khóc|Đừng nhắc lại nữa mắc công nhỏ khóc.|別提了不然惹那女娃哭。
Mệt mỏi|疲憊|mệt mỏi|Chạy ngoài đường cả ngày mệt mỏi rã rời.|在外跑了一整天累壞了。
Vui vẻ|開心/快樂|yui yẻ|Không khí gia đình lúc nào cũng vui vẻ.|家庭氛圍總是充滿快樂。
Tức giận|生氣(南越說bực mình)|bực mình|Sáng sớm đã quạu bực mình chửi thề rồi.|大清早就在生氣發牢騷爆粗口。
Trễ giờ|遲到|jễ yờ|Trời ơi lại vô ca trễ giờ nữa ròi!|天阿又要趕不上打卡遲到了！
Sớm|早|sớm|Hôm nay tui tới trạm xe khá sớm.|今天我蠻早到車站。
Xin nghỉ phép|請假|sin ngỉ fép|Bữa nay bệnh nên xin nghỉ phép một ngày.|今天破病所以請一天假。
Làm thêm giờ|加班(南越說tăng ca)|đăng ga|Cuối năm việc nhiều nên phải đăng ca liên tục.|年底事多得連續加班。
Mưa|下雨|mưa|Sài Gòn mùa này chiều nào cũng hay mưa to.|西貢這季節每天下午常大雨。
Nắng|大太陽/晴天|nắng|Ra đường nhớ mặc áo khoác chứ nắng cháy da.|出門記得穿外套不然會曬傷。
Gió|風|yó|Lên Vũng Tàu hóng gió biển mát mẻ.|去頭頓吹涼爽的海風。
Lạnh|冷/涼|lạnh|Trời Đà Lạt mờ sương lạnh teo buốt.|大叻天氣多霧且冷得刺骨。
Bật đèn|開燈|bậc đèng|Trời hơi tối rồi, bật đèn lên dùm cái.|天有點黑了，幫忙開個燈。
Tắt đèn|關燈|đắt đèng|Gần 12h đêm rồi dọn dẹp tắt đèn đi ngủ.|快半夜12點了收拾好關燈睡覺。
Mở nhạc|放音樂/開音樂|mở nhạc|Khách vô đông rồi tới lúc mở nhạc xập xình.|客人多了是時候開咚滋的音樂。
Khóa cửa|鎖門|khóa gửa|Đi ra ngoài nhớ chốt lại khóa cửa chèn sắt nha.|出門記得扣緊鎖住鐵門喔。
Quên chìa khóa|忘記帶鑰匙|wên jiều khóa|Tôi bị kẹt ở ngoài do quên chìa khóa trong nhà.|我被鎖在外面因為鑰匙忘在家。
Gõ cửa|敲門|gõ gửa|Trước khi vào phòng giám đốc thì phải gõ cửa.|進經理辦公室前要先敲門。
Đánh rơi|弄掉/遺失|đánh rơ|Hình như tụi mình đánh rơi ví ở đâu thì phải.|好像我們的皮夾掉在哪裡了。
Tìm kiếm|尋找/找東西|đìm giếm|Tìm kiếm nãy giờ gần nửa tiếng không thấy cái remote.|找遙控器找了半小都沒找到。
Sửa chữa|修理|sửa jữa|Sửa chữa cái ống nước gãy trong phòng vệ sinh.|修理廁所裡破掉的水管。
Thay pin|換電池|thai bing|Cho em mua 2 cục thay pin vô cái đồng hồ này.|幫我換兩顆這手錶電池。
Sạch sẽ|乾淨|sạch sể|Chủ nhà trọ thích người thuê gọn gàng sạch sẽ.|房東喜歡整齊愛乾淨的房客。
Dơ bẩn|髒亂|yơ bẩng|Nhà vệ sinh công cộng hôi thối dơ bẩn lắm.|公共廁所很臭又髒。
Thơm|香|thơm|Mùi cà phê rang xay thơm quá.|研磨咖啡豆的味道真香。
Hụt hơi|喘不過氣(累)|hục hơi|Leo thang bộ lên lầu sáu thở hụt hơi.|爬樓梯到六樓喘到不行。
Thức khuya|熬夜/晚睡|thức khuya|Dân IT dạo này thường thức khuya lướt mạng xăm soi.|工程師常熬夜上網查資料。
Hẹn giờ|設鬧鐘/定時|hẻng yờ|Nhớ hẹn giờ báo thức sáu rưỡi sáng nha.|記得設定明早六點半的鬧鐘。
Vội vàng|急匆匆/很趕|yội yàng|Đi đâu mà phóng xe vội vàng quá rứa?|騎車急匆匆是要去哪呀？
Từ từ|慢慢來|dừ dừ|Cơm bưng nước rót cứ từ từ mà ăn.|飯都盛好水也倒滿了就慢慢吃。
Hối hả|催促/急迫|hối hả|Đừng hối hả thúc giục nó nữa.|別一直催促逼迫他啦。
Rảnh rỗi|閒暇/空閒|rảnh rỗi|Ở quê người ta có thời gian rảnh rỗi trồng trọt thêm.|鄉下人有多餘閒暇來種地。
Chăm sóc|照顧|jăm sóc|Mẹ tui phải nghĩ làm ở nhà chăm sóc cho nội.|我媽不得不辭職在家照顧奶奶。
Đón khách|接客/迎接客人|đón khác|Xe đò dạo này vắng khách ế ẩm, đón khách khó khăn.|客運最近沒人搭，接客很難。
Nuôi chó|養狗|nuôi jó|Bả khoái nuôi chó nhưng lại làm biếng dọn cứt.|她愛養狗卻又懶得清狗大便。
Tưới cây|澆水|dưới gâi|Ông nội chiều chiều cầm bình đi tưới cây kiểng.|爺爺傍晚拿著噴壺去澆盆栽。
Sắp xếp|整理/安排|sắp sếp|Mai tụi mình phải sắp xếp lại bộ bàn ghế phòng khách.|明天我們得重新整理客廳沙發桌。
Chuyển nhà|搬家(南越說dọn nhà)|yọng nhà|Cuối tuần này tui dọn nhà qua quận Bình Thạnh.|這個週末我要搬家去平盛郡。
Trả tiền điện|繳電費(南越說đóng tiền)|đóng điềng|Sáng mai tranh thủ ra bách hóa đóng tiền điện nước nha.|明早抽空去百貨繳水電費。
Đăng ký|註冊/登記|đăng gí|Nhân viên mới cần lấy giấy đăng ký làm vé xe tháng.|新進職員要拿單子登記辦月票。
Xóa|刪除(南越也說bỏ)|bỏ|Tải đầy bộ nhớ rồi, cái nào không dùng thì xóa bớt.|抓太滿了，沒用的就刪減一下。
Gửi|寄送/發送(傳訊息)|gởi|Tôi sẽ gửi tài liệu này qua email cho chị tham khảo.|我會用Email把這封資料寄給妳看。
Học bài|複習功課|họk bài|Gần thi rồi lo mà cắm đầu vô bàn ngồi học bài.|快考試了還不乖乖坐去書桌讀書。
Dạy học|教書/教學|yạy họk|Hồi đó tui từng đi dạy học phụ đạo môn toán.|以前我曾經當過數學補習班老師。
Chấm điểm|打分數/評改|jấm điểm|Cô ơi nhớ châm trước chấm điểm nhẹ tay thôi nghe.|老師喔記得手下留情打分數。
Kể chuyện|講故事/聊天|gể juyệng|Hôm qua đám bạn tui tụ họp kể chuyện ma xuyên đêm.|昨天那群損友聚會聊整晚鬼故事。
Tham gia|參加/參與|tham ya|Bạn có đăng ký tham gia chạy marathon năm nay không?|你今年有報名參加馬拉松嗎？
Hoạt động|活動|hoặc động|Hội đồng môn hay tổ chức nhiều hoạt động từ thiện mạnh mẽ.|校友會常舉辦有力度的慈善活動。
`;

generateFile('shopping', 'shopping.ts', shoppingRaw);
generateFile('daily', 'daily.ts', dailyRaw);
