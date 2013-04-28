/*jslint indent:4*/
/*global $, document, alert, console,*/

var main = function () {
    console.log("hello world!");

    var addTodoToList = function (todo) {
        $(".todo_list").append("<p>" + todo.description + " Categories: " + todo.categories + "</p>");
    };

    $.getJSON("/todos.json", function (response) {
        response.forEach(function (todo) {
            console.log(todo);
            addTodoToList(todo);
        });
    });


    $("#new_todo").click(function () {
        var description = $("#description").val(),
            categories = $("#categories").val(),
            post_object = {};

        if (description === "" || categories === "") {
            alert("something is not complete");
        } else {
            post_object.description = description;
            post_object.categories = categories.split(" ");
            console.log(post_object);

            $.post("/todo/new", post_object, function (response) {
                console.log(response);
                addTodoToList(response);
                $("#description").val("");
                $("#categories").val("");
            });
        }
    });

};

$(document).ready(main);
