<!DOCTYPE html>
<html lang="mn">

<head>

  <meta charset="UTF-8" />

  <meta
    name="viewport"
    content="width=device-width, initial-scale=1.0"
  />

  <title>Auto Mart | Admin</title>

  <link
    rel="stylesheet"
    href="style.css"
  />

</head>


<body>


  <!-- HEADER -->

  <header class="header">

    <div class="container header-inner">

      <a
        href="index.html"
        class="logo"
      >
        🚗 Auto Mart
      </a>


      <nav class="nav">

        <a href="index.html">
          Store
        </a>

        <a href="admin.html">
          Admin
        </a>

      </nav>

    </div>

  </header>



  <!-- ADMIN -->

  <main class="container admin-section">


    <div class="section-header">

      <div>

        <span class="section-label">
          ADMIN PANEL
        </span>

        <h1>
          Бараа удирдах
        </h1>

      </div>

    </div>



    <!-- ADD PRODUCT -->

    <section class="admin-card">

      <h2>
        Шинэ бараа нэмэх
      </h2>


      <form
        id="productForm"
        onsubmit="addProduct(event)"
      >


        <div class="form-group">

          <label for="productName">
            Барааны нэр
          </label>

          <input
            id="productName"
            type="text"
            placeholder="Жишээ: Toyota Prius Brake Pad"
            required
          />

        </div>



        <div class="form-group">

          <label for="productPrice">
            Үнэ
          </label>

          <input
            id="productPrice"
            type="number"
            min="0"
            placeholder="85000"
            required
          />

        </div>



        <div class="form-group">

          <label for="productCategory">
            Ангилал
          </label>

          <input
            id="productCategory"
            type="text"
            placeholder="Brake"
          />

        </div>



        <div class="form-group">

          <label for="productStock">
            Үлдэгдэл
          </label>

          <input
            id="productStock"
            type="number"
            min="0"
            value="1"
          />

        </div>



        <div class="form-group">

          <label for="productImage">
            Зургийн URL
          </label>

          <input
            id="productImage"
            type="url"
            placeholder="https://..."
          />

        </div>



        <div class="form-group">

          <label for="productDescription">
            Тайлбар
          </label>

          <textarea
            id="productDescription"
            placeholder="Барааны тайлбар..."
          ></textarea>

        </div>



        <button
          type="submit"
          class="submit-order-button"
        >
          + Бараа нэмэх
        </button>


      </form>

    </section>



    <!-- PRODUCT LIST -->

    <section class="admin-card">

      <div class="admin-list-header">

        <h2>
          Одоогийн бараанууд
        </h2>

        <button
          onclick="loadAdminProducts()"
          class="secondary-button"
        >
          🔄 Refresh
        </button>

      </div>


      <div
        id="adminProductList"
        class="admin-product-list"
      >

        <div class="loading">
          Бараа ачаалж байна...
        </div>

      </div>

    </section>


  </main>



  <!-- TOAST -->

  <div
    id="toast"
    class="toast"
  ></div>



  <!-- SUPABASE -->

  <script
    src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"
  ></script>


  <!-- APP -->

  <script src="app.js"></script>


</body>

</html>
