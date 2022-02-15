<template>
  <div class="products-page my-5">
    <b-container>
      <b-card>
        <b-row>
          <b-col class="d-flex justify-content-start">
            <h4>Mobiles</h4>
          </b-col>
          <!-- Button add product -->
          <b-col class="d-flex justify-content-end">
            <b-button variant="outline-success" to="/add-product">
              Add product
            </b-button>
          </b-col>
          <!-- Table -->
          <b-col lg="12" class="my-4">
            <div class="table-responsive">
              <table class="table table-striped">
                <thead>
                  <tr class="table-dark">
                    <th scope="col">ID</th>
                    <th scope="col">Image</th>
                    <th scope="col">Brand</th>
                    <th scope="col">Name</th>
                    <th scope="col">Price</th>
                    <th scope="col">Read More</th>
                    <th scope="col" colspan="2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(product, index) in products" :key="index">
                    <td>{{ index + 1 }}</td>
                    <td width="150px">
                      <img
                        :src="product.product_img"
                        width="100%"
                        class="rounded"
                      />
                    </td>
                    <td>{{ product.product_brand }}</td>
                    <td>{{ product.product_name }}</td>
                    <td>฿{{ product.product_price }}</td>
                    <td>{{ product.product_description }}</td>
                    <!-- Button Action Delete and Update Products -->
                    <td>
                      <b-button
                        variant="danger"
                        v-b-tooltip.hover.bottom
                        title="Delete this product"
                        @click="deleteClick(product._id)"
                      >
                        <b-icon icon="trash" />
                      </b-button>
                    </td>
                    <td>
                      <b-button
                        variant="primary"
                        v-b-tooltip.hover.bottom
                        title="Update this product"
                        :to="'/update-product/' + product._id"
                      >
                        <b-icon icon="pencil-square" />
                      </b-button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </b-col>
        </b-row>
      </b-card>
    </b-container>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

export default {
  computed: {
    // Get products
    ...mapGetters(["products"]),
  },
  created() {
    // Call function get products
    this.getProducts();
  },
  methods: {
    // Get products function
    ...mapActions(["getProducts"]),

    // Delete product
    ...mapActions(["deleteProduct"]),
    async deleteClick(id) {
      const res = confirm("Do you want to delete it?");
      if (res === true) {
        await this.deleteProduct({ id: id });
      }
    },
  },
};
</script>
