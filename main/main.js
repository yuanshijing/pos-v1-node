 /*eslint-disable no-constant-condition */
/*globals price */
function buildItemInfo(input){
    let result = [];
    for (let i in loadAllItems()){
        for (let item of input){
            if(item === loadAllItems()[i]['barcode']){
                result.push(loadAllItems()[i]);
            }
        }
    }
    return result;//购买的商品信息
}

function itemCount(input){
    let result=[];
    let arr={};
    for(let i of input){
        arr[i] = typeof arr[i]='undefined'?1:arr[i]+1;
    }
    for(let item in arr){
        result.push({barcode:item,count:arr[item]});
    }    
    return result;//购买商品{条码，数量}
}

function promotionItemCount(){
    let result = [];
    for (let i of itemCount()){
        for (let item of loadPromotions()[0]['barcodes']) {
            if(i['barcode'] === item){
                if(i.count>3){
                result.push(i);
            }
        }
    }
    return result;//购买的已优惠（>3）的商品的{条码，数量}
}

function reduceItemCount(){
    let result = [];
    for (let i of itemCount()){
        for (let item of promotionItemCount()){
            if (i['barcode'] ===item['barcode']){
                let count = Math.floor(i.cnt/3); 
                result.push({barcode:i.barcode,count:count});
            }
        }
    }
    return result;//节省的商品{条码，数量}
}

function reduceItemPrice(){
    let result = [];
    for(let item of reduceItemCount()){
        for (let i of loadAllItems()){    //某一优惠商品优惠数量
            if(item['barcode'] === i['barcode']){
                let price =  i['price'] *  reduceItemCount['count'];
                result.push({barcode:i['barcode'],price:price});
            }
        }
    }
    return result;//节省的商品{条码，金额}
}

function calculateTotalPrice(){
    let result=[];
    for (let i of buildItemInfo()){
        for(let c of itemCount) {
            for (let item of reduceItemPrice()) {
                if(i['barcode'] ===c['barcode'] && c['barcode'] === item['barcode']) {
                    let total = i['price'] *c['count'] - item['price'];
                    i.total = total;
                    result.push(i);
                }
            }
        }        
    }
    return result;//小计(含所有信息)
}

function calculateSumPrice() {
    for ( let i of calculateTotalPrice) {
        let result += calculateTotalPrice['price'];
    }
    return result;//总计
}

function promotionPrice() {
    let result +=  reduceItemPrice()['price'];
    return result;//总节省

function buildPrintList() {
    for (let i of buildItemInfo()) {
        //（buildItemInfo，itemCount，calculateTotalPrice）

module.exports = function printReceipt() {
    let result =  
        '***<没钱赚商店>购物清单***\n' +
        buildPrintList() + 
        '----------------------\n' + 
        '挥泪赠送商品：\n' + 
        '名称：' +
        promotionItemCount() + 
        '----------------------\n' + 
        '总计：'+ calculateSumPrice() + '(元)\n' + 
        '节省：' + promotionPrice() + '(元)\n' + 
        '**********************';
    return result;
};