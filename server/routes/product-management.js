const _ = require('lodash');
module.exports = function (router) {
    router.get('/models', (req, res) => {
        let query = "SELECT p.product_name AS product, b.brand_name AS brand, m.model_name AS model, m.quantity AS quantity FROM model_info AS m, products AS p, brands AS b WHERE m.brand_id = b.brand_id AND m.prod_id = p.product_id";
        db.query(query, function (err, result) {
            if (err) {
                console.log('err',err);
                res.status(400).send({ message: "Unable to connect db!!" })
            } else {
                res.status(200).json({ 
                    result: result
                });  
            }
        });    
    });

    router.get('/brands', (req, res) => {
        let query = "SELECT brand_name FROM brands";
        db.query(query, function (err, result) {
            if (err) {
                console.log('err',err);
                res.status(400).send({ message: "Unable to connect db!!" })
            } else {
                res.status(200).json({ 
                    result: result
                });  
            }
        });    
    });

    router.get('/products', (req, res) => {
        let query = "SELECT product_name FROM products";
        db.query(query, function (err, result) {
            if (err) {
                console.log('err',err);
                res.status(400).send({ message: "Unable to connect db!!" })
            } else {
                res.status(200).json({ 
                    result: result
                });  
            }
        });    
    });

    function gotProductId(req, res, brandId, productId, fields){
        let isModelPresent = "SELECT model_name FROM model_info WHERE model_name = '" + fields.modelNo + "'";                
        db.query(isModelPresent, function (err, model) {
            if (err) {
                res.status(400).send({ message: "Something went wrong is isModelPresent, Please try again!!" })
            } else {
                if (_.size(model) > 0) {   
                    res.status(400).json({ 
                        message: 'Already presented model'
                    });
                } else {
                    let insertProduct = "INSERT INTO `model_info` (model_name, quantity, mrp_price, sgst, cgst, brand_id, prod_id) VALUES ('" + fields.modelNo + "', '" + fields.quantity + "', '" + fields.mrpPrice+ "', '" + fields.sgst + "', '" + fields.cgst + "', '" + brandId + "', '" + productId +"')";
                    db.query(insertProduct, function (err, modelResult) {

                        if (err) {
                            res.status(400).send({ message: "Something went wrong inserting modelResult, Please try again!!" })
                        } else {
                            res.status(200).json({ 
                                message: 'Succesfully added model'
                            });
                        }
                    });
                }
            }
        });
    }

    function gotBrandId(req, res, brandId, fields){
        let isProductPresent = "SELECT product_id FROM products WHERE product_name = '" + fields.productControl + "'";                
        db.query(isProductPresent, function (err, product) {
            if (err) {
                res.status(400).send({ message: "Something went wrong is isProductPresent, Please try again!!" })
            } else {
                if (_.size(product) > 0) {   
                    gotProductId(req, res, brandId, product[0].product_id, fields)
                } else {
                    let insertProduct = "INSERT INTO `products` (product_name) VALUES ('" + fields.productControl + "')";
                    db.query(insertProduct, function (err, productResult) {
                        if (err) {
                            res.status(400).send({ message: "Something went wrong inserting insertProduct, Please try again!!" })
                        } else {
                            gotBrandId(req, res, brandId, productResult[0].product_id, fields);
                        }
                    });
                }
            }
        });
    }

    router.post('/registerModel', (req, res) => {
        var fields = req.body;
        let isBrandPresent = "SELECT brand_id FROM brands WHERE brand_name = '" + fields.brandControl + "'";
        db.query(isBrandPresent, function (err, brand) {
            if (err) {
                res.status(400).send({ message: "Something went wrong, Please try again!!" })
            } else {
                if (_.size(brand) > 0) {   
                    gotBrandId(req, res, brand[0].brand_id, fields)
                } else {
                    let insertBrand = "INSERT INTO `brands` (brand_name) VALUES ('" + fields.brandControl + "')";
                    db.query(insertBrand, function (err, brandResult) {
                        if (err) {
                            res.status(400).send({ message: "Something went wrong inserting brand id, Please try again!!" })
                        } else {
                            gotBrandId(req, res, brandResult[0].brand_id, fields);
                        }
                    });
                }
            }
        });
    });

    router.get('/getModelInfo', (req, res) => {
        let query = "SELECT * FROM model_info WHERE model_name = '"+ req.query.modelNo + "'";
        db.query(query, function (err, result) {
            if (err) {
                console.log('err',err);
                res.status(400).send({ message: "Unable to connect db!!" })
            } else {
                let getBrandAndProduct = "SELECT b.brand_name AS brandControl, p.product_name AS productControl FROM brands AS b, products AS p WHERE b.brand_id = '"+ result[0].brand_id + "' AND p.product_id = '"+ result[0].prod_id + "'";
                db.query(getBrandAndProduct, function (err, brandProduct) {
                    if (err) {
                        console.log('err',err);
                        res.status(400).send({ message: "Unable to connect db!!" })
                    } else {
                        res.status(200).json({ 
                            result: {
                                brandControl:brandProduct[0].brandControl,
                                productControl:brandProduct[0].productControl,
                                modelNo:result[0].model_name,
                                mrpPrice:result[0].mrp_price,
                                quantity:result[0].quantity,
                                sgst:result[0].sgst,
                                cgst:result[0].cgst
                            }
                        }); 
                    }
                });
            }
        });    
    });

    router.put('/updateModelInfo', (req, res) => {
        var fields = req.body;
        
        var updateModelInfo = "UPDATE model_info SET mrp_price = '" + fields.mrpPrice + "', quantity='"+ fields.quantity +"', sgst='"+ fields.sgst +"', cgst='"+ fields.cgst +"' WHERE model_name= '"+ fields.modelNo +"'";
        console.log("update ", fields);
        db.query(updateModelInfo, function (err, result) {
            if (err) {
                res.status(400).send({ message: "Something went wrong, Please try again!!" })
            } else {
                console.log("result", result);
                res.status(200).send({ message: "Succesfully updated!!" })
            }
        });
    });
}    