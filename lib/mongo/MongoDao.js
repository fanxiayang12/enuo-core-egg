/**
 * Created by alegria
 */

var ObjectID = require("mongodb").ObjectID;

function MongoDao(app, table) {
    this.table = table;
    this.app = app;
    this.insert = async function(data) {
        return await this.app.mongo.db.collection(this.table).insert(data);
    };

    this.update = async function(data, query) {
        return await this.app.mongo.db.collection(this.table).updateOne(data, query);
    };

    this.delete = async function(query) {
        return await this.app.mongo.db.collection(this.table).delete(query);
    };

    this.deleteById = async function(id) {
        return await this.delete({ _id: new ObjectID(id) });
    };

    this.deleteByKV = async function(key, value) {
        var query = {};
        query[key] = value;
        return await this.delete(query);
    };


    this.count = async function(query) {
        return await this.app.mongo.db.collection(this.table).countDocuments(query);
    };


    this.findById = async function(id) {
        return await this.findOne({ _id: new ObjectID(id) });
    };

    this.findByKV = async function(key, value) {
        var query = {};
        query[key] = value;
        return await this.findOne(query);
    };

    this.findOne = async function(query, options) {
        return await this.app.mongo.db.collection(this.table).findOne(query, options);
    };

    this.find = async function(query, options) {
        return await this.app.mongo.db.collection(this.table).find(query, options).toArray();
    };

    this.pageList = async function(pageIndex, pageSize, query, sort) {
        var options = { limit: pageSize, skip: (pageIndex - 1) * pageSize, sort: sort };
        var items = await this.find(query, options);
        var total = await this.count(query);
        return {
            items: items,
            total: total,
            pageIndex: pageIndex,
            pageSize: pageSize
        };
    };
}

module.exports = MongoDao;