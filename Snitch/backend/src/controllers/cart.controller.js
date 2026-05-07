import { Cart } from "../models/cart.model.js";
import Product from "../models/product.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

/**
 * @desc    Add product to cart (Supports Guest & Authenticated)
 * @route   POST /api/v1/cart/add
 * @access  Public / Private
 */
export const addToCart = asyncHandler(async (req, res) => {
    const { productId, quantity = 1, size, guestId } = req.body;

    // 1. Validation
    if (!productId || !size) {
        throw new ApiError(400, "Product ID and size are required");
    }

    if (quantity < 1 || quantity > 10) {
        throw new ApiError(400, "Quantity must be between 1 and 10");
    }

    // 2. Identification (User or Guest)
    const userId = req.user?._id;
    if (!userId && !guestId) {
        throw new ApiError(400, "User must be logged in or a guestId must be provided");
    }

    // 3. Fetch Product
    const product = await Product.findById(productId);
    if (!product) {
        throw new ApiError(404, "Product not found");
    }

    // Size validation
    const availableSizes = Array.isArray(product.attributes?.sizes) 
        ? product.attributes.sizes 
        : (product.attributes?.size ? [product.attributes.size] : []);

    if (availableSizes.length > 0 && !availableSizes.includes(size)) {
        throw new ApiError(400, `Size '${size}' is not available for this product.`);
    }

    // 4. Find or Create Cart
    let cart;
    if (userId) {
        cart = await Cart.findOne({ user: userId });
    } else {
        cart = await Cart.findOne({ guestId: guestId });
    }

    if (!cart) {
        cart = new Cart({
            items: [],
            totalPrice: { amount: 0, currency: product.price.currency }
        });

        if (userId) {
            cart.user = userId;
        } else {
            cart.guestId = guestId;
        }
    }

    // 5. Check if item already exists in cart
    const itemIndex = cart.items.findIndex(
        (item) => (item.product._id || item.product).toString() === productId && item.size === size
    );

    const currentQty = itemIndex > -1 ? cart.items[itemIndex].quantity : 0;
    const totalRequestedQuantity = currentQty + quantity;

    if (product.stock < totalRequestedQuantity) {
        throw new ApiError(
            400, 
            `Insufficient stock. Only ${product.stock} units are available.`
        );
    }

    if (totalRequestedQuantity > 10) {
        throw new ApiError(400, "Maximum 10 units allowed per item in cart.");
    }

    // 6. Add or Update Item
    if (itemIndex > -1) {
        // Update existing item
        cart.items[itemIndex].quantity = totalRequestedQuantity;
        cart.items[itemIndex].subtotal.amount = product.price.amount * totalRequestedQuantity;
    } else {
        // Add new item
        cart.items.push({
            product: productId,
            size,
            quantity,
            price: { 
                amount: product.price.amount,
                currency: product.price.currency 
            },
            subtotal: {
                amount: product.price.amount * quantity,
                currency: product.price.currency
            }
        });
    }

    await cart.save();

    const matchQuery = userId ? { user: userId } : { guestId };
    const finalCart = await getAggregatedCart(matchQuery);

    return res
        .status(200)
        .json(new ApiResponse(200, finalCart, "Product added to cart successfully"));
});

/**
 * @desc    Merge guest cart into user cart on login
 * @route   POST /api/v1/cart/merge
 * @access  Private
 */
export const mergeCart = asyncHandler(async (req, res) => {
    const { guestId } = req.body;
    const userId = req.user._id;

    if (!guestId) {
        throw new ApiError(400, "Guest ID is required for merging carts");
    }

    // 1. Fetch both carts
    const guestCart = await Cart.findOne({ guestId });
    const userCart = await Cart.findOne({ user: userId });

    // 2. If no guest cart, just return the user cart
    if (!guestCart) {
        return res
            .status(200)
            .json(new ApiResponse(200, userCart, "No guest cart found to merge"));
    }

    // 3. If no user cart exists, transfer the guest cart to the user
    if (!userCart) {
        guestCart.user = userId;
        guestCart.guestId = undefined;
        await guestCart.save();
        
        const populatedCart = await Cart.findById(guestCart._id).populate("items.product", "title images attributes stock price");
        return res
            .status(200)
            .json(new ApiResponse(200, populatedCart, "Guest cart successfully associated with user"));
    }

    // 4. Both carts exist, perform smart merge
    for (const guestItem of guestCart.items) {
        // Verify product still exists and get stock
        const product = await Product.findById(guestItem.product);
        if (!product) continue;

        // Check if same product + size exists in user cart
        const userItemIndex = userCart.items.findIndex(
            (item) => 
                (item.product._id || item.product).toString() === (guestItem.product._id || guestItem.product).toString() && 
                item.size === guestItem.size
        );

        if (userItemIndex > -1) {
            // Match found: Increase quantity (capped at 10)
            const currentQty = userCart.items[userItemIndex].quantity;
            const combinedQty = currentQty + guestItem.quantity;
            const finalizedQty = Math.min(combinedQty, 10);
            
            // Only update if stock allows
            if (product.stock >= finalizedQty) {
                userCart.items[userItemIndex].quantity = finalizedQty;
                userCart.items[userItemIndex].subtotal.amount = 
                    finalizedQty * userCart.items[userItemIndex].price.amount;
            }
        } else {
            // No match: Add as new item (capped at 10, check stock)
            const finalizedQty = Math.min(guestItem.quantity, 10);
            if (product.stock >= finalizedQty) {
                // Ensure the quantity is capped in the guestItem before pushing
                guestItem.quantity = finalizedQty;
                guestItem.subtotal.amount = finalizedQty * guestItem.price.amount;
                userCart.items.push(guestItem);
            }
        }
    }

    // 5. Finalize user cart
    userCart.totalPrice.amount = userCart.items.reduce((total, item) => total + item.subtotal.amount, 0);
    // Currency remains same as per our design (INR/USD)
    
    await userCart.save();

    // 6. Cleanup guest cart
    await Cart.findByIdAndDelete(guestCart._id);

    const populatedCart = await Cart.findById(userCart._id).populate("items.product", "title images attributes stock price");

    return res
        .status(200)
        .json(new ApiResponse(200, populatedCart, "Shopping session merged successfully"));
});

/**
 * @desc    Update quantity of an item in cart
 * @route   PATCH /api/v1/cart/update
 * @access  Public / Private
 */
export const updateCartItem = asyncHandler(async (req, res) => {
    const { productId, size, quantity, newSize, guestId } = req.body;
    const userId = req.user?._id;

    // 1. Identification
    if (!userId && !guestId) {
        throw new ApiError(400, "User must be logged in or a guestId must be provided");
    }

    // 2. Find Cart
    let cart;
    if (userId) {
        cart = await Cart.findOne({ user: userId });
    } else {
        cart = await Cart.findOne({ guestId });
    }

    if (!cart) {
        throw new ApiError(404, "Cart not found");
    }

    // 3. Find Item
    const itemIndex = cart.items.findIndex(
        (item) => (item.product._id || item.product).toString() === productId && item.size === size
    );

    if (itemIndex === -1) {
        throw new ApiError(404, "Item not found in cart");
    }

    const product = await Product.findById(productId);
    if (!product) {
        throw new ApiError(404, "Product not found");
    }

    // 4. Handle Size Change (if newSize provided)
    if (newSize && newSize !== size) {
        // Validate new size
        const availableSizes = Array.isArray(product.attributes?.sizes) 
            ? product.attributes.sizes 
            : (product.attributes?.size ? [product.attributes.size] : []);

        if (availableSizes.length > 0 && !availableSizes.includes(newSize)) {
            throw new ApiError(400, `Size '${newSize}' is not available for this product.`);
        }

        // Check if newSize already exists in cart for this product
        const duplicateIndex = cart.items.findIndex(
            (item, idx) => idx !== itemIndex && item.product.toString() === productId && item.size === newSize
        );

        if (duplicateIndex > -1) {
            // Merge quantities
            const combinedQty = Math.min(cart.items[duplicateIndex].quantity + (quantity || cart.items[itemIndex].quantity), 10);
            cart.items[duplicateIndex].quantity = combinedQty;
            cart.items[duplicateIndex].subtotal.amount = product.price.amount * combinedQty;
            
            // Remove the old size item
            cart.items.splice(itemIndex, 1);
        } else {
            // Just update the size
            cart.items[itemIndex].size = newSize;
        }
    }

    // 5. Update Quantity (if item still exists and quantity provided)
    const finalItemIndex = newSize && cart.items.findIndex(i => i.product.toString() === productId && i.size === newSize) !== -1 
        ? cart.items.findIndex(i => i.product.toString() === productId && i.size === newSize)
        : itemIndex;

    if (cart.items[finalItemIndex] && quantity !== undefined) {
        if (product.stock < quantity) {
            throw new ApiError(400, `Only ${product.stock} units available in stock`);
        }
        cart.items[finalItemIndex].quantity = quantity;
        cart.items[finalItemIndex].subtotal.amount = product.price.amount * quantity;
    }

    await cart.save();

    const matchQuery = userId ? { user: userId } : { guestId };
    const finalCart = await getAggregatedCart(matchQuery);

    return res
        .status(200)
        .json(new ApiResponse(200, finalCart, "Cart updated successfully"));
});

/**
 * @desc    Remove an item from cart completely
 * @route   DELETE /api/v1/cart/remove
 * @access  Public / Private
 */
export const removeFromCart = asyncHandler(async (req, res) => {
    const { productId, size, guestId } = req.body;
    const userId = req.user?._id;

    // 1. Identification
    if (!userId && !guestId) {
        throw new ApiError(400, "User must be logged in or a guestId must be provided");
    }

    // 2. Find Cart
    let cart;
    if (userId) {
        cart = await Cart.findOne({ user: userId });
    } else {
        cart = await Cart.findOne({ guestId });
    }

    if (!cart) {
        throw new ApiError(404, "Cart not found");
    }

    // 3. Remove Item
    const initialItemCount = cart.items.length;
    cart.items = cart.items.filter(
        (item) => item.product.toString() !== productId || item.size !== size
    );

    if (cart.items.length === initialItemCount) {
        throw new ApiError(404, "Item not found in cart");
    }

    await cart.save();

    const matchQuery = userId ? { user: userId } : { guestId };
    const finalCart = await getAggregatedCart(matchQuery);

    return res
        .status(200)
        .json(new ApiResponse(200, finalCart, "Item removed from cart successfully"));
});

/**
 * Helper: Calculate Cart Totals using MongoDB Aggregation Pipeline
 * This performs all joins and math directly in the database for maximum efficiency.
 */
const getAggregatedCart = async (matchQuery) => {
    const cart = await Cart.aggregate([
        { $match: matchQuery },
        // 1. Unwind items to process them individually
        { $unwind: { path: "$items", preserveNullAndEmptyArrays: true } },
        // 2. Join with Products to get latest pricing/stock
        {
            $lookup: {
                from: "products",
                localField: "items.product",
                foreignField: "_id",
                as: "productDetails"
            }
        },
        { $unwind: { path: "$productDetails", preserveNullAndEmptyArrays: true } },
        // 3. Calculate Item Subtotals and Discounts
        {
            $addFields: {
                "items.subtotal.amount": {
                    $multiply: [
                        { $ifNull: ["$items.quantity", 0] },
                        { 
                            $ifNull: [
                                "$productDetails.price.discountedAmount", 
                                "$productDetails.price.amount", 
                                0
                            ] 
                        }
                    ]
                },
                "items.subtotal.currency": "$productDetails.price.currency",
                "items.price": "$productDetails.price",
                "items.product": {
                    id: "$productDetails._id", // Only keep 'id' for the frontend
                    title: "$productDetails.title",
                    images: "$productDetails.images",
                    attributes: "$productDetails.attributes",
                    stock: "$productDetails.stock"
                }
            }
        },
        // 4. Re-group into a single cart document and sum up totals
        {
            $group: {
                _id: "$_id",
                user: { $first: "$user" },
                guestId: { $first: "$guestId" },
                items: {
                    $push: {
                        $cond: [
                            { $gt: ["$items.quantity", 0] },
                            "$items",
                            "$$REMOVE"
                        ]
                    }
                },
                totalAmount: { $sum: "$items.subtotal.amount" },
                currency: { $first: "$productDetails.price.currency" }
            }
        },
        // 5. Final projection - Renaming _id to id and cleaning up
        {
            $project: {
                _id: 0,
                id: "$_id",
                user: 1,
                guestId: 1,
                items: 1,
                totalPrice: {
                    amount: "$totalAmount",
                    currency: { $ifNull: ["$currency", "INR"] }
                }
            }
        }
    ]);

    return cart[0] || null;
};

/**
 * @desc    Get user or guest cart
 * @route   GET /api/v1/cart
 * @access  Public / Private
 */
export const getCart = asyncHandler(async (req, res) => {
    const userId = req.user?._id;
    const { guestId } = req.query;

    if (!userId && !guestId) {
        throw new ApiError(400, "User must be logged in or a guestId must be provided");
    }

    const matchQuery = userId ? { user: userId } : { guestId };
    
    // Execute the optimized aggregation pipeline
    const aggregatedCart = await getAggregatedCart(matchQuery);

    if (!aggregatedCart || aggregatedCart.items.length === 0) {
        return res.status(200).json(new ApiResponse(200, { 
            items: [], 
            totalPrice: { amount: 0, currency: "INR" } 
        }, "Cart is empty"));
    }

    return res
        .status(200)
        .json(new ApiResponse(200, aggregatedCart, "Cart fetched successfully (Optimized)"));
});
