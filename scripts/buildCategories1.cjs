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

const greetingsRaw = `
Chào anh|你好(男前輩)|jào ang|Chào anh, anh khỏe không?|大哥你好，你好嗎？
Chào chị|你好(女前輩)|jào ji|Chào chị, lâu quá không gặp.|姐妳好，好久不見了。
Chào em|你好(弟妹晚輩)|jào em|Chào em, hôm nay đi học vui không?|你好，今天上學開心嗎？
Chào bạn|你好(平輩朋友)|jào bạng|Chào bạn, cuối tuần vui vẻ!|你好，週末愉快！
Chào cô|你好(女性長輩/老師)|jào go|Dạ con chào cô ạ.|(禮貌) 阿姨/老師 您好。
Chào chú|你好(男性長輩)|jào ju|Dạ cháu chào chú mới tới.|(禮貌) 叔叔您好，剛到啊。
Chào mọi người|大家好|jào mọy ngừi|Chào mọi người, tôi mới tới.|大家好，我剛到。
Xin chào|你好(正式通用)|sin jào|Xin chào quý khách.|您好(對顧客)。
Cảm ơn|謝謝|gảm eng|Cảm ơn bạn rất nhiều.|非常感謝你。
Cảm ơn anh|謝謝你(男前輩)|gảm eng ang|Cảm ơn anh đã giúp đỡ.|謝謝大哥的幫忙。
Cảm ơn chị|謝謝妳(女前輩)|gảm eng ji|Cảm ơn chị nhiều nha.|多謝姐啦。
Không có chi|不客氣(南越常用)|khom gó ji|Dạ không có chi đâu.|不會啦，不客氣。
Xin lỗi|對不起/不好意思|sin lỗi|Xin lỗi, tôi đến trễ một chút.|不好意思，我遲到了一會兒。
Thật ngại quá|真不好意思|thật ngai wa|Thật ngại quá, làm phiền anh rồi.|真不好意思，麻煩你了。
Không sao đâu|沒關係|khom sao đao|Dạ không sao đâu, chuyện nhỏ mà.|沒關係的，小事一樁。
Tạm biệt|再見|dạm biệc|Tạm biệt, hẹn gặp lại.|再見，下次見。
Đi nha|先走囉(道別)|đi nha|Tui đi nha, mai gặp!|我走囉，明天見！
Hẹn mai gặp|明天見|hẻng mai gạp|Hẹn mai gặp lại ở công ty nha.|明天公司見喔。
Về nha|回去囉(道別)|yề nha|Thôi trễ rồi, tui về nha.|不早了，我先回去囉。
Ngủ ngon|晚安(睡前)|ngủ ngong|Chúc mọi người ngủ ngon.|祝大家晚安。
Khỏe không?|好嗎？(問候)|khwe khom|Dạo này bạn khỏe không?|你最近好嗎？
Vẫn khỏe|還不錯(健康)|yẫn khwe|Cảm ơn, tôi vẫn khỏe.|謝謝，我挺好的。
Bình thường|普普通通|bình thừơng|Giờ công việc cũng bình thường thôi.|現在工作也就普普通通啦。
Nghe nói|聽說|nghe nói|Nghe nói dạo này bạn bận lắm hả?|聽說你最近很忙啊？
Lâu quá không gặp|好久不見|lâu wa khom gạp|Lâu quá không gặp, dạo này sao rồi?|好久不見，最近怎麼樣？
Dạo này sao rồi?|最近如何？|dạo này sao ròi|Công việc dạo này sao rồi em?|最近工作怎麼樣？
Cũng được|還可以|gũng đươk|Mọi chuyện cũng được, không có gì lạ.|事情都還可以，沒什麼特別的。
Sắp tới|接下來/即將|sắp dới|Sắp tới có dự định gì chưa?|接下來有什麼打算了嗎？
Có rảnh không?|有空嗎？|gó rảnh khom|Tối nay anh có rảnh không?|今晚你有空嗎？
Rảnh|有空|rảnh|Tối nay tôi rảnh rỗi nè.|今晚我有空喔。
Bận|忙|bậng|Xin lỗi, hôm nay tôi hơi bận.|抱歉，我今天有點忙。
Rất vui được gặp|很高興認識你|rất yui đươk gạp|Rất vui được gặp bạn hôm nay.|今天很高興認識你。
Tôi tên là|我叫做|dôi đên là|Xin tự giới thiệu, tôi tên là Minh.|自我介紹一下，我叫明。
Anh tên gì?|大哥叫什麼名字？|ang đên gì|Cho hỏi anh tên gì ạ?|請問大哥叫什麼名字？
Bao nhiêu tuổi?|幾歲？|bao nhiêu đuổi|Năm nay bạn bao nhiêu tuổi rồi?|你今年幾歲了？
Tôi đến từ|我來自|dôi đến dừ|Tôi đến từ Đài Loan.|我來自台灣。
Chúc mừng|恭喜|júc mừng|Chúc mừng năm mới!|新年快樂(恭喜新年)！
Sinh nhật vui vẻ|生日快樂|sin nhậc yui yẻ|Chúc bạn sinh nhật vui vẻ nha.|祝你生日快樂喔。
May mắn nha|祝好運|mai mắn nha|Chúc đi đường may mắn nha.|祝你一路順風(好運)喔。
Cứ tự nhiên|別客氣/當自己家|gứ dử nhiên|Cứ tự nhiên như ở nhà nha.|當自己家一樣別拘束喔。
Mời ngồi|請坐|mời ngòi|Dạ mời vào, mời anh ngồi.|請進，請坐。
Ăn cơm chưa?|吃飽沒？(南部俗常問候)|ăng gơm jưa|Vừa đi làm về hả, ăn cơm chưa?|剛下班啊，吃飯沒？
Đã ăn rồi|吃過了|đã ăng ròi|Tôi đã ăn rồi, cảm ơn anh.|我吃過了，謝謝。
Chưa ăn|還沒吃|jưa ăng|Tôi bận quá nên chưa ăn gì hết.|我太忙了所以什麼都還沒吃。
Bạn đi đâu đó?|你去哪裡呀？|bạng đi đao đó|Ê, chuẩn bị đi đâu đó?|欸，準備去哪裡呀？
Đi làm|去上班|đi làm|Tôi đang trên đường đi làm.|我正在去上班的路上。
Đi chơi|去玩/去逛|đi jơi|Cuối tuần tôi hay đi chơi với bạn.|週末我常跟朋友去玩。
Đang làm gì đó?|在做什麼呢？|đang làm gì đó|Rảnh không, đang làm gì đó?|有空嗎，在幹嘛呢？
Thôi|算了/停|thôi|Thôi, đừng nói nữa.|好了/算了，別再說了。
Đúng rồi|對了(贊同)|đúng ròi|Đúng rồi, chính xác là vậy đó.|對了，確切就是這樣。
Tôi hiểu rồi|我懂了|dôi hiểu ròi|À, tôi hiểu ròi, cảm ơn.|啊，我明白了，謝謝。
Không hiểu|不懂|khom hiểu|Xin lỗi, tôi không hiểu anh nói gì.|抱歉，我不懂你說什麼。
Nói lại|再說一遍|nói lại|Bạn có thể nói lại lần nữa không?|你可以再說一遍嗎？
Nói chậm lại|說慢一點|nói jậm lại|Vui lòng nói chậm lại một chút giùm.|麻煩請說慢一點點。
Giúp tôi với|幫幫我|yúp dôi yới|Có ai không, giúp tôi với!|有沒有人啊，幫幫我！
Chờ chút|等一下|jờ jút|Chờ chút xíu nha, tôi ra liền.|等一下喔，我馬上出去。
Tính sao?|怎麼辦(算)？|đính sao|Giờ chuyện này tính sao đây?|現在這件事該怎麼辦？
Sao cũng được|隨便/都可以|sao gũng đươk|Ăn gì cũng được, sao cũng được.|吃什麼都可以，隨便。
Chắc chắn|確定/肯定|jắc jắng|Tôi chắc chắn là nó đã đến rồi.|我肯定他已經來了。
Hình như|好像|hình như|Hình như trời sắp mưa rồi.|好像快要下雨了。
Thật không?|真的嗎？|thật khom|Cái đó là sự thật không vây?|那個是真的嗎？
Trời ơi|天啊|jời ơi|Trời ơi, nóng dễ sợ!|天啊，熱得很可怕！
Dễ sợ|可怕(語助調強調)|yễ sợ|Món này mắc dễ sợ.|這道菜超貴(貴得可怕)。
Rất tốt|很好|rất dốt|Kế hoạch này thực sự rất tốt.|這個計畫確實很好。
Hay quá|太棒了|hai wa|Ý tưởng của bạn hay quá!|你的點子太棒了！
Xuất sắc|出色/優秀|suất sắc|Anh ấy làm việc xuất sắc lắm.|他工作非常出色。
Giỏi ghê|好厲害|yỏi ghê|Trẻ con bây giờ thông minh giỏi ghê.|現在的小孩聰明真厲害。
Chán|無聊/煩|ján|Ngồi ở nhà hoài chán quá.|一直待在家好無聊。
Mệt|累|mệt|Làm việc cả ngày mệt rã rời.|工作了一整天累壞了。
Vui quá|好開心|yui wa|Hôm nay đi chơi vui quá xá.|今天出去玩超開心的。
Tuyệt vời|太完美了|duyệt yời|Một buổi tối thật tuyệt vời.|一個如此完美的夜晚。
Yên tâm|放心|yên dâm|Cứ yên tâm, tôi sẽ lo hết.|放心吧，我會全包辦的。
Đừng lo|別擔心|đừng lo|Đừng lo lắng, mọi chuyện sẽ ổn thôi.|別擔心，一切都會好起來的。
Cẩn thận|小心|gẩn thậng|Đi đường cẩn thận nha.|路上小心喔。
Nguy hiểm|危險|nguy hiểm|Chỗ đó rất nguy hiểm, đừng qua.|那個地方很危險，別過去。
Giữ gìn sức khỏe|保重身體|yữ yìn sức khwe|Thời tiết lạnh rồi, nhớ giữ gìn sức khỏe.|天氣冷了，記得保重身體。
Chúc may mắn|祝你好運|júc mai mắn|Ngày mai thi tốt nha, chúc may mắn.|明天考試順利喔，祝你好運。
Đồng ý|同意|đồng ý|Tôi hoàn toàn đồng ý với anh.|我完全同意你的看法。
Không đồng ý|不同意|khom đồng ý|Xin lỗi nhưng tôi không đồng ý chuyện này.|抱歉但我不同意這件事。
Biết rồi|知道了|biếc ròi|Dạ tôi biết rồi, sẽ làm liền.|好我知道了，馬上做。
Chưa biết|還不知道|jưa biếc|Giờ tôi cũng chưa biết tính sao nữa.|現在我也還沒頭緒怎麼辦。
Giỡn hả?|開玩笑嗎？|yỡn hả|Anh đang nói giỡn hả?|你在開玩笑嗎？
Nói thiệt|說真的|nói thiệc|Nói thiệt nha, tôi không thích anh ta.|說真的啦，我不喜歡他。
Ủa|咦(表驚訝)|ủa|Ủa, anh mới cắt tóc hả?|咦，你剛剪頭髮阿？
Dạ|是/好(南部禮貌對長輩)|yạ|Dạ, để con lấy cho.|好的，讓我來拿。
Sợ|害怕|sợ|Trời tối thui, tôi sợ ma lắm.|天黑黑，我很怕鬼。
Ghét|討厭|ghét|Tôi ghét ăn hành lắm.|我超討厭吃蔥。
Yêu|愛|yêu|Em yêu anh nhiều lắm.|我很愛你。
Nhớ|想念/記得|nhớ|Nhớ mua đồ ăn tự mang về nha.|記得買食物自己帶回來喔。
Quên|忘記|wên|Chết cha, tui quên mang ví rồi.|糟了，我忘記帶錢包了。
Cố gắng|努力|gố gắng|Năm nay tôi sẽ cố gắng học tiếng Việt.|今年我會努力學越文。
Thành công|成功|thành gông|Chúc dự án của bạn thành công rực rỡ.|祝你的專案大獲成功。
Hôn|親吻|hôm|Cho anh hôn một cái được không?|讓我親一個好嗎？
Ôm|擁抱|ôm|Lại đây ôm cái coi.|過來抱一下吧。
Cười|笑|gười|Nhìn mặt nó mắc cười quá.|看他的臉超好笑的。
Khóc|哭|khóc|Đừng có khóc nữa mà.|別再哭了好嗎。
Bực mình|生氣/煩躁|bực mình|Kẹt xe nãy giờ bực mình ghê.|塞車塞半天有夠煩躁。
Hài lòng|滿意|hài lòng|Khách hàng rất hài lòng về dịch vụ.|客人對服務非常滿意。
Quan trọng|重要|wang trọng|Gia đình là quan trọng nhất.|家庭是最重要的。
`;

const numbersRaw = `
Không|零|khôm|Số điện thoại của tôi bắt đầu bằng số không.|我的電話號碼以零開頭。
Một|一|mộc|Cho tôi một ly trà đá.|給我一杯冰茶。
Hai|二|hai|Hai vé xem phim, làm ơn.|請給我兩張電影票。
Ba|三|ba|Nhà tôi có ba người.|我家有三個人。
Bốn|四|bốn|Bàn đó có bốn cái ghế.|那桌有四張椅子。
Năm|五|năm|Hôm nay là mùng năm.|今天是初五。
Sáu|六|sáu|Bây giờ là sáu giờ sáng.|現在早上六點。
Bảy|七|bảy|Mỗi tuần có bảy ngày.|每週有七天。
Tám|八|tám|Tối nay tám giờ hẹn nha.|今晚八點約喔。
Chín|九|chín|Tháng này là tháng chín.|這個月是九月。
Mười|十|mười|Cái này mười ngàn.|這個一萬(盾)。
Mười một|十一|mười mộc|Xe buýt số mười một sắp tới.|十一號公車快到了。
Mười hai|十二|mười hai|Bây giờ là mười hai giờ trưa.|現在是中午十二點。
Mười lăm|十五|mười lăm|Đợi mười lăm phút nữa nha.|再等十五分鐘喔。
Hai mươi|二十|hai mươi|Anh ấy hai mươi tuổi.|他二十歲。
Ba mươi|三十|ba mươi|Gói xôi này ba mươi ngàn.|這包糯米飯三萬。
Bốn mươi|四十|bốn mươi|Mẹ tôi năm nay bốn mươi tuổi.|我媽今年四十歲。
Năm mươi|五十|năm mươi|Đem theo năm mươi ngàn là đủ.|帶五十千就夠了。
Sáu mươi|六十|sáu mươi|Ông ấy hơn sáu mươi tuổi rồi.|他超過六十歲了。
Một trăm|一百|mộc jăm|Cho tôi đổi một trăm đô la.|請幫我換一百美金。
Hai trăm|兩百|hai jăm|Đôi giày này hai trăm ngàn.|這雙鞋二十萬盾。
Năm trăm|五百|năm jăm|Thối lại anh năm trăm đồng.|找你五百盾。
Ngàn / Nghìn|千(南越慣用ngàn)|ngàng|Một ly cà phê hai mươi ngàn.|一杯咖啡兩萬。
Mười ngàn|一萬(南越念10千)|mười ngàng|Mười ngàn một ổ bánh mì.|一萬盾一顆法國麵包。
Một trăm ngàn|十萬(南越念100千)|mộc jăm ngàng|Cái áo này một trăm ngàn.|這件衣服十萬。
Một triệu|一百萬|mộc jiệu|Chiếc xe này giá hai mươi triệu.|這台車兩千萬。
Nửa|一半|nửa|Cho tui nửa trái dưa hấu.|給我半顆西瓜。
Gấp đôi|雙倍|gấp đôi|Năm nay doanh thu tăng gấp đôi.|今年營收翻倍。
Đầu tiên|第一/首先|đầu điêng|Đây là lần đầu tiên tôi tới Sài Gòn.|這是我第一次來西貢。
Thứ hai|星期一(或第二)|thứ hai|Hôm nay là thứ hai, phải đi làm.|今天是禮拜一，要去上班。
Thứ ba|星期二(或第三)|thứ ba|Thứ ba tuần sau tôi rảnh.|下週二我有空。
Thứ tư|星期三(或第四)|thứ dư|Hẹn gặp vào thứ tư nha.|禮拜三見喔。
Thứ năm|星期四(或第五)|thứ năm|Thứ năm có cuộc họp quan trọng.|禮拜四有重要會議。
Thứ sáu|星期五|thứ sáu|Mỗi tối thứ sáu hay đi nhậu.|每週五晚上常去喝酒。
Thứ bảy|星期六|thứ bảy|Thứ bảy được nghỉ làm.|禮拜六放假。
Chủ nhật|星期天|jủ nhậc|Chủ nhật cả nhà đi siêu thị.|禮拜天全家去超市。
Cuối tuần|週末|guối duầng|Cuối tuần này đi chơi Vũng Tàu không?|這週末去頭頓玩嗎？
Ngày mai|明天|ngài mai|Ngày mai trời sẽ nắng ấm.|明天天氣會溫暖晴朗。
Ngày mốt|後天|ngài mốt|Ngày mốt chúng ta mới gặp lại.|後天我們才再見面。
Hôm nay|今天|hom nai|Hôm nay món canh chua hơi mặn.|今天的酸湯有點鹹。
Hôm qua|昨天|hom wa|Hôm qua tôi ở nhà ngủ cả ngày.|昨天我整天在家睡覺。
Hôm kia|前天|hom gia|Hôm kia tôi lỡ làm rớt bóp.|前天我不小心弄掉錢包了。
Sáng|早上|sáng|Sáng nào tui cũng uống cà phê.|每天早上我都喝咖啡。
Trưa|中午|jưa|Buổi trưa thường ăn cơm tấm.|中午通常吃碎米飯。
Chiều|下午|jiều|Bốn giờ chiều đi đón con.|下午四點去接小孩。
Tối|晚上|dối|Buổi tối đường Nguyễn Huệ đông lắm.|晚上阮惠街人很多。
Đêm|深夜|đêm|Ban đêm trời hơi se lạnh.|深夜天氣微涼。
Khuya|半夜|khuya|Chạy xe ban khuya cẩn thận nha.|半夜騎車小心點喔。
Giờ|點鐘/小時|yờ|Bây giờ là mấy giờ rồi?|現在幾點了？
Phút|分鐘|fúc|Chạy tới đó mất khoảng ba mươi phút.|騎到那大概30分鐘。
Giây|秒鐘|yây|Còn mười giây nữa đổi đèn đỏ.|還有十秒就換紅燈了。
Tiếng đồng hồ|小時(口語)|điếng đồng hồ|Tôi đã đợi hai tiếng đồng hồ rồi.|我已經等兩個小時了。
Rưỡi|半(時間用)|rưỡi|Tám giờ rưỡi vô làm.|八點半進公司上班。
Kém|差(時間用)|gém|Chín giờ kém mười lăm tao tới.|差十五分九點我就到了。
Bao lâu rồi?|多久了？|bao lâu ròi|Anh ở Việt Nam bao lâu rồi?|你在越南多久了？
Bao nhiêu?|多少？|bao nhiêu|Cho hỏi cái này bao nhiêu rứa?|請問這個多少呢？
Cỡ chừng / Khoảng|大約|gỡ jừng|Tôi mất khoảng một tiếng để nấu ăn.|我花大約一小時煮飯。
Mấy giờ?|幾點？|mấy yờ|Mấy giờ mình đi xem phim được?|幾點我們可以去看電影？
Ngày|天/日|ngài|Một ngày tôi uống hai lít nước.|我一天喝兩公升水。
Tháng|月|tháng|Tháng mười hai trời mát mẻ.|十二月天氣涼爽。
Năm|年|năm|Chúc mừng năm mới an khang.|祝你新年安康。
Tuần|週|duầng|Một tuần có bảy ngày.|一週有七天。
Đầu tháng|月初|đầu tháng|Vừa đầu tháng đã hết tiền.|才剛月初就沒錢了。
Cuối tháng|月底|guối tháng|Cuối tháng này tôi lãnh lương.|這個月底我發薪水。
Quý|季|wý|Doanh số quý một giảm.|第一季業績下降。
Mùa xuân|春天|mùa suâng|Mùa xuân hoa đào nở rộ.|春天桃花盛開。
Mùa hè|夏天|mùa hè|Mùa hè ở Sài Gòn rất nóng.|西貢的夏天非常熱。
Mùa thu|秋天|mùa thu|Mùa thu Hà Nội rất đẹp.|河內的秋天很美。
Mùa đông|冬天|mùa đông|Miền Nam không có mùa đông.|南部沒有冬天。
Giáng sinh|聖誕節|yáng sin|Mùa lễ Giáng sinh đường phố đông vui.|聖誕節街上熱鬧。
Tết|春節(過年)|đết|Gần tới Tết rồi, phải lo dọn nhà thôi.|快過年了，該打掃房子了。
Sinh nhật|生日|sin nhậc|Hôm nay là sinh nhật của con tui.|今天是我小孩的生日。
Kỷ niệm|紀念|gỷ niệm|Ngày mai là ngày kỷ niệm cưới.|明天是結婚紀念日。
Một chút|一點點|mộc jút|Làm ơn cho xin một chút ớt.|拜託給我一點辣椒。
Nhiều|多|nhiều|Món này tui bỏ nhiều đường quá.|這菜我放太多糖了。
Ít|少|íc|Ăn ít cơm lại để giảm cân.|少吃點飯來減肥。
Hết|全部/結束|hết|Tui làm xong hết việc rồi.|我事情全做完了。
Còn|還有|gòng|Chỗ này còn ghế trống không?|這裡還有空位嗎？
Đủ|夠|đủ|Cơm phần này tui ăn đủ no rồi.|這份飯我吃夠飽了。
Thiếu|缺/不夠|thiếu|Hình như thiếu một đôi đũa.|好像少了一雙筷子。
Thêm|增加/多加|thêm|Cô ơi cho con thêm bịch nước lèo.|阿姨給我多一袋湯。
Bao lớn?|多大？|bao lớn|Căn phòng này bao lớn vậy?|這房間多大呀？
Bao xa?|多遠？|bao xa|Từ đây tới quận Nhất bao xa?|從這到第一郡多遠？
Số lượng|數量|số lượng|Số lượng khách quá đông.|客人的數量太多了。
Kích cỡ|尺寸|gích gỡ|Cái áo này kích cỡ hơi nhỏ.|這件衣服尺寸有點小。
Cái / Chiếc|個/件(量詞)|gái/jiếc|Cho tôi ba cái bánh bao.|給我三個包子。
Ly / Cốc|杯(南越常用ly)|ly|Cho mượn cái ly xíu.|借一下杯子。
Chai|瓶|jai|Anh ơi, lấy thêm hai chai bia.|大哥，再拿兩瓶啤酒。
Tô|大碗(南越用法)|đô|Sáng ăn một tô hủ tiếu gõ.|早上吃了一碗麵。
Chén|小碗(南越用法)|jén|Lấy thêm một chén cơm trắng.|多拿一小碗白飯。
Đĩa / Dĩa|盤子(南越常唸yĩa)|yĩa|Cho tôi một dĩa cơm sườn nướng.|給我一盤烤排骨飯。
Hộp|盒|hộp|Mua ba hộp cơm mang về.|買三個便當帶走。
Phần|份|phầng|Cho tui tính tiền ba phần này.|幫我算這三份的錢。
Gói|包|gói|Hút hết một gói thuốc lá.|抽完了一包菸。
Chục|十個(量詞)|jục|Bán cho con nửa chục trứng gà.|賣我半打(五顆)雞蛋。
Ký / Kilogram|公斤|gý|Bán cho em một ký bơ sáp.|賣我一公斤酪梨。
Lít|公升|lít|Xe tui đổ đầy ba lít xăng.|我機車加滿三公升汽油。
Khối|塊/立方|khối|Gỗ này mua bao nhiêu một khối?|這木頭買一立方多少錢？
Lạng|百克(傳統度量)|lạng|Cá này giá hai chục ngàn một lạng.|這魚一百克兩萬。
Chút xíu|一點點(極少)|jút xíu|Vị lẩu này hơi cay một chút xíu.|這火鍋稍微有一點點辣。
`;

generateFile('greetings', 'greetings.ts', greetingsRaw);
generateFile('numbers', 'numbers.ts', numbersRaw);
