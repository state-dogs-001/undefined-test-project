<template>
  <div class="update-product my-5">
    <b-container class="card-update-product">
      <template v-if="products">
        <b-card>
          <h3>Update Mobile Product</h3>
          <!-- Form update product -->
          <form @submit.stop.prevent="updateProductClick">
            <b-row>
              <!-- Id -->
              <b-col cols="12" class="mt-3">
                <label for="productId">ID</label>
                <input
                  type="text"
                  id="productId"
                  v-model="productId"
                  class="form-control"
                  readonly
                  required
                />
              </b-col>
              <!-- Brand -->
              <b-col cols="12" class="mt-3">
                <label for="productBrand">Mobile brand</label>
                <input
                  type="text"
                  id="productBrand"
                  v-model="productBrand"
                  class="form-control"
                  placeholder="Brand of product"
                  required
                />
              </b-col>
              <!-- Name -->
              <b-col cols="12" class="mt-3">
                <label for="productName">Mobile name</label>
                <input
                  type="text"
                  id="productName"
                  v-model="productName"
                  class="form-control"
                  placeholder="Name of product"
                  required
                />
              </b-col>
              <!-- Price -->
              <b-col cols="12" class="mt-3">
                <label for="productPrice">Mobile price</label>
                <input
                  type="number"
                  id="productPrice"
                  v-model="productPrice"
                  class="form-control"
                  placeholder="Price of product"
                  required
                />
              </b-col>
              <!-- Description -->
              <b-col cols="12" class="mt-3">
                <label for="productDes">Mobile description</label>
                <textarea
                  id="productDes"
                  v-model="productDescription"
                  class="form-control"
                  placeholder="Description of product"
                  required
                />
              </b-col>
              <!-- Image src -->
              <b-col cols="12" class="mt-3">
                <label for="productImg">Mobile image src</label>
                <input
                  type="text"
                  id="productImg"
                  v-model="productImg"
                  class="form-control"
                  placeholder="Image source of product"
                  required
                />
                <b-row>
                  <!-- Image preview -->
                  <b-col class="text-center mt-2">
                    <b-img id="imagePreview" width="300px" />
                  </b-col>
                </b-row>
              </b-col>
              <!-- Button -->
              <b-col cols="12" class="text-center mt-4">
                <b-button
                  type="reset"
                  variant="danger"
                  class="mr-3"
                  @click="resetClick"
                >
                  Cancel
                </b-button>
                <b-button type="submit" variant="success">
                  Update Product
                </b-button>
              </b-col>
            </b-row>
          </form>
        </b-card>
      </template>
    </b-container>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

export default {
  data() {
    return {
      productId: null,
      productBrand: null,
      productName: null,
      productPrice: null,
      productImg: null,
      productDescription: null,
    };
  },
  computed: {
    // Get products
    ...mapGetters(["products"]),

    // Get product id from path
    id: function () {
      return this.$route.params.id;
    },

    // Filter product by _id
    product: function () {
      return this.products.filter((product) => {
        return product._id.match(this.id);
      });
    },
  },
  updated() {
    // Image preview
    document.getElementById("imagePreview").src = this.productImg;
  },
  created() {
    // Call function get products
    this.getProducts();
  },
  beforeUpdate() {
    // Set form before change function
    this.setFormValue();
  },
  methods: {
    // Get products function
    ...mapActions(["getProducts"]),

    // Set form before change
    setFormValue() {
      // product id
      this.productId == null
        ? (this.productId = this.product[0]._id)
        : this.productId;
      // product brand
      this.productBrand == null
        ? (this.productBrand = this.product[0].product_brand)
        : this.productBrand;
      // product name
      this.productName == null
        ? (this.productName = this.product[0].product_name)
        : this.productName;
      // product price
      this.productPrice == null
        ? (this.productPrice = this.product[0].product_price)
        : this.productPrice;
      // product img
      this.productImg == null
        ? (this.productImg = this.product[0].product_img)
        : this.productImg;
      // product description
      this.productDescription == null
        ? (this.productDescription = this.product[0].product_description)
        : this.productDescription;
    },

    // Update product
    ...mapActions(["updateProduct"]),
    async updateProductClick() {
      const product_info = {
        id: this.productId,
        product_brand: this.productBrand,
        product_name: this.productName,
        product_price: this.productPrice,
        product_img: this.productImg,
        product_description: this.productDescription,
      };
      await this.updateProduct(product_info);
    },

    // Reset image preview
    resetClick() {
      document.getElementById("imagePreview").src = "";
    },
  },
};
</script>

<style>
.card-update-product {
  max-width: 700px;
}
</style>
