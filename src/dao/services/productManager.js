import productsModel from "../models/products.js";


export default class productsManager {

    getAll = async (limit = 0, page = 0, sortOption, filter) => {
        
        let totalCount = await productsModel.countDocuments(filter);
        console.log("🚀 ~ productsManager ~ getAll= ~ totalCount:", totalCount)
        let options = {
            limit: limit === 0 ? totalCount : limit,
            page: page,
            sort: sortOption,
            lean: true
        };
        let result = await productsModel.paginate(filter, options);
        return { result, totalCount };
    }

    getById = async (id) => {
        let result = await productsModel.findOne({ _id: id }).lean();
        return result;
    }

    addProduct = async (newProduct) => {

        let result = await productsModel.create(newProduct);
        return result;
    }

    addProducts = async (products) => {

        let result = await productsModel.insertMany(products);
        return result;
    }

    updateProduct = async (id, productData) => {

        let result = await productsModel.updateOne({ _id: id }, productData);
        return result;
    }
    delateProduct = async (id) => {

        let result = await productsModel.deleteOne({ _id: id });
        return result;
    }

}

