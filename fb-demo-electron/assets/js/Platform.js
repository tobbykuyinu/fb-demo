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
                        const prodObj = {
                            link: url.trim(),
                            id: prod('#ASIN')[0].attribs.value.trim(),
                            price: prod('#priceblock_ourprice') ? prod('#priceblock_ourprice').text().trim() :
                                prod('#priceblock_saleprice') ? prod('#priceblock_saleprice').text().trim() :
                                    prod('.a-color-price') ? prod('.a-color-price')[0].children[0].data.trim() : '',
                            description: prod('#productDescription') ? prod('#productDescription').text().trim() : '',
                            title: prod('#productTitle') ? prod('#productTitle').text().trim() : '',
                            brand: prod('#brand') ? prod('#brand').text().trim() : '',
                            image: prod('#landingImage') ? prod('#landingImage')[0].attribs.src.trim() : ''
                        };
                        $('#product-list').append(`
                            <li>
                                <label class="checkbox-inline">
                                    <input name="selected-products" type="checkbox" value="${prodObj.id}">${prodObj.id} - ${prodObj.title}
                                </label>
                            </li>
                        `);
                        products.push(prodObj);
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
        }
    }
};

module.exports = {
    'amazon_de': amazonDE
};
