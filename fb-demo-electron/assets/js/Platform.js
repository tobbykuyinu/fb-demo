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
        },

        getCountry: () => {
            return 'DE';
        },

        getAdImages: (products) => {
            let prom = [];
            const base64Img = require('base64-img');
            const path = require('path');

            products.forEach(prod => {
                let image = prod.image;
                let id = prod.id;

                if (image.indexOf('http') > -1) {
                    prod.image = image;
                }
                if (image.indexOf('data:image') > -1) {
                    image = image.substr(image.indexOf(',')+1);
                    prom.push(
                        new Promise((resolve, reject) => {
                            require("fs").writeFile(`${id}.jpg`, image, 'base64', function(err) {
                                if(err) reject(err);
                                else {
                                    prod.image = `${id}.jpg`;
                                    resolve(`${id}.jpg`);
                                }
                            });
                        })
                    );
                }
            });

            let promises = [];
            let Jimp = require('jimp');

            return Promise.all(prom)
            .then(() => {
                products.forEach(prod => {
                    promises.push(
                        Jimp.read(prod.image).then(function (lenna) {
                            lenna.resize(400, 256)            // resize
                                .quality(60)                 // set JPEG quality
                                .greyscale()                 // set greyscale
                                .write(`${prod.id}.jpg`); // save
                        }).then(() => {
                            prod.image = `${prod.id}.jpg`;
                        }).catch(function (err) {
                                console.error(err);
                            })
                        );
                })
            }).then(() => {
                return Promise.all(promises);
            }).then(() => {
                return products;
            }).catch(console.log);
        }
    }
};

module.exports = {
    'amazon_de': amazonDE
};
