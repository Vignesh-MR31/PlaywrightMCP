# Sauce Demo Core User Operations Test Plan

## Application Overview

Explore and test the five core end-user operations on the Sauce Demo storefront: authenticate, discover products, manage the cart, provide checkout information and review the order, then complete a purchase. The plan is based on the live UI at https://www.saucedemo.com. Each test is independent and starts in a fresh browser session with an empty cart and no authenticated user. Use the public demo account standard_user / secret_sauce where authentication is needed; use clearly synthetic checkout details such as Taylor Tester and ZIP 10001. Tests verify visible UI behavior and must not depend on state left by another test. A successful purchase should show the confirmation message and an empty cart; invalid or incomplete inputs should show a visible error and not advance the flow.

## Test Scenarios

### 1. 1. Authentication

**Seed:** `tests/seed.spec.ts`

#### 1.1. Sign in with the standard demo account

**File:** `tests/saucedemo/authenticate-valid-user.spec.ts`

**Steps:**
  1. Starting from a fresh session on https://www.saucedemo.com, enter standard_user in Username and secret_sauce in Password.
    - expect: Both credential fields accept the entered values.
  2. Click Login.
    - expect: The user is taken to the Products inventory page.
    - expect: The page shows the product sort control and catalog.
    - expect: The cart is initially empty.

#### 1.2. Reject invalid or missing login credentials

**File:** `tests/saucedemo/reject-invalid-login.spec.ts`

**Steps:**
  1. Starting from a fresh login page, leave both fields blank and click Login.
    - expect: Login is not successful and the user remains on the login page.
    - expect: A visible validation message identifies the missing username.
  2. Enter standard_user as Username and an incorrect password, then click Login.
    - expect: Login is not successful and the user remains on the login page.
    - expect: A visible authentication error is shown; the inventory page is not accessible.

### 2. 2. Product discovery

**Seed:** `tests/seed.spec.ts`

#### 2.1. Browse products, sort the catalog, and inspect product details

**File:** `tests/saucedemo/discover-and-sort-products.spec.ts`

**Steps:**
  1. Starting in a fresh session, sign in with standard_user / secret_sauce.
    - expect: The Products page shows six products and the sort control defaults to Name (A to Z).
  2. Select Name (Z to A), then Price (low to high), then Price (high to low) from Sort products.
    - expect: The visible product order changes after each selection and follows the selected direction/order.
    - expect: The sort control retains the currently selected option.
  3. Open the Sauce Labs Backpack product using its name or image.
    - expect: A product detail page opens for Sauce Labs Backpack.
    - expect: The detail page shows its product image, name, description, price, and Add to cart control.
  4. Click Back to products.
    - expect: The Products catalog is displayed again.

### 3. 3. Cart management

**Seed:** `tests/seed.spec.ts`

#### 3.1. Add, review, remove, and continue shopping from the cart

**File:** `tests/saucedemo/manage-shopping-cart.spec.ts`

**Steps:**
  1. Starting in a fresh session, sign in with standard_user / secret_sauce. Add one product from the catalog and a different product from its detail page.
    - expect: Each added product's control changes to Remove.
    - expect: The cart badge reflects two items.
  2. Open the cart and review its contents.
    - expect: The cart lists both selected products with quantity one each.
    - expect: The cart badge and listed item count agree.
    - expect: Continue Shopping and Checkout controls are available.
  3. Remove one product from the cart.
    - expect: The removed product no longer appears in the cart.
    - expect: The cart badge and remaining item count decrease by one.
  4. Click Continue Shopping.
    - expect: The Products catalog is displayed again and the remaining cart item is retained.

### 4. 4. Checkout information and order review

**Seed:** `tests/seed.spec.ts`

#### 4.1. Validate required customer fields and review order totals

**File:** `tests/saucedemo/checkout-information-and-review.spec.ts`

**Steps:**
  1. Starting in a fresh session, sign in with standard_user / secret_sauce, add one product to the cart, open the cart, and click Checkout.
    - expect: The Checkout: Your Information page shows First Name, Last Name, and Zip/Postal Code fields.
  2. Leave all fields blank and click Continue.
    - expect: The page does not advance and shows a visible required-field validation error.
  3. Enter Taylor for First Name, Tester for Last Name, and 10001 for Zip/Postal Code; click Continue.
    - expect: The Checkout: Overview page opens.
    - expect: The review lists the selected item, payment information, shipping information, item total, tax, and total.
    - expect: The displayed total equals the item total plus tax.

### 5. 5. Order completion

**Seed:** `tests/seed.spec.ts`

#### 5.1. Finish a reviewed order and confirm completion

**File:** `tests/saucedemo/complete-purchase.spec.ts`

**Steps:**
  1. Starting in a fresh session, sign in with standard_user / secret_sauce, add a product, open the cart, enter Taylor Tester and ZIP 10001 at checkout, and continue to Checkout: Overview.
    - expect: The order review is displayed with the expected product and calculated totals before submission.
  2. Click Finish once.
    - expect: The Checkout: Complete! page is displayed.
    - expect: The page shows Thank you for your order! and the dispatch confirmation message.
    - expect: The cart is empty after the completed order.
  3. Click Back Home.
    - expect: The Products page is displayed and the cart remains empty.
