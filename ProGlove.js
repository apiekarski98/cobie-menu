const HTMLParser = require('node-html-parser');
const rp = require('request-promise');
const menu_url = 'http://www.cobie.de/speisekarte';
const express = require('express');
const port = 3000;


var jsonRes = rp(menu_url).then(function (html) {

    // root gets the entire HTML
    const root = HTMLParser.parse(html);

    // innerHTML is specific to the first day
    const innerHTML = root.querySelector('.foodCarousel--day').innerHTML;

    // Represents the specific day
    const date = HTMLParser.parse(innerHTML).querySelector('.dayheadline').innerHTML;

    // productNameList represents the name of each product in the menu (i.e. salat)
    const productNameListHTML = HTMLParser.parse(innerHTML).querySelectorAll('.cobie-product-name');
    var productNameList = []; // list of product names once parsed from HTML

    productNameListHTML.forEach(function (product) {
        productNameList.push(product.innerHTML);
    });

    // Represents the prices for each dish
    const priceListHTML = HTMLParser.parse(innerHTML).querySelectorAll('.woocommerce-Price-amount');
    var priceList = []; // list of prices once parsed from HTML

    priceListHTML.forEach(function (price) {
        priceList.push("€" + price.innerHTML.replace ( /[^\d.]/g, ''));
    });

    // productDescriptionList represents the description of each menu item
    const productDescriptionListHTML = HTMLParser.parse(innerHTML).querySelectorAll('.cobie-product-description');
    var productDescriptionList = []; // list of product descriptions once parsed from HTML

    productDescriptionListHTML.forEach(function (product) {
        productDescriptionList.push(product.innerHTML);
    });

    // JSON to return
    var jsonResponse = {
        date: date,
        items: []
    };

    // adds each menu item to the items list
    for (var i = 0; i < productNameList.length; i++) {
        var temp_obj = {};
        temp_obj.type = productNameList[i];
        temp_obj.price = priceList[i];
        temp_obj.description = productDescriptionList[i];

        jsonResponse.items.push(temp_obj);
    }

    return jsonResponse;
});


const app = express();

app.use(express.json())

app.post('/:port/menu/today', function(req, res) {
    res.status(200).send(jsonRes);
});

app.get('/:port/menu/today', function(req, res) {
    if (err) {
        res.status(400).send("The site could not be reached. Error: 400");
    } else {
        res.json;
    }
});

app.listen(port);
console.log('app running on port ', port);

