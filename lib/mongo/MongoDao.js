/**
 * Created by alegria
 */
function MongoDao(app, table) {
    this.table = table;
    this.app = app;
    this.insert = async function(data) {
        return await this.app.mongo.db.insert(this.table, data);
    };

    this.update = async function(data, query) {
        return await this.app.mongo.db.updateOne(this.table, data, query);
    };

    this.delete = async function(query) {
        return await this.app.mongo.db.delete(this.table, query);
    };

    this.deleteById = async function(id) {
        return await this.deleteByKV("_id", id);
    };

    this.deleteByKV = async function(key, value) {
        var query = {};
        query[key] = value;
        return await this.delete(query);
    };


    this.count = async function(query) {
        return await this.app.mongo.db.count(this.table, query);
    };


    this.findById = async function(id) {
        //var val = this.tryObjectID(id);
        return await this.app.mongo.db.findOne(this.table, { _id: id });
    };

    this.findByKV = async function(key, value) {
        var query = {};
        query[key] = value;
        return await this.app.mongo.db.findOne(this.table, query);
    };

    this.find = async function(query, options) {
        return await this.app.mongo.db.findOne(this.table, query, options);
    };

    this.list = async function(query, options) {
        return await this.app.mongo.db.find(this.table, query, options);
    };

    this.pageList = async function(pageIndex, pageSize, query, sort) {
        var options = { limit: pageSize, skip: (pageIndex - 1) * pageSize, sort: sort };
        var items = await this.app.mongo.db.find(this.table, query, options);
        var total = await this.app.mongo.db.count(this.table, query, null);
        return {
            items: items,
            total: total,
            pageIndex: pageIndex,
            pageSize: pageSize
        };
    };
}

module.exports = MongoDao;