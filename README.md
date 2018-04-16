# node.js-and-mysql-hw

##### I used the colors npm package to help differentiate between the different results each action provides, because everything being the same color was getting confusing.

## bamazonCustomer.js
Prompts the user with 3 options:
  * View Products for Sale
    * shows all products in the database table
  * Buy a Product
    * allows user to input the id of the product they would like to 'purchase'
    * allows user to input quantity they would like to purchase
    * updates the database so that amount is subtracted, and the total price is shown to the user
  * Quit
    * allows user to exit the loop

## bamazonManager.js
Prompts the user with 5 options:
  * View products for sale
    * shows all products in the database table
  * View low inventory
    * shows all products with less than 50 in the 'quantity left' section
  * Add to inventory
    * allows user to enter id of the product they want to increase quantity of
    * allows user to enter the amount they would like to add
    * shows user updated amount of that product
  * Add new product
    * allows user to enter the name, category, price, and quantity of a new item. 
    * shows a message saying that the new item has been entered
  * Quit 
    * allows user to exit the prompt


### Things that still need to be done
  * make sure user inputs can't be a negative number
  * make sure certain inputs are number inputs as opposed to text.