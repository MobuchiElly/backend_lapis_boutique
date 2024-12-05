const express = require("express");
const { NotFound, BadRequestError } = require("../errors/index");
const Product = require("../models/Products");
const cloudinary = require("../utils/cloudinary");
const fs = require("fs");

const createProduct = async(req, res) => {
    const { title, description, price, sizes, colors, stockQuantity} = req.body;
    if(!title || !description || !price || !sizes || !colors || !stockQuantity){
        throw new BadRequestError("title, description, price, sizes, colors, images and stockQuantity are required")
    }
    if(!req.file){
        throw new BadRequestError("Atleast one image is required");
    }
    let cloudinaryRes;
    try {
        cloudinaryRes = await cloudinary.uploader.upload(req.file.path, {
            folder: "products", // Optional folder in Cloudinary for organization
        });
    } catch(err) {
        console.error(err)
        fs.unlink(req.file.path, (unlinkErr) => {
            if (unlinkErr) {
                console.error("Failed to delete file:", unlinkErr);
            }
        });        
        throw new BadRequestError("Failed to upload image to Cloudinary. Please try again.")
    };
    const newProduct = await Product.create({
        title,
        description,
        price,
        sizes,
        colors,
        images: [
            {
                url: cloudinaryRes.secure_url,
                altText: req.body.altText || "Product image"
            }
        ],
        stockQuantity,
        isFeatured: req.body.isFeatured || false,
    });
    if(!newProduct) {
        throw new NotFound("Unable to create post");
    }
    res.status(201).json({
        message: "success",
        data: newProduct
    });
}

const getProducts = async(req, res) => {
    try {
        const { title, search, featured, sort } = req.query;
        let queryObj = {};
        let sortObj = {};
        if (title){
            queryObj.title = { $regex:title, $options:"i"};
        }
        //description, sizes, color,
        if (search) {
            queryObj.$or = [
                {title: {$regex:search, $options: "i"}},
                {description: {$regex:search, $options:"i"}},
                {sizes: {$regex:search, $options:"i"}},
                {color: {$regex:search, $options:"i"}}
            ]
        }
        if(featured){
            queryObj.featured = featured;
        }
        
        let productsQuery = Product.find(queryObj);
    
        if(sort === "createdAt" || sort === "updatedAt"){
            sortObj[sort] = -1
        } else {
            sortObj = { updatedAt: -1 };
        }
        productsQuery.sort(sortObj);
    
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.size) || 10;
        const skip = (page - 1) * limit;
    
        const products = await productsQuery.skip(skip).limit(limit);
        if (!products || products.length === 0) {
          throw new NotFound("No products found");
        };
        const totalQueryProducts = await Product.countDocuments(queryObj);
        
        res.status(200).json({data:products, total:totalQueryProducts});
    } catch(err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
}

const getProduct = async(req, res) => {
    const { productId } = req.params;
    const product = await Product.findById(productId);
    if(!product){
        throw new NotFound(`No product with id ${productId}`);
    }
    res.status(200).json({
        message:"success",
        data: product
    })
}

const updateProduct = async(req, res) => {
    const { productId } = req.params;
    const { title, description, price, sizes, colors, stockQuantity, isFeatured } = req.body;
    let cloudinaryRes;
    
    if(!productId){
        throw new BadRequestError("Product ID must be provided in the request parameter");
    }
    if(req.file){
        try{
            cloudinaryRes = await cloudinary.uploader.upload(req.file.path, {
                folder: "products"
            })
        } catch(err){
            console.error(err);
            fs.unlink(req.file.path, (unlinkErr) => {
                console.error("Failed to delete file", unlinkErr);
            });
            throw new BadRequestError("Failed to upload image to Cloudinary. Please try again.")
        }
    }
    const productEdit = {
        ...(title && { title }),
        ...(description && { description }),
        ...(price && { price: parseFloat(price) }),
        ...(sizes && { sizes }),
        ...(colors && { colors }),
        ...(stockQuantity && { stockQuantity: parseInt(stockQuantity, 10) }),
        ...(isFeatured && { isFeatured: req.body.isFeatured || false,}),
        ...(cloudinaryRes && { images: [{
            url: cloudinaryRes.secure_url,
            altText: req.body.altText || "Product image"
        }]}),
      };
      
    const updatedProduct = await Product.findByIdAndUpdate(productId, productEdit);
    if(!updatedProduct){
        throw new BadRequestError("Unable to update product");
    }
    res.status(201).json({
        "message": "success",
        updatedProduct
    });
}

const deleteProduct = async(req, res) => {
    res.send("works")
}

module.exports = {
    createProduct, getProducts,
    getProduct, 
    updateProduct,
    deleteProduct
}