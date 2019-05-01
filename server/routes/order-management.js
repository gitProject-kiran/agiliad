const _ = require('lodash');
module.exports = function (router) {
    router.get('/getAllModels', (req, res) => {
        let getBrandId = "SELECT brand_id FROM brands WHERE brand_name = '" + req.query.brand_name +"'";
        db.query(getBrandId, function (err, brand) {
            if (err) {
                console.log('err',err);
                res.status(400).send({ message: "Unable to connect db!!" })
            } else {
                let getBrandId = "SELECT product_id FROM products WHERE product_name = '" + req.query.product_name +"'";
                db.query(getBrandId, function (err, product) {
                    if (err) {
                        console.log('err',err);
                        res.status(400).send({ message: "Unable to connect db!!" })
                    } else {
                        let brandId = brand[0].brand_id;
                        let productId = product[0].product_id;
                        let getModels = "SELECT * FROM model_info WHERE brand_id = '" + brandId +"' AND prod_id = '"+ productId +"'";
                        db.query(getModels, function (err, models) {
                            if (err) {
                                res.status(400).send({ message: "Unable to connect db!!" })
                            } else {
                                res.status(200).send(models)
                            }
                        });
                    }
                });   
            }
        });    
    });

    router.post('/placeOrder', (req, res) => {
        db.beginTransaction(function(err) {
            if (err) {                  //Transaction Error (Rollback and release connection)
                db.rollback(function() {
                   res.status(400).send({ message: "Unable to connect db!!" })
                });
            } else {
                let address = req.body.address;
                let addr = address.address +', '+ address.city +', '+ address.state;
                let name = address.firstName + ' ' + address.lastName ;
                let insertAddress = "INSERT INTO `customer_info` (cust_name, cust_address, cust_phone, cust_gst, cust_pincode) VALUES ('" + name + "', '" + addr + "', '" + address.mobileNumber + "', '" + address.gstNumber + "', '" + address.pincode +"')";
                db.query(insertAddress, function (err, custInfo) {
                    if (err) {
                        db.rollback(function() {
                            res.status(400).send({ message: "Unable to insert customer info!!" })
                         });
                    } else {
                        console.log(custInfo.insertId);
                        let custId = custInfo.insertId;
                        let createInvoiceId = "INSERT INTO `invoice` (customer_id, created_at) VALUES ('" + custId +"', '"+ address.dateControl +"')";
                        db.query(createInvoiceId, function (err, invoiceId) {
                            if (err) {
                                db.rollback(function() {
                                    res.status(400).send({ message: "Unable to invoice Id!!" })
                                 });
                            } else {
                                let id = invoiceId.insertId;
                                let orders = req.body.cart;
                                let values = []                              ;
                                let insertProducts = "INSERT INTO order_details (invoice_id, product_name, brand_name, model_name, price, quantity, cgst, sgst) VALUES ?";
                                for(var i = 0; i<_.size(orders); i++){
                                    var item = [id, orders[i].productControl, orders[i].brandControl, orders[i].modelControl.model_name, orders[i].priceControl,orders[i].quantityControl, orders[i].modelControl.cgst, orders[i].modelControl.sgst];
                                    values.push(item);
                                  } 
                                db.query(insertProducts, [values], function (err, invoiceId) {
                                    if (err) {
                                        db.rollback(function() {
                                            res.status(400).send({ message: "Unable to insert order!!" })
                                         });
                                    } else {
                                        db.commit(function(err) {
                                            if (err) {
                                                db.rollback(function() {
                                                    res.status(400).send({ message: "Unable to insert order!!" })
                                                });
                                            } else {
                                                res.status(200).send({ invoiceId: id })
                                            }
                                        });
                                    }
                                }); 
                            }
                        });    
                    }
                });    
            }
        });    
        
    }) 

    router.get('/getInvoiceDetails', (req, res) => {
        let invoiceId = req.query.invoiceId;
        console.log('id', invoiceId);
        let getCustId = "SELECT * FROM invoice AS i, order_details AS o WHERE i.id = '" + invoiceId +"' AND o.invoice_id = '"+ invoiceId +"'";
        db.query(getCustId, function (err, prod) {
            if (err) {                
                res.status(400).send({ message: err })
            } else {
                let custId = prod[0].customer_id;
                let getCustInfo = "SELECT * FROM customer_info WHERE cust_id = '" + custId +"'";
                db.query(getCustInfo, function (err, custInfo) {
                    if (err) {                
                        res.status(400).send({ message: err })
                    } else {
                        res.status(200).send({
                            customer_info: custInfo,
                            productDetails: prod
                        })
                    }
                });
            }
        });
    });
}