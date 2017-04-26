'use strict';

const ch = require('cheerio');
const request = require('request');

const amazonDE = (body) => {
    return {
        getProducts: () => {
            let $ch = ch.load(body);
            let promises = [];
            let products = [];
            let ps = $ch('.s-access-detail-page');

            ps.each((i, productUrl) => {
                const url = productUrl.attribs.href;
                promises.push(
                    request(url, (err, res, body) => {
                        if (err || body === undefined) {
                            console.log('error getting url: ', url);
                            return;
                        }

                        let prod = ch.load(body);
                        let prodObj = {
                            link: url,
                            id: prod('#ASIN')[0].attribs.value,
                            price: prod('#priceblock_ourprice') ? prod('#priceblock_ourprice').text() :
                                prod('#priceblock_saleprice') ? prod('#priceblock_saleprice').text() :
                                    prod('.a-color-price') ? prod('.a-color-price')[0].children[0].data : '',
                            description: prod('#productDescription') ? prod('#productDescription').text() : '',
                            title: prod('#productTitle') ? prod('#productTitle').text() : '',
                            brand: prod('#brand') ? prod('#brand').text() : '',
                            image: prod('#landingImage') ? prod('#landingImage')[0].attribs.src : ''
                        };
                        products.push(prodObj);
                    })
                );
            });

            return Promise.all(promises).then(() => {return products});
        },

        getNextUrl: () => {
            let $ch = ch.load(body);
            const next = '#pagnNextLink';
            if ($ch(next)) {
                return 'http://www.amazon.de' + $ch(next)[0].attribs.href;
            }
            return '';
        }
    }
};

module.exports = {
    'amazon_de': amazonDE
};
