'use strict';

const ch = require('cheerio');
const request = require('request');

const amazonDE = (body) => {
    return {
        getProducts: () => {
            let $ch = ch.load(body);
            const next = '#pagnNextLink';
            let promises = [];
            let products = [];
            let checked = [];
            let ps = $ch('.s-access-detail-page');

            if ($ch(next)) {
                console.log($ch(next));
                ps.each((i, productUrl) => {
                    const url = productUrl.attribs.href;
                    if (checked.indexOf(url) < 0) {
                        promises.push(
                            request(url, (err, res, body) => {
                                if (err || body === undefined) {
                                    console.log('error getting url: ', url);
                                    return;
                                }

                                let prod = ch.load(body);
                                let prodObj = {
                                    id: prod('#ASIN').text(),
                                    price: prod('.a-color-price')[0].text(),
                                    description: prod('#productDescription') ? prod('#productDescription').text() : '',
                                    title: prod('#productTitle') ? prod('#productTitle').text() : '',
                                    brand: prod('#brand') ? prod('#brand').text() : '',
                                    image: prod('#landingImage') ? prod('#landingImage')[0].attribs.src : ''
                                };
                                products.push(prodObj);
                            })
                        );
                        checked.push(url);
                    }
                });
                const nLink = 'http://www.amazon.de' + $ch(next)[0].attribs.href;
                request(nLink, (err, res, body) => {
                    if (err || body === undefined){
                        console.log('error getting url: ', nLink);
                        return;
                    }

                    return amazonDE(body);
                });
            }

            return Promise.all(promises).then(() => {return products});
        }
    }
};

module.exports = {
    'amazon_de': amazonDE
}