/**
 * Created by zhanxiaoping 
 * zhanxp@me.com
 */
function MysqlDao(app, database, table) {
    this.database = database;
    this.table = table;
    this.app = app;
    this.db = app.mysql.get(database);
    this.insert = async function (data) {
        return await this.db.insert(this.table, data);
    };
    this.insertBatch = async function (datas) {
        return await this.db.insert(this.table, datas);
    }

    this.update = async function (data) {    // Update a row with primary key: id
        return await this.db.update(this.table, data);
    };
    this.update = async function (data, where, columns) {
        return await this.db.update(this.table, data, {
            where,
            columns
        });
    };
    this.updateBatchById = async function (datas) {    // Update multiple rows with primary key: id
        return await this.db.updateRows(this.table, datas);
    };
    this.updateBatch = async function (options) {    // Update multiple rows with row and where properties
        return await this.db.updateRows(this.table, options);
    };

    this.get = async function (where) {
        return await this.db.get(this.table, where);
    };
    this.getByKV = async function (key, value) {
        var where = {};
        where[key] = value;
        return await this.get(this.table, where);
    };

    this.deleteById = async function (id) {
        return await this.deleteByKV("id", id);
    };
    this.deleteByKV = async function (key, value) {
        var where = {};
        where[key] = value;
        return await this.delete(where);
    };
    this.delete = async function (where) {
        return await this.db.delete(this.table, where);
    };

    this.count = async function (where) {
        return await this.db.count(this.table, where);
    };

    this.exists = async function (where) {
        var count = await this.count(this.table, where);
        return count > 0;
    };

    this.list = async function (where, columns, orders, limit, offset = 0) {
        var options = {};
        if (where) {
            options.where = where;
        }
        if (columns) {
            options.columns = columns;
        }
        if (orders) {
            options.orders = orders;
        }
        if (limit) {
            options.limit = parseInt(limit);
        }
        if (offset) {
            options.offset = parseInt(offset);
        }

        if (options == {}) {
            return await this.db.select(this.table);
        } else {
            return await this.db.select(this.table, options);
        }
    };

    this.pageList = async function (pageIndex, pageSize, where, columns, orders) {
        pageIndex = parseInt(pageIndex);
        pageSize = parseInt(pageSize);
        var items = await this.list(where, columns, orders, pageSize, pageSize * (pageIndex - 1));
        var total = await this.count(where);
        return {
            items: items,
            total: total,
            pageIndex: pageIndex,
            pageSize: pageSize
        };
    };
}

module.exports = MysqlDao;