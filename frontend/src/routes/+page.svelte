<script lang="ts">
  let item = "";
  let qty = 1;
  let submitted = false;

  async function placeOrder() {
    const res = await fetch("http://localhost:3000/api/order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ item, qty }),
    });
    if (res.ok) submitted = true;
  }
</script>

<h1>Menu</h1>

<div class="order-container">
  <form on:submit|preventDefault={placeOrder}>
    <label>
      Select an item:
      <select bind:value={item}>
        <option value="" disabled selected>Select an item</option>
        <option>Coffee</option>
        <option>Tea</option>
        <option>Sandwich</option>
        <option>Juice</option>
        <option>Water</option>
      </select>
    </label>

    <label>
      Quantity:
      <input type="number" min="1" bind:value={qty} />
    </label>

    <button on:click={placeOrder} disabled={!item || qty < 1}>
      Place Order
    </button>
  </form>

  {#if submitted}
    <p class="success">Order placed for {qty} x {item}!</p>
  {/if}
</div>

<style>
    h1 {
        text-align:center;
        margin-bottom: 1em;
        font-family: sans-serif;
    }

    .order-container {
        max-width: 400px;
        margin: 0 auto;
        padding: 1.5em;
        border-radius: 12px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0, 0,1);
        background: #f9f9f9;
        font-family: sans-serif;
    }

    form {
        display: flex;
        flex-direction: column;
        gap: 1em;
    }

    label {
        display: flex;
        flex-direction: column;
        font-weight: bold;
    }

    select, 
    input,
    button {
        padding: 0.5em;
        border: 1px solid #ccc;
        border-radius: 6px;
        font-size: 1rem;
    }

    button {
		background-color: #4caf50;
		color: white;
		cursor: pointer;
		transition: background-color 0.2s;
	}

	button:disabled {
		background-color: #aaa;
		cursor: not-allowed;
	}

	button:hover:not(:disabled) {
		background-color: #388e3c;
	}

	.success {
		margin-top: 1em;
		padding: 0.75em;
		background-color: #dff0d8;
		color: #3c763d;
		border-radius: 6px;
		text-align: center;
	}
</style>