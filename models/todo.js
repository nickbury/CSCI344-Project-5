/*jslint indent:4*/
/*global */

var mongoose = require("mongoose"),
    TodoSchema,
    Todo;

mongoose.connect("mongodb://localhost/development");

TodoSchema = new mongoose.Schema({
    "description": String,
    "categories" : Array
});

Todo = mongoose.model("Todo", TodoSchema);

Todo.findOne({}, function (err, result) {
    if (err !== null) {
        console.log(err);
    } else if (result === null) {
        var t = new Todo({
            "description": "Sample Todo",
            "categories": ["new", "todo"]
        });

        t.save(function (err) {
            if (err !== null) {
                console.log(err);
            }
        });
    }
});

module.exports = Todo;

