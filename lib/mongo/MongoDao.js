/**
 * Created by alegria
 */
function MongoDao(app, database, table) {
    this.database = database;
    this.table = table;
    this.app = app;
    this.db = database ? app.mongo.get(database) : app.mongo;
    this.insertOne = async function (doc, options) {
        return await this.db.insertOne(this.table, { doc, options });
    };
    this.insertMany = async function (docs, options) {
        return await this.db.insertMany(this.table, { docs, options });
    };

    this.update = async function (query, doc, options) {
        return await this.db.updateMany(this.table, query, doc, options);
    };

    this.deleteById = async function (id) {
        return await this.deleteByKV("id", id);
    };
    this.deleteByKV = async function (key, value) {
        var query = {};
        query[key] = value;
        return await this.delete(query);
    };
    this.delete = async function (query, options) {
        return await this.db.deleteMany(this.table, query, options);
    };

    this.count = async function (query) {
        return await this.db.count(this.table, query);
    };

    this.exists = async function (query) {
        var count = await this.count(this.table, query);
        return count > 0;
    };

    this.findOne = async function (query) {
        return await this.db.findOne(this.table, query);
    };
    this.findOneByKV = async function (key, value) {
        var query = {};
        query[key] = value;
        return await this.findOne(this.table, query);
    };
    this.find = async function (query, options, skip, limit, sort) {
        var args = {};
        if (query) {
            args.query = query;
        }
        if (options) {
            args.options = options;
        }
        if (skip) {
            args.skip = skip;
        }
        if (limit) {
            args.limit = limit;
        }
        if (sort) {
            args.sort = sort;
        }

        return await this.db.find(this.table, args);
    };

    this.pageList = async function (pageIndex, pageSize, query, options, sort) {
        pageIndex = parseInt(pageIndex);
        pageSize = parseInt(pageSize);
        var items = await this.find(query, options, pageSize * (pageIndex - 1), pageSize, sort);
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