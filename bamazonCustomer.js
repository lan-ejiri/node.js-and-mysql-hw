var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",
  port: 3307,
  user: "root",
  password: "root",
  database: "bamazon"
});

connection.connect(function(err) {
  if (err) throw err;
  DISPLAYEVERYTHING();
});

function DISPLAYEVERYTHING() {
  connection.query("SELECT * FROM products", function(err, res) {
    if (err) throw err;
    console.log("=====================");
    for (i = 0; i < res.length; i++) {
      console.log(
        "id: " +
          res[i].id +
          "  product name: " +
          res[i].product_name +
          "  price: $" +
          res[i].price +
          "  quantity left: " +
          res[i].stock_quantity
      );
    }
  });
}

// function MAINPROMPT() {
//   inquirer
//     .prompt({
//       name: "action",
//       type: "list",
//       message: "What would you like to do?",
//       choices: [
//         "Find songs by artist",
//         "Find all artists who appear more than once",
//         "Find data within a specific range",
//         "Search for a specific song"
//       ]
//     })
//     .then(function(answer) {
//       switch (answer.action) {
//         case "Find songs by artist":
//           artistSearch();
//           break;

//         case "Find all artists who appear more than once":
//           multiSearch();
//           break;

//         case "Find data within a specific range":
//           rangeSearch();
//           break;

//         case "Search for a specific song":
//           songSearch();
//           break;
//       }
//     });
// }
