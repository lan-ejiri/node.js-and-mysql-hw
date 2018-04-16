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

//main prompt
function MAINPROMPT() {
  inquirer
    .prompt({
      name: "action",
      type: "list",
      message: "What would you like to do?",
      choices: [
        "View products for sale",
        "View low inventory",
        "Add to inventory",
        "Add new product",
        "Quit"
      ]
    })
    .then(function(answer) {
      switch (answer.action) {
        case "View products for sale":
          DISPLAYEVERYTHING();
          break;

        case "View low inventory":
          LOWINVENTORY();
          break;

        case "Add to inventory":
          //   DISPLAYEVERYTHING();
          ADDINVENTORY();
          break;
        case "Add new product":
          //   DISPLAYEVERYTHING();
          ADDPRODUCT();
          break;

        case "Quit":
          connection.end();
          break;
      }
    });
}

//displays inventory under 50 [done]
function LOWINVENTORY() {
  connection.query("SELECT * FROM products WHERE stock_quantity < 50", function(
    err,
    res
  ) {
    if (err) throw err;
    console.log(
      "======================== LOW INVENTORY ITEMS ==========================="
        .white
    );
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
// If a manager selects Add to Inventory, your app should display a prompt that will let the manager "add more" of any item currently in the store.

function ADDINVENTORY() {
  var chosenid;
  var chosenproduct;
  var chosenamount;
  var amountleft;

  inquirer
    .prompt({
      name: "productid",
      type: "input",
      message: "What is the id of the product you would like to add to?"
    })
    .then(function(answer) {
      chosenid = answer.productid;
      console.log(colors.white("ok, you chose id: " + chosenid));
      connection.query(
        `SELECT * FROM products WHERE id = '${chosenid}'`,
        function(err, res) {
          if (err) throw err;
          chosenproduct = res[0].product_name;
          amountleft = res[0].stock_quantity;
          console.log(
            colors.white(
              "that's a " +
                chosenproduct +
                " and there's " +
                amountleft +
                " of them left"
            )
          );

          inquirer
            .prompt({
              name: "productquantity",
              type: "input",
              message: "How many would you like to add?"
            })
            .then(function(answer) {
              chosenamount = answer.productquantity;
              console.log(colors.white("ok, you want to add " + chosenamount));

              var newamount = parseInt(amountleft) + parseInt(chosenamount);

              connection.query(
                `UPDATE products SET stock_quantity = ${newamount} WHERE id = ${chosenid};`,
                function(err, res) {
                  if (err) throw err;

                  connection.query(
                    `SELECT * FROM products WHERE id= ${chosenid}`,
                    function(err, res) {
                      if (err) {
                        throw err;
                      }
                      console.log(
                        "=============================================".white
                      );
                      for (i = 0; i < res.length; i++) {
                        console.log(
                          `Inventory updated. New amount of ${chosenproduct} is ${
                            res[0].stock_quantity
                          }`.purchase
                        );
                      } //for loop
                      MAINPROMPT();
                    }
                  ); //connection query
                }
              ); //connection query
            });
        }
      );
    });
}

// If a manager selects Add New Product, it should allow the manager to add a completely new product to the store.
function ADDPRODUCT() {
  var productname, productcategory, productquantity, productprice;

  inquirer
    .prompt([
      {
        name: "prodname",
        type: "input",
        message: "What is the name of the product you would like to add?"
      },
      {
        name: "prodcat",
        type: "input",
        message: "What category does this item belong to?"
      },
      {
        name: "prodprice",
        type: "input",
        message: "How much should this item cost?"
      },
      {
        name: "prodquantity",
        type: "input",
        message: "How many would you like to add?"
      }]
    )
    .then(function(answer) {
      productname = answer.prodname;
      productcategory = answer.prodcat;
      productquantity = answer.prodquantity;
      productprice = answer.prodprice;
      connection.query(
        `insert into products (product_name, department_name, price, stock_quantity) values ('${productname}', '${productcategory}', '${productprice}', '${productquantity}')`,
        function(err, res) {
          if (err) throw err;
          console.log(
            `You have added ${productquantity} ${productname}s into ${productcategory} for ${productprice} each`
              .white
          );
          MAINPROMPT();
        }
      ); //connectionqury
     
    }); //then function answer

   
} //function add product

function DISPLAYEVERYTHING() {
  connection.query("SELECT * FROM products", function(err, res) {
    if (err) throw err;
    console.log(
      "================================ ALL PRODUCTS ========================="
        .white
    );
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
