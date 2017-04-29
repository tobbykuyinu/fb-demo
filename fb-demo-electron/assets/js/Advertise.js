'use strict';

const CAMPAIGN_PREFIX = 'ads_tool_';
const request = require('request');
const getCampaignName = (pageId) => {
    return CAMPAIGN_PREFIX + pageId;
};
let $ = {
    campaignExists: (pageId) => {
        const campaignName = getCampaignName(pageId);
        return new Promise((resolve, reject) => {
            request.get({
                headers: {'content-type' : 'application/json'},
                url:     `https://graph.facebook.com/v2.9/act_${adAcctId}/campaigns?access_token=${ACCESS_TOKEN}&fields=id,name`
            }, function(error, response, body){
                if (error) {
                    console.log(error.message);
                    return reject(error);
                }

                return resolve(JSON.parse(body).data);
            });
        })
        .then(campaigns => {
            let found = false;
            let foundCampaign = false;
            campaigns.forEach(campaign => {
                found = found || (campaign.name.toLowerCase() === campaignName.toLowerCase());
                if (found) {
                    foundCampaign = campaign.id
                    found = false;
                }
            });
            return foundCampaign;
        });
    },
    adsetExists: (campaignId, platform, pageId, budget, cpc) => {
        const adsetName = platform+'_'+pageId+'_'+budget+'_'+cpc;
        return new Promise((resolve, reject) => {
            request.get({
                headers: {'content-type' : 'application/json'},
                url:     `https://graph.facebook.com/v2.9/act_${adAcctId}/adsets?access_token=${ACCESS_TOKEN}&fields=id,name,campaign_id`
            }, function(error, response, body){
                if (error) {
                    console.log(error.message);
                    return reject(error);
                }

                return resolve(JSON.parse(body).data);
            });
        })
            .then(adsets => {
                let found = false;
                let foundAdset = false;
                adsets.forEach(adset => {
                    found = found || (
                        (adset.name.toLowerCase() === adsetName.toLowerCase()) && adset.campaign_id === campaignId);
                    if (found) {
                        foundAdset = adset.id;
                        found = false;
                    }
                });
                return foundAdset;
            });
    },
    createCampaign: (pageId) => {
        const campaignName = getCampaignName(pageId);
        return new Promise((resolve, reject) => {
            request.post({
                headers: {'content-type' : 'application/json'},
                url:     `https://graph.facebook.com/v2.9/act_${adAcctId}/campaigns`,
                body: JSON.stringify({
                    name: campaignName,
                    objective: 'LINK_CLICKS',
                    status: 'PAUSED',
                    access_token: ACCESS_TOKEN
                })
            }, function(error, response, body){
                if (error) {
                    console.log(error.message);
                    return reject(error);
                }

                return resolve(JSON.parse(body));
            });
        })
            .then(campaign => {
                if (campaign.id){
                    return campaign.id;
                } else {
                    console.log(campaign);
                }
            });
    },
    createAdSet: (campaignId, platformCode, pageId, budget, CPC) => {
        const adSetName = platformCode+'_'+pageId+'_'+budget+'_'+CPC;
        return new Promise((resolve, reject) => {
            request.post({
                headers: {'content-type' : 'application/json'},
                url:     `https://graph.facebook.com/v2.9/act_${adAcctId}/adsets`,
                body: JSON.stringify({
                    name: adSetName,
                    campaign_id: campaignId,
                    lifetime_budget: budget * 100,
                    bid_amount: CPC * 100,
                    start_time: new Date().toISOString(),
                    end_time: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000).toISOString(),
                    billing_event: 'LINK_CLICKS',
                    optimization_goal: 'LINK_CLICKS',
                    targeting: {
                        geo_locations: { countries: [platform.getCountry()] }
                    },
                    status: 'PAUSED',
                    access_token: ACCESS_TOKEN
                })
            }, function(error, response, body){
                if (error) {
                    console.log(error.message);
                    return reject(error);
                }

                console.log('successfully created adset', body);
                return resolve(JSON.parse(body));
            });
        })
            .then(adset => {
                if (adset.id) return adset.id;
                else throw new Error(adset);
            });
    }
};
module.exports = {
    createAd: (creativeId, pageId, budget, CPC) => {
        return $.campaignExists(pageId)
        .then(exists => {
            if (!exists) {
                console.log('campaign does not exist, creating...');
                return $.createCampaign(pageId);
            }
            console.log('campaign exists, using campaign id:', exists);
            return exists;
        })
        .then(campaignId => {
            return $.adsetExists(campaignId, platformCode, pageId, budget, CPC)
            .then(exists => {
                if (!exists) {
                    console.log('adset does not exist, creating...');
                    return $.createAdSet(campaignId, platformCode, pageId, budget, CPC);
                }
                console.log('adset exists, using adset id:', exists);
                return exists;
            })
        })
        .then(adSetId => {
            return new Promise((resolve, reject) => {
                let adName = creativeId+'_'+pageId;
                console.log('creating ads for creative:', creativeId);
                request.post({
                    headers: {'content-type' : 'application/json'},
                    url:     `https://graph.facebook.com/v2.9/act_${adAcctId}/ads`,
                    body: JSON.stringify({
                        name: adName,
                        adset_id: adSetId,
                        creative: {creative_id: creativeId},
                        status: 'PAUSED',
                        access_token: ACCESS_TOKEN
                    })
                }, function(error, response, body){
                    if (error) {
                        console.log(error.message);
                        return reject(error);
                    }

                    console.log('successfully created ad', body);
                    return resolve(JSON.parse(body));
                });
            });
        }).catch(console.log);
    }
};