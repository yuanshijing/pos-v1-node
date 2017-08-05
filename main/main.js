/*eslint-disable no-constant-condition */

/*globals price */
function buildItemInfo(input) {
    let result = [];
    for (let i of loadAllItems()) {
        for (let item of input) {
            if (item === i['barcode']) {
                result.push(loadAllItems()[i]);
            }
        }
    }
    return result;//购买的商品信息
}

function itemCount(input) {
    let result = [];
    let arr = {};
    for (let i of input) {
        arr[i] = typeof arr[i] === 'undefined' ? 1 : arr[i] + 1;
    }
    for (let item in arr) {
        result.push({barcode: item, count: arr[item]});
    }
    return result;//购买商品{条码，数量}
}

function promotionItemCount() {
    let result = [];
    for (let i of itemCount()) {
        for (let item of loadPromotions()[0]['barcodes']) {
            if (i['barcode'] === item) {
                if (i.count > 3) {
                    result.push(i);
                }
            }
        }
    }
    return result;//购买的已优惠（>3）的商品的{条码，数量}
}

function reduceItemCount() {
    let result = [];
    for (let i of itemCount()) {
        for (let item of promotionItemCount()) {
            if (i['barcode'] === item['barcode']) {
                let count = Math.floor(i.cnt / 3);
                result.push({barcode: i.barcode, count: count});
            }
        }
    }
    return result;//节省的商品{条码，数量}
}

function reduceItemPrice() {
    let result = [];
    for (let item of reduceItemCount()) {
        for (let i of loadAllItems()) {    //某一优惠商品优惠数量
            if (item['barcode'] === i['barcode']) {
                let price = i['price'] * reduceItemCount['count'];
                result.push({barcode: i['barcode'], price: price});
            }
        }
    }
    return result;//节省的商品{条码，金额}
}

function calculateTotalPrice() {
    let result = [];
    for (let i of buildItemInfo()) {
        for (let c of itemCount) {
            for (let item of reduceItemPrice()) {
                if (i['barcode'] === c['barcode'] && c['barcode'] === item['barcode']) {
                    let total = i['price'] * c['count'] - item['price'];
                    i.total = total;
                    result.push(i);
                }
            }
        }
    }
    return result;//小计(含所有信息)
}

function calculateSumPrice() {
    for (let i of calculateTotalPrice) {
        let result;
        result += i['price'];
    }
    return result;//总计
}

function promotionPrice() {
    for (let i of reduceItemPrice()) {
        let result;
        result += i['price'];
    }
    return result;//总节省
}

function buildPrintList() {
    let result;
    for (let i of buildItemInfo()) {
        for (let c of itemCount()) {
            for (let t of calculateTotalPrice) {
                if (i['barcode'] === c['barcode'] === t['barcode']) {
                    result.push('名称：' + i['name'] + '，数量：' + i[count] + i['unit'] + ',单价：' + i['price'] + '(元)，小计：' + t['price'] + '(元)\n');
                }
            }
        }
    }
    return result;
}        //（buildItemInfo，itemCount，calculateTotalPrice）

function buildPromotionItem() {
    for (let i of reduceItemCount()) {
        for (let j of buildItemInfo()) {
            if (i['barcode'] === j['barcode']) {
                result.push('名称：' + j['name'] + '，数量：' + i[count] + j['unit'] + '\n');
            }
        }
    }
    return result;
}

module.exports = function printReceipt() {
    let result =
        '***<没钱赚商店>购物清单***\n' +
        buildPrintList() +
        '----------------------\n' +
        '挥泪赠送商品：\n' +
        buildPromotionItem() +
        '----------------------\n' +
        '总计：' + calculateSumPrice() + '(元)\n' +
        '节省：' + promotionPrice() + '(元)\n' +
        '**********************';
    return result;
};