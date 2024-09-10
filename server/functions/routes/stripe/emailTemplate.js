export const emailTemplate = ({
  orderId,
  email,
  orderFullName,
  billingDetails,
  shippingDetails,
  shipCost,
  pickupInStore,
  shippingOption,
  subtotal,
  items,
  amount,
  discountAmount,
  currency,
  createdAt,
  status,
  statusHistory,
}) => `
<html>

<head>
</head>

<body>
  <h3>Thank you for your order!</h3>
  <br>
  <h4>Order Details:</h4>
  <p><strong>Order ID:</strong> ${orderId}</p>
  <p><strong>Name:</strong> ${orderFullName}</p>
  <p><strong>Email:</strong> ${email}</p>

  ${billingDetails ? `
    <h4>Billing Address Details:</h4>
    <ul>
        <li>Default Billing: ${billingDetails.defaultBilling}</li>
        <li>Default Shipping: ${billingDetails.defaultShipping}</li>
        <li>First Name: ${billingDetails.firstName}</li>
        <li>Last Name: ${billingDetails.lastName}</li>
        <li>Full Address: ${billingDetails.location ? billingDetails.location : billingDetails.fullAddress ? billingDetails.fullAddress : 'No billing address'}</li>
    </ul>` : ''}

  ${shippingDetails &&
  `<h4>Shipping Address Details:<h4>
  <ul>
      <li>Default Billing: ${shippingDetails.defaultBilling}</li>
      <li>Default Shipping: ${shippingDetails.defaultShipping}</li>
      <li>First Name: ${shippingDetails.firstName}</li>
      <li>Last Name: ${shippingDetails.lastName}</li>
      <li>Full Address: ${shippingDetails.location ? shippingDetails.location : shippingDetails.fullAddress ? shippingDetails.fullAddress : 'No address'}</li>
    </ul>`
  }
  
  <p><strong>Shipping cost:</strong> ${shipCost}</p>
  ${shippingOption && shippingOption.express ? `<p><strong>Shipping Option (Express):</strong> ${shippingOption.express.type}</p>` : ""}
  ${shippingOption && shippingOption.express ? `<p><strong>Expected Ship Date (Express):</strong> ${shippingOption.express.expectedShipDate}</p>` : ""}

  <p><strong>Pickup in Store:</strong> ${pickupInStore ? 'Yes' : 'No'}</p>
  <p><strong>Subtotal:</strong> ${subtotal}</p>
  <p><strong>Discount Amount:</strong> ${discountAmount}</p>
  <p><strong>Total Amount:</strong> ${amount}</p>
  <p><strong>Order Date:</strong> ${createdAt}</p>
  <p><strong>Status:</strong> ${status}</p>
  <br>
  <h4>Order Items:</h4>
  <ul>
  ${items && items.length > 0 ? items.map(item => `
    <li>
      <strong>${item.product.title}</strong>
      <p>Quantity: ${item.quantity}</p>
      <p>Price: ${item.product.price}</p>
    </li>
  `).join('') : ''}
</ul>
<br>

  <h2>Status History:</h2>
  <ul>
  ${statusHistory && statusHistory.length > 0 ? statusHistory.map(history => `
    <li>
      <strong>${history.status}</strong>
      <p>Date: ${history.date}</p>
    </li>
  `).join('') : ''}
</ul>

</body>

</html>
`;
