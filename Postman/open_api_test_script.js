
pm.test("Status code is 200", ()=> {//Check status code is 200
    pm.response.to.have.status(200); 
    });
if (pm.response.code = 200) {//if response failed, end all the following process
    const response = pm.response.json();

    const promotionid = response.response.voucher_id
    pm.collectionVariables.set("Open_API_created_VoucherID", promotionid)

const Ajv = require("ajv") //request AJC library
const ajv = new Ajv({logger: console}) //request AJC library
pm.test('Schema is valid', ()=> { //check cheduma
    pm.expect(ajv.validate(response_schema, response)).to.be.true;
    });
const response_error = response.error //delare the response_error here for later use, to decide if need request codeing monkey
pm.test('"error" checked', ()=> { //Check "error"
    pm.expect(response_error).to.equal(expecting_error);
    });
pm.test('"message" checked', ()=> { //Check "message"
    var error_message = response.message
    pm.expect(error_message).to.equal(expecting_message);
    });

const call_monkey = () => { //Conver the Coding Monkey tool returning info to JSON format, as the alternative of Database check
        const env = pm.environment.get("env")
        const Country = pm.environment.get("Country")
        const admin_csrftoken = pm.environment.get('admin_csrf_token'); 
        const admin_sessionid = pm.environment.get('admin_session_id')
pm.sendRequest({
            url: `https://admin${env}.shopee.${Country}/system/tools/${promotionid}/`,
            method: 'get',
            header: {
                'sec-ch-ua': '"Google Chrome";v="87", "\\"Not;A\\\\Brand";v="99", "Chromium";v="87"', 
                'Accept': 'application/json, text/javascript, */*; q=0.01', 
                'X-CSRFToken': admin_csrftoken, 
                'X-Requested-With': 'XMLHttpRequest', 
                'sec-ch-ua-mobile': '?0', 
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.66 Safari/537.36', 
                'Sec-Fetch-Site': 'same-origin', 
                'Sec-Fetch-Mode': 'cors', 
                'Sec-Fetch-Dest': 'empty', 
                'Cookie': `csrftoken=${admin_csrftoken}'; sessionid='${admin_sessionid} `,
                'Referer' : 'https://admin.'+ env + '.shopee.' + Country + '/'
            },  
    },  
function(err, monkey_response) {
                function modifyResponse(JSON_String) {
                    var removespace = JSON_String.replace(/\s+/g, '');
                    var removeN = removespace.replace(/\\n/g, '')
                    var removeBackslash = removeN.replace(/\\/g, '')
                    var remove1 = removeBackslash.replace(/"{/g, '{')
                    var remove2 = remove1.replace(/}"/g, '}')
                    var ModifiedResponse = JSON.parse(remove2)
                    return ModifiedResponse
                };
    const Monkey_Modified_response = modifyResponse(JSON.stringify(monkey_response.json().Voucher)) //Modify the Mokey response as string
    console.info (Monkey_Modified_response)
pm.test('ShopVoucher checked', ()=> {//Check it is shope voucher by checking the existing of the shop_id
        let shop_id = pm.environment.get("shop_id")
        pm.expect(Monkey_Modified_response.shopid).to.equal(parseInt(shop_id));
        });
pm.test('Voucher Code checked', ()=> {    //Voucher Code checking
        pm.expect(Monkey_Modified_response.prefix).to.equal(First4ShopName + pm.collectionVariables.get("Random_Vcode_5"));
        });
    var item_id_monkey = Monkey_Modified_response.rule.items
if (item_id_monkey != undefined) {
    var Monkey_rule_items_id = item_id_monkey.map(item => Object.values(item)[0]);
}else{
    var Monkey_rule_items_id = null
};
pm.test('Item List checked', ()=> { //Item list checked
        pm.expect(Monkey_rule_items_id).to.deep.equal(items);
    });  
//reward_type, min_basket_price, discount_amount, percentage, max_price check
    var discount = Monkey_Modified_response.discount; //discount only have value with percentage reward voucher 
    var coinBack = Monkey_Modified_response.rule.coin_cashback_voucher; // coinBack only defied withe coincashback reward voucher
    var value = Monkey_Modified_response.value // For Flat Reward
    var Monkey_min_basket_price = (Monkey_Modified_response.min_price/100000)
    var Monkey_discountValue
    var Monkey_rewardType
    if (coinBack!=undefined) {
        var coinBackValue = Monkey_Modified_response.rule.coin_cashback_voucher.coin_percentage_real //Getting coinBack 'X' Value, writed in here to avoid undefine issue
        Monkey_rewardType = 3 //coin_cashback voucher
        Monkey_discountValue = coinBackValue
        Monkey_max_price = (Monkey_Modified_response.rule.coin_cashback_voucher.max_coin/100) //may need to double check what the factor that used to deviced the DB coin amount, assuming its 1000
    }else if(discount!=0){
        Monkey_rewardType = 2 //discount_percentage voucher
        Monkey_discountValue = discount
        Monkey_max_price = (Monkey_Modified_response.max_value/100000)
    }else {
        Monkey_rewardType = 1//absolute/fix_amount voucher
        Monkey_discountValue = (value/100000)
        Monkey_max_price = 0
    };
pm.test('reward checked', function () { //reward type check
    pm.expect(Monkey_rewardType).to.be.equal(expecting_reward_type);
});
pm.test('discount_Value checked', function () { //Discount value check, for both flat discount, percentage discount and coin cashback
    pm.expect(Monkey_discountValue).to.be.equal(Math.round(expecting_discount));
});
pm.test('max_price checked', function () { //max_price check
    pm.expect(Monkey_max_price).to.be.equal(expecting_max_price);
});
pm.test('min_basket_price checked', function () { //min_basket check
    pm.expect(Monkey_min_basket_price).to.be.equal(expecting_min_basket_price);
});
if (Boolean(expecting_display_channel_list)===true) { //verify if display channel is expted, null/undeifine/empty = hidden
    var sum_expecting_display_channel_list = expecting_display_channel_list.map((arr)=>{ //converting the open API intput to match DB storage in rule.voucher_landing_page
        if (arr===1||arr===2) return err //Open API display_channel_list=1, voucher_landing_page=1, show on default pages, Open API display_channel_list=2, voucher_landing_page=2, order page (TH only)
        if (arr===3) return 4//Open API display_channel_list=3, voucher_landing_page=4, feed 
        if (arr===4) return 8//Open API display_channel_list=4, voucher_landing_page=8, streaming 
    }).reduce((a,b)=> {return a+b}); //sum all the display channel, as value store in the DB with bitmask
    }else {
        var sum_expecting_display_channel_list = undefined
    }
    var Monkey_display_channel_list = Monkey_Modified_response.rule.voucher_landing_page
pm.test('display_channel_list checked', function () { //Check Display channels:
    pm.expect(Monkey_display_channel_list).to.be.equal(sum_expecting_display_channel_list);
});
var Monkey_display_start_time = Monkey_Modified_response.rule.display_start_time
pm.test('display_start_time checked', function () { //Check Display channels:
    pm.expect(Monkey_display_start_time).to.be.equal(expecting_display_start_time);
});
});
};

if (response_error.length == 0) { //if ther are error, no need to request coding monkey to verify
    call_monkey()
    };
};