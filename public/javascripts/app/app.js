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
            //generate new content
            var i, j, description, categoriesStr, categories;
            for (i = 0; i < totalTodos; i++) {
                description = $(".description:eq(" + i + ")").html();
                categoriesStr = $(".categories:eq(" + i + ")").html();
                categories = categoriesStr.split(" ");
                for (j = 0; j < categories.length; j++) {
                    if (categories[j] === undefined || categories[j] === '') {
                        console.log("Invalid category");
                    } else {
                        if ($("#Categorized > .item > .span10").is("." + categories[j])) {
                            $("." + categories[j]).append("<div class='description'>"
                                + " &#187; " + description
                                + "</div>");
                        } else {
                            $("#Categorized").append("<div class='item row'>"
                                + "<div class='span10 "
                                + categories[j]
                                + "'><div class='categoryTitle'>"
                                + categories[j]
                                + "</div><div class='description'>"
                                + " &#187; " + description
                                + "</div></div></div>");
                        }
                    }
                }
            }

        },
        setUpTabHandler = function (anchor) {
            anchor.click(function () {
                var target = $(this).attr("href");

                $(".active").removeClass("active");
                $(this).addClass("active");
                $("#" + target).addClass("active");

                if (target === "Categorized") {
                    renderCategorized();
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
                $("." + toBeRemoved).fadeOut(150, function () {
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
                    post_object.categories = categories.split(" ");
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