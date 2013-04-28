/*jslint indent:4 plusplus:true*/
/*global $, document, console, alert */

var main = function () {
    "use strict";
    //count variables
    var itemNum = 0,
        totalTodos = 0,
        renderCategorized = function () {
            //clear previous content
            $("#Categorized").children().remove();
            //generate new content using the database
            $.getJSON("/todos.json", function (todos) {
                //stores previous categories
                var categoriesArray = [];
                todos.forEach(function (todo) {
                    todo.categories.forEach(function (category) {
                        if (categoriesArray.indexOf(category) === -1) {
                            console.log(category);
                            $("#Categorized").append("<div class='item row'>"
                                + "<div class='span10 "
                                + category
                                + "'><div class='categoryTitle'>"
                                + category
                                + "</div><div class='description'>"
                                + " &#187; " + todo.description
                                + "</div></div></div>");

                            categoriesArray.push(category);
                        } else {
                            $("." + category).append("<div class='description'>"
                                + " &#187; " + todo.description
                                + "</div>");
                        }
                    });

                });
            });

        },
        setUpTabHandler = function (anchor) {
            anchor.click(function () {
                var target = $(this).attr("href");

                $(".active").removeClass("active");
                $(this).addClass("active");
                $("#" + target).addClass("active");

                if (target === "Categorized") {
                    renderCategorized();
                } else if (target === "All") {
                    $("#All").children().remove();
                    jsonLoader();
                }

                return false;
            });
        },
        addTodo = function (desc, categories) {
            $("#All").append("<div class='item row-fluid " + itemNum + "'>"
                + "<div class='span1'>"
                + "<button type='button' class='remove btn btn-link' id='"
                + itemNum
                + "'>X</button>"
                + "</div>"
                + "<div class='span10'>"
                + "<div class='description'>" + desc + "</div>"
                + "<div class='categories'>" + categories + "</div>"
                + "</div>"
                + "</div>");
            $("#" + itemNum).click(function () {
                var toBeRemoved = $(this).attr("id");
                var tobedeleted = $("." + toBeRemoved + " > .span10 > .description").html();
                var del_obj = {
                    description: tobedeleted
                };
                $("." + toBeRemoved).fadeOut(150, function () {
                    $.post("todo/delete", del_obj, function (response) {
                        console.log(response);
                    });
                    console.log(tobedeleted + " " + toBeRemoved);
                    $(this).remove();
                });

                totalTodos--;
            });
            itemNum++;
            totalTodos++;
        },
        setUpAddToDoHandler = function () {
            $("#addToDo").click(function () {
                var desc = $("#desc").val(),
                    categories = $("#categ").val(),
                    post_object = {};
                //add todo to database
                if (desc === "" || categories === "") {
                    alert("something is not complete");
                } else {
                    post_object.description = desc;
                    post_object.categories = categories.split(/[\s,]+/);
                    console.log(post_object);

                    $.post("/todo/new", post_object, function (response) {
                        console.log(response);
                    });

                    //add todo to web page
                    addTodo(desc, categories);

                    $("#desc").val("");
                    $("#categ").val("");
                }
            });
        },
        jsonLoader = function () {
            $.getJSON("/todos.json", function (todos) {
                todos.forEach(function (todo) {
                    var categoriesString = "";
                    todo.categories.forEach(function (category) {
                        categoriesString = categoriesString + " " + category;
                    });
                    addTodo(todo.description, categoriesString);
                });
            });
        },
        initialize = function () {
            jsonLoader();
            setUpTabHandler($(".tabs .tab"));
            setUpAddToDoHandler();
        };

    initialize();

};

$(document).ready(main);