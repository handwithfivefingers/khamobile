import user from './user'
import category from './category'
import product from './product'
import productAttribute from './product_attributes'
import productAttributeTerm from './product_attribute_term'
import productVariant from './product_variant'
import page from './page'

import productCategory from './product_category'
import post from './post'
import order from './order'
import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const { Schema, model } = mongoose

const userSchema = new Schema({ ...user }, { timestamps: true })

const categorySchema = new Schema({ ...category }, { timestamps: true })

const productSchema = new Schema({ ...product }, { timestamps: true })

const productVariantSchema = new Schema({ ...productVariant }, { timestamps: true })

const productAttributeSchema = new Schema({ ...productAttribute }, { timestamps: true })

const productAttributeTermSchema = new Schema({ ...productAttributeTerm }, { timestamps: true })

const productCategorySchema = new Schema({ ...productCategory }, { timestamps: true })

const postSchema = new Schema({ ...post }, { timestamps: true })

const orderSchema = new Schema({ ...order }, { timestamps: true })

const pageSchema = new Schema({ ...page }, { timestamps: true })

// Add method, Virtual

userSchema.method({
  authenticate: async function (password) {
    console.log(password, this.hash_password)
    return await bcrypt.compare(password, this.hash_password)
  },
})

productVariantSchema.virtual('attr', {
  ref: 'ProductAttributeTerm',
  localField: 'attributes',
  foreignField: '_id',
})


productVariantSchema.set('toObject', { virtuals: true })

productVariantSchema.set('toJSON', { virtuals: true })

// Register Collection
const User = model('User', userSchema)

const Category = model('Category', categorySchema)

const Product = model('Product', productSchema)

const ProductAttribute = model('ProductAttribute', productAttributeSchema)

const ProductAttributeTerm = model('ProductAttributeTerm', productAttributeTermSchema)

const ProductVariant = model('ProductVariant', productVariantSchema)

const ProductCategory = model('ProductCategory', productCategorySchema)

const Post = model('Post', postSchema)

const Order = model('Order', orderSchema)

const Page = model('Page', pageSchema)

export { Category, Product, User, Post, ProductAttribute, ProductVariant, ProductCategory, ProductAttributeTerm, Order , Page}
