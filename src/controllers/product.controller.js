import { Product } from "../models/product.models.js";
import { uploadOnCloudnary } from "../utility/cloudinary.services.js";
import { asyncHandler } from "../utility/asyncHandler.js";
import { ApiError } from "../utility/ApiError.js";
import { ApiResponse } from "../utility/ApiResponce.js";
import { User } from "../models/user.models.js";
import { Category } from "../models/category.models.js";

const publishProduct = asyncHandler(async (req, res) => {
    const { name, description, price, category, size, color,stock,} = req.body;
    const categoryItem = await Category.findOne({categoryName: category});
    console.log(categoryItem);
    

    if (!categoryItem) {
        throw new ApiError(400, "invalid Category");
    }

    if ([name, description,price, category, size, color, stock].some(field => field?.trim() === "")) {
        throw new ApiError(404, "All fields are required");
      }
    const userId = req.user?._id; 

    if (!name && !description) {
        throw new ApiError(400, 'Name and description are required');
    }

    if (!userId) {
        throw new ApiError(401, 'User not authenticated');
    }
    
    const user = await User.findById(userId);
    if (!user) {
        throw new ApiError(404, 'User not found');
    }
    const productLocalPath = req.files?.productImage?.[0]?.path;
    console.log(productLocalPath);
    
    if (!productLocalPath) {
        throw new ApiError(400, 'Product image is required');
    }

    const productImage = await uploadOnCloudnary(productLocalPath);

    if (!productImage) {
        throw new ApiError(400, 'Invalid product image');
    }

    const newProduct = new Product({
        name,
        description,
        price,
        category: categoryItem._id,
        size,
        color,
        stock,
        productImage: productImage.url,
        user: userId,
    });

    await newProduct.save(); 

    return res.status(201).json(
        new ApiResponse(201, newProduct, 'Product image uploaded successfully') 
    );
});

export { publishProduct };
