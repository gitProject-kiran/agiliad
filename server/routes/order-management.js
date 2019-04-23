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
}