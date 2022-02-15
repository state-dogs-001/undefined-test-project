<template>
  <div class="add-product my-5">
    <b-container class="card-add-product">
      <b-card>
        <h3>Add New Mobile</h3>
        <!-- Form add product -->
        <form @submit.stop.prevent="addProductClick">
          <b-row>
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
              <b-button type="submit" variant="success"> Add Product </b-button>
            </b-col>
          </b-row>
        </form>
      </b-card>
    </b-container>
  </div>
</template>

<script>
import { mapActions } from "vuex";

export default {
  data() {
    return {
      productBrand: null,
      productName: null,
      productPrice: null,
      productImg: "",
      productDescription: null,
    };
  },
  mounted() {
    // Use for imgae preview
    let imgInput = document.getElementById("productImg");
    imgInput.addEventListener("keyup", () => {
      document.getElementById("imagePreview").src = imgInput.value;
    });
  },
  methods: {
    // Add product
    ...mapActions(["addProduct"]),
    async addProductClick() {
      const product_info = {
        product_brand: this.productBrand,
        product_name: this.productName,
        product_price: this.productPrice,
        product_img: this.productImg,
        product_description: this.productDescription,
      };
      await this.addProduct(product_info);
    },

    // Reset image preview
    resetClick() {
      document.getElementById("imagePreview").src = "";
    },
  },
};
</script>

<style>
.card-add-product {
  max-width: 700px;
}
</style>
