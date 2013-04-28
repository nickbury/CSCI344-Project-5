/*jslint indent:4*/
/*global */

var Todo = require("../models/todo.js"),
    TodoController = {};

TodoController.list = function (req, res) {
    Todo.find({}, function (err, todos) {
        if (err !== null) {
            console.log(err);
        } else {
            res.json(todos);
        }
    });
};

TodoController.create = function (req, res) {
    var t = new Todo({
        "description": req.body.description,
        "categories": req.body.categories
    });

    t.save(function (err, result) {
        if (err !== null) {
            //send the error
            console.log(err);
        } else {
            res.json(result);
        }
    });
};

TodoController.destroy = function (req, res) {
    Todo.findOne({"description": req.body.description}, function (err, todo) {
        if (err !== null) {
            //handle err
            console.log(err);
        } else if (todo === null) {
            //person not found
            console.log("Todo not found");
        } else {
            todo.remove(function (err) {
                if (err !== null) {
                    //handle err
                    console.log(err);
                }
            });
        }
    });
};

module.exports = TodoController;
