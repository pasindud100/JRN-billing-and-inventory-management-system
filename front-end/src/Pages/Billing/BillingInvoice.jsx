import React, { useState } from "react";
import { Breadcrumb, Button, Col, Form, Row, Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import InvoicePreview from "./InvoicePreview";
import axios from "axios";

function BillingInvoice() {
  const [productData, setProductData] = useState([]);
  const [formData, setFormData] = useState({
    category: "",
    product: "",
    gauge: "",
    unit: "",
    color: "",
    qty: "",
    uPrice: "",
    discount: "",
    editIndex: null, // to keep track of the product being edited
  });

  const [customerName, setCustomerName] = useState("");
  const [customerCity, setCustomerCity] = useState("");
  const [customerTel, setCustomerTel] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");

  const handlePaymentStatusChange = (e) => {
    setPaymentStatus(e.target.value);
  };

  // state for total calculation
  const [totals, setTotals] = useState({
    subtotal: 0,
    totalDiscount: 0,
    grandTotal: 0,
  });

  // handle form input change when adding invoice data
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const clearProductForm = () => {
    setFormData({
      category: "",
      product: "",
      gauge: "",
      unit: "",
      color: "",
      qty: "",
      uPrice: "",
      discount: "",
      editIndex: null, // this for reset the edit index
    });
  };

  // adding or updating product in the table
  const handleAddOrUpdateProduct = (e) => {
    const { qty, uPrice, discount, editIndex } = formData;
    const totalBeforeDiscount = Number(qty) * Number(uPrice);
    const total =
      totalBeforeDiscount - (totalBeforeDiscount * Number(discount)) / 100;

    if (editIndex !== null) {
      // If editing an existing product, we can update it
      const updatedProductData = [...productData];
      updatedProductData[editIndex] = { ...formData, total };
      setProductData(updatedProductData);
      calculateTotals(updatedProductData);
    } else {
      // add a new product
      const newProductData = [...productData, { ...formData, total }];
      setProductData(newProductData);
      calculateTotals(newProductData);
      setShowDataTable(true); // Show the data table after adding the first item
    }
    clearProductForm();
  };

  // Calculate totals dynamically when adding items continuously
  // Calculate totals dynamically when adding items continuously
  const calculateTotals = (products) => {
    const updatedTotals = products.reduce(
      (acc, product) => {
        acc.subtotal += Number(product.qty) * Number(product.uPrice);
        acc.totalDiscount +=
          (Number(product.qty) *
            Number(product.uPrice) *
            Number(product.discount)) /
          100;
        acc.grandTotal += product.total;
        return acc;
      },
      { subtotal: 0, totalDiscount: 0, grandTotal: 0 }
    );

    setTotals(updatedTotals);
  };
  // this for handling editing a product
  const handleEditProduct = (index) => {
    const product = productData[index];
    setFormData({
      ...product,
      editIndex: index, // Set the index to edit
    });
  };

  //*********************************************************************
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);

  const invoiceData = {
    date: new Date().toLocaleDateString(), // format is MM/DD/YYYY
    time: new Date().toLocaleTimeString(), // format is HH:MM:SS AM/PM
    customerName: customerName,
    customerCity: customerCity,
    customerTel: customerTel,
    products: productData,
    totals,
  };

  const handlePreviewClick = async () => {
    const invoicePayload = {
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString(),
      customer: {
        name: customerName,
        address: customerCity,
        telephone: customerTel,
      },
      products: productData, // this for all products in single array
      totals, // subtotal , discounts, and grand total
      paymentStatus,
    };

    try {
      const response = await axios.post(
        "http://localhost:8000/api/invoices",
        invoicePayload
      );
      console.log("Invoice saved:", response.data);
      setShowInvoiceModal(true);
    } catch (error) {
      console.error(
        "Error saving invoice:",
        error.response?.data || error.message
      );
    }
  };

  const handleCloseModal = () => setShowInvoiceModal(false);

  const clearAllData = () => {
    setFormData({
      category: "",
      product: "",
      gauge: "",
      unit: "",
      color: "",
      qty: "",
      uPrice: "",
      discount: "",
      editIndex: null,
    });
    setProductData([]);

    setTotals({
      subtotal: 0,
      totalDiscount: 0,
      grandTotal: 0,
    });
    setCustomerName("");
    setCustomerCity("");
    setCustomerTel("");
    setShowDataTable(false);
  };

  const productNames = [
    "Normal Roofing",
    "Tile Roofing",
    "Gutter",
    "Barge Flashing",
    "Down Pipe",
    "Ridge Cover",
    "Valley Gutter",
    "Valance Board",
    "Wall Flashing",
    "Nozzles",
    "End Cap",
    "Bracket",
  ];
  const units = ["Ft", "Nos"];
  const colors = ["Autom Red", "Blue", "Chocolate Brown", "Green", "Meroon"];
  const gauges = ["0.47", "0.35", "0.30", "0.25", "0.20"];

  const [showDataTable, setShowDataTable] = useState(false);
  return (
    <div className="container">
      <Breadcrumb className="ml-4">
        <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/" }}>
          JRN
        </Breadcrumb.Item>
        <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/billing" }}>
          Billing
        </Breadcrumb.Item>
        <Breadcrumb.Item active>Invoice</Breadcrumb.Item>
      </Breadcrumb>
      <Form className="px-4 py-3 bg-white shadow rounded">
        <div className="border border-gray-300 rounded mb-4">
          <div className="p-4 bg-gray-100 rounded mb-4">
            <h5 className="font-semibold">Customer Details</h5>
            <Row className="g-3">
              <Col md={4}>
                <Form.Group controlId="customerName">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter name"
                    name="customerName"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group controlId="customerCity">
                  <Form.Label>City</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter city"
                    name="customerCity"
                    value={customerCity}
                    onChange={(e) => setCustomerCity(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group controlId="customerTel">
                  <Form.Label>Tel</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter telephone"
                    name="customerTel"
                    value={customerTel}
                    onChange={(e) => setCustomerTel(e.target.value)}
                  />
                </Form.Group>
              </Col>
            </Row>
          </div>

          <div className="p-4 bg-gray-100 mb-4">
            <h5 className="font-semibold">Product Details</h5>
            <Row className="g-3">
              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>Product Name</Form.Label>
                  <Form.Control
                    as="select"
                    value={formData.product}
                    name="product"
                    onChange={handleChange}
                  >
                    <option value="" disabled>
                      Select a Product
                    </option>
                    {productNames.map((name, i) => (
                      <option key={i} value={name}>
                        {name}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>
              </Col>

              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>Color</Form.Label>
                  <Form.Control
                    as="select"
                    value={formData.color}
                    name="color"
                    onChange={handleChange}
                  >
                    <option value="" disabled>
                      Select a Color
                    </option>
                    {colors.map((color, i) => (
                      <option key={i} value={color}>
                        {color}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>
              </Col>

              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>Gauge</Form.Label>
                  <Form.Control
                    as="select"
                    value={formData.gauge}
                    name="gauge"
                    onChange={handleChange}
                  >
                    <option value="" disabled>
                      Select a gauge
                    </option>
                    {gauges.map((gauge, i) => (
                      <option key={i} value={gauge}>
                        {gauge}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>Unit</Form.Label>
                  <Form.Control
                    as="select"
                    value={formData.unit}
                    name="unit"
                    onChange={handleChange}
                  >
                    <option value="" disabled>
                      Select a unit
                    </option>
                    {units.map((unit, i) => (
                      <option key={i} value={unit}>
                        {unit}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>
              </Col>
            </Row>

            <Row className="g-3 mt-3">
              <Col md={3}>
                <Form.Group controlId="productQty">
                  <Form.Label>Qty</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter quantity"
                    name="qty"
                    value={formData.qty}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>

              <Col md={3}>
                <Form.Group controlId="productUnitPrice">
                  <Form.Label>Unit Price</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter unit price"
                    name="uPrice"
                    value={formData.uPrice}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group controlId="productDiscount">
                  <Form.Label>Discount</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter discount"
                    name="discount"
                    value={formData.discount}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
              <Col className="d-flex align-items-center justify-content-end mt-4">
                <div className="d-flex gap-3">
                  <Button variant="danger" onClick={clearProductForm}>
                    Clear
                  </Button>
                  <Button variant="primary" onClick={handleAddOrUpdateProduct}>
                    {formData.editIndex !== null ? "Update" : "Add"}
                  </Button>
                </div>
              </Col>
            </Row>
          </div>
        </div>

        {showDataTable && (
          <>
            <div className="mb-4">
              <div className="p-4 bg-gray-100 rounded">
                <h5 className="font-semibold">Items</h5>
                <Table bordered hover responsive>
                  <thead>
                    <tr>
                      <th></th>
                      <th>Product Name</th>
                      <th>Gauge</th>
                      <th>Unit</th>
                      <th>Color</th>
                      <th>Qty</th>
                      <th>Unit Price</th>
                      <th>Discount</th>
                      <th>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {productData.map((product, index) => (
                      <tr key={index} onClick={() => handleEditProduct(index)}>
                        <td>{index + 1}</td>
                        <td>{product.product}</td>
                        <td>{product.gauge}</td>
                        <td>{product.unit}</td>
                        <td>{product.color}</td>
                        <td>{product.qty}</td>
                        <td>{product.uPrice}</td>
                        <td>{product.discount}</td>
                        <td>{product.total}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </div>
            <div className="mb-4">
              <div className="p-4 bg-gray-100 rounded">
                <div className="d-flex align-items justify-content-end gap-10 pl-6">
                  <div className="d-flex align-items-center gap-2">
                    <Form className="px-4 py-2 bg-white shadow rounded">
                      <Form.Group controlId="paymentStatus" className="mt-3">
                        <Form.Label>Payment Status</Form.Label>
                        <Form.Control
                          as="select"
                          value={paymentStatus}
                          onChange={handlePaymentStatusChange}
                        >
                          <option value="" disabled>
                            Select Payment Status
                          </option>
                          <option value="Paid">Paid</option>
                          <option value="Unpaid">Unpaid</option>
                          <option value="Part Paid">Part Paid</option>
                        </Form.Control>
                      </Form.Group>
                    </Form>
                  </div>
                  <div>
                    <h5 className="font-semibold ">Invoice Summary</h5>
                    <p>
                      Subtotal:{" "}
                      <span className="pl-10 font-semibold">
                        {totals.subtotal.toFixed(2)}
                      </span>
                    </p>
                    <p>
                      Total Discount:{" "}
                      <span className="pl-2 font-semibold">
                        {totals.totalDiscount.toFixed(2)}
                      </span>
                    </p>
                    <p>
                      Grand Total:{" "}
                      <span className="pl-6 font-semibold">
                        {totals.grandTotal.toFixed(2)}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="d-flex justify-content-end gap-3">
              <Button variant="danger" onClick={clearAllData}>
                Clear
              </Button>
              <Button variant="primary" onClick={handlePreviewClick}>
                Generate
              </Button>
            </div>
            <div>
              <InvoicePreview
                show={showInvoiceModal}
                handleClose={handleCloseModal}
                invoiceData={invoiceData}
              />
            </div>
          </>
        )}
      </Form>
    </div>
  );
}

export default BillingInvoice;
