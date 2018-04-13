var mysql = require("mysql");
var inquirer = require("inquirer");
var colors = require("colors");

colors.setTheme({
  purchase: ["bgWhite", "red"],
  outofstock: ["bgRed", "white"]
});

var connection = mysql.createConnection({
  host: "localhost",
  port: 3307,
  user: "root",
  password: "root",
  database: "bamazon"
});

connection.connect(function(err) {
  if (err) throw err;
  MAINPROMPT();
});

function MAINPROMPT() {
  inquirer
    .prompt({
      name: "action",
      type: "list",
      message: "What would you like to do?",
      choices: ["View products for sale", "Buy a product", "Quit"]
    })
    .then(function(answer) {
      switch (answer.action) {
        case "View products for sale":
          DISPLAYEVERYTHING();
          break;

        case "Buy a product":
          ENTERPRODUCTID();
          break;
        case "Quit":
          connection.end();
          break;
      }
    });
}

function DISPLAYEVERYTHING() {
  connection.query("SELECT * FROM products", function(err, res) {
    if (err) throw err;
    console.log("=============================================".white);
    for (i = 0; i < res.length; i++) {
      console.log(
        colors.white(
          "id: " +
            res[i].id +
            "  product name: " +
            res[i].product_name +
            "  price: $" +
            res[i].price +
            "  quantity left: " +
            res[i].stock_quantity
        )
      );
    }
    MAINPROMPT();
  });
}

function ENTERPRODUCTID() {
  inquirer
    .prompt({
      name: "enterproductid",
      type: "input",
      message: "What is the id of the product you would like to buy?"
    })
    .then(function(answer) {
      var amount;
      var price;
      var total;
      var itemid;
      var prod;
      console.log(colors.white("ok, you chose id: " + answer.enterproductid));

      connection.query(
        `SELECT * FROM products WHERE id = ${answer.enterproductid}`,
        function(err, res) {
          if (err) throw err;
          console.log(
            colors.white(
              "that's a " + res[0].product_name + " and its $" + res[0].price
            )
          );
          amount = res[0].stock_quantity;
          price = res[0].price;
          itemid = res[0].id;
          prod = res[0].product_name;

          console.log(colors.white("theres " + amount + " left"));

          inquirer
            .prompt({
              name: "enterproductquantity",
              type: "input",
              message: "How many would you like to buy?"
            })
            .then(function(answer) {
              console.log(
                colors.white(
                  "ok, you want to buy " + answer.enterproductquantity
                )
              );

              if (answer.enterproductquantity <= amount) {
                total = price * answer.enterproductquantity;
                console.log(
                  `Thanks for your purchase! You bought ${
                    answer.enterproductquantity
                  } ${prod}s for a total of $ ${total}`.purchase
                );

                connection.query(
                  `UPDATE products SET stock_quantity = ${amount -
                    answer.enterproductquantity} WHERE id = ${itemid};`,
                  function(err, res) {
                    if (err) throw err;
                  }
                );

                MAINPROMPT();
              } else {
                console.log(
                  "Sorry, there's not enough of that item in stock for this transaction."
                    .outofstock
                );
                MAINPROMPT();
              }
            });
        }
      );
    });
} //close function ENTERPRODUCTID
