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
                var getProd = new Promise((resolve, reject) => {
                    request(url, (err, res, body)=> {
                        if (err || body === undefined) reject(err);
                        resolve(body);
                    });
                });
                promises.push(
                    getProd.then((body) => {
                        let prod = ch.load(body);

                        let price = '';
                        if (prod('.a-color-price')) {
                            price = prod('.a-color-price').get(0).children[0].data.trim();
                        }

                        const prodObj = {
                            link: url.trim(),
                            id: prod('#ASIN')[0].attribs.value.trim(),
                            price: price,
                            description: prod('#productDescription') ? prod('#productDescription').text().trim() : '',
                            title: prod('#productTitle') ? prod('#productTitle').text().trim() : '',
                            brand: prod('#brand') ? prod('#brand').text().trim() : '',
                            image: prod('#landingImage') ? prod('#landingImage')[0].attribs.src.trim() : ''
                        };
                        products.push(prodObj);
                        storeProducts.push(prodObj);
                    }).catch((e) => {
                        console.log('error getting url: ', url, e);
                        return;
                    })
                );
            });

            return Promise.all(promises).then(() => {return products});
        },

        getNextUrl: () => {
            let $ch = ch.load(body);
            const next = '#pagnNextLink';
            if ($ch(next)[0]) {
                return 'http://www.amazon.de' + $ch(next)[0].attribs.href;
            }
            return '';
        },

        getCurrency: () => {
            return 'EUR';
        }
    }
};

module.exports = {
    'amazon_de': amazonDE
};
