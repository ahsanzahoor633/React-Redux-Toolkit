import axios from "axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const initialState = {
  loading: false,
  numOfUsers: 7,
  products: [],
  error: "",
  cartCount: 0,
  cartProducts: [],
};

export const fetchProductsData = createAsyncThunk(
  "products/fetchProducts",
  async (id, thunkAPI) => {
    try {
      const response = await axios.get(`https://fakestoreapi.com/products`);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const productsApi = createApi({
  reducerPath: "productsApi",
  baseQuery: fetchBaseQuery({ baseUrl: "https://fakestoreapi.com/" }),
  endpoints: (builder) => ({
    getAllProducts: builder.query({
      query: () => "products",
    }),
    getProduct: builder.query({
      query: (id) => `products/${id}`,
    }),
  }),
});

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    increment(state, action) {
      state.cartProducts.find((item) => item.id === action.payload).qty += 1;
    },
    decrement(state, action) {
      let existingProduct = state.cartProducts.find(
        (i) => i.id === parseInt(action.payload)
      );

      if (existingProduct.qty === 1) {
        state.cartProducts = state.cartProducts.filter(
          (product) => product.id !== parseInt(action.payload)
        );
        state.cartCount = state.cartProducts.length;
      } else {
        existingProduct.qty -= 1;
      }
    },
    deleteProduct(state, action) {
      state.cartProducts = state.cartProducts.filter(
        (product) => product.id !== parseInt(action.payload)
      );
      state.cartCount = state.cartProducts.length;
    },
    setCartProducts(state, action) {
      state.cartProducts.push(action.payload);
    },
    addToCart(state, action) {
      state.cartCount = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchProductsData.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchProductsData.fulfilled, (state, { payload }) => {
      state.loading = false;
      state.products = payload;
    });
    builder.addCase(fetchProductsData.rejected, (state, action) => {
      state.loading = false;
      state.products = [];
      state.error = action.error.message;
    });
  },
});

export const { useGetAllProductsQuery, useGetProductQuery } = productsApi;
export const {
  setCartProducts,
  addToCart,
  increment,
  decrement,
  deleteProduct,
} = userSlice.actions;
export default userSlice.reducer;
