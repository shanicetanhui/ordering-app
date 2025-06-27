<script lang="ts">
  import { onMount } from "svelte";
  import "@fontsource/caveat-brush";

  let items = [
    { name: "Coffee", image: "/images/coffee.png" },
    { name: "Tea", image: "/images/tea.png" },
    { name: "Juice", image: "/images/juice.png" },
    { name: "Sandwich", image: "/images/sandwich.png" },
    { name: "Pizza", image: "/images/pizza.png" },
    { name: "Cake", image: "/images/cake.png" },
  ];

  let selectedItem = "";
  let quantity = 1; // Changed from qty to quantity for clarity
  let submitted = false;
  let statusUpdates: { orderId: number; status: string }[] = [];

  async function placeOrder() {
    if (!selectedItem || quantity < 1) return;

    const res = await fetch("http://localhost:3000/api/order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: selectedItem, quantity }),
    });
    if (res.ok) submitted = true;
  }

  onMount(() => {
    const interval = setInterval(async () => {
      const res = await fetch("http://localhost:3000/api/status");
      if (res.ok) {
        const data = await res.json();
        statusUpdates = data;
      }
    }, 2000);

    return () => clearInterval(interval);
  });
</script>

<div class="background">
  <h1
    style="text-align: center; font-family: caveat brush; color: #ffffff; font-size: 4rem;"
  >
    Menu
  </h1>

  <div class="menu">
    {#each items as item}
      <div
        class="card {selectedItem === item.name ? 'selected' : ''}"
        on:click={() => {
          selectedItem = item.name;
          submitted = false;
        }}
        role="button"
        tabindex="0"
        on:keydown={(e) => {
          if (e.key === "Enter" || e.key === "") selectedItem = item.name;
        }}
        aria-pressed={selectedItem === item.name}
      >
        <img src={item.image} alt={item.name} class="item-image" />
        <div>{item.name}</div>
      </div>
    {/each}
  </div>

  <div class="container">
    <label
      style="font-family: caveat brush; color: #ffffff; font-size: 1.5rem;"
    >
      Quantity:
      <input
        style="font-family: caveat brush; color: #333;"
        type="number"
        min="1"
        bind:value={quantity}
      />
    </label>

    <button on:click={placeOrder} disabled={!selectedItem || quantity < 1}>
      Place Order
    </button>
  </div>

  {#if statusUpdates.length > 0}
    <h2 style="font-family: caveat brush; color: #ffffff; font-size: 2.5rem;">
      Order Status:
    </h2>
    <ul>
      {#each statusUpdates as update}
        <li
          style="font-family: caveat brush; color: lightgrey; margin-left: 2rem;"
        >
          Order ID #{update.orderId} is {update.status}!
        </li>
      {/each}
    </ul>
  {/if}
</div>

{#if submitted}
  <div class="popup-notification">
    <div class="popup-content">
      <span class="popup-icon">✅</span>
      <p>Order placed for {quantity} x {selectedItem}!</p>
      <button class="close-btn" on:click={() => (submitted = false)}>✕</button>
    </div>
  </div>
{/if}

<style>
  .background {
    background: linear-gradient(to bottom right, #ad7642, #683301);
    min-height: 100vh;
    padding: 2rem;
    box-sizing: border-box;
  }

  .menu {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
    max-width: 600px;
    margin: 2rem auto;
    justify-content: center;
    margin-top: 0%;
  }

  .card {
    cursor: pointer;
    border: 2px solid transparent;
    border-radius: 12px;
    padding: 1rem 1.5rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    text-align: center;
    user-select: none;
    flex: 1 1 100px;
    transition: border-color 0.3s ease;
    background-color: rgba(253, 248, 252, 0.7);
    font-family: "Caveat Brush";
  }

  .card.selected {
    border-color: #4caf50;
    box-shadow: 0 4px 12px rgba(76, 175, 80, 0.5);
    background-color: #e8f5e9;
  }

  .item-image {
    width: 150px;
    height: 100px;
    object-fit: cover;
    border-radius: 8px;
    margin-bottom: 0.5rem;
  }

  .container {
    justify-content: center;
    display: flex;
    align-items: center;
  }

  button {
    padding: 0.5rem 1rem;
    background-color: #4caf50;
    border: none;
    color: white;
    border-radius: 6px;
    cursor: pointer;
    font-weight: bold;
    font-size: 1.2rem;
    margin-left: 0.5rem;
    font-family: "Caveat Brush";
  }

  button:disabled {
    background-color: #9e9e9e;
    cursor: not-allowed;
  }

  .popup-notification {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }

  .popup-content {
    background: rgba(238, 231, 231, 0.95);
    padding: 2em;
    border-radius: 12px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
    text-align: center;
    position: relative;
    max-width: 400px;
    font-family: "Caveat Brush";
  }

  .popup-icon {
    font-size: 2rem;
    display: block;
    margin-bottom: 1rem;
  }

  .popup-content p {
    margin: 0 0 1.5rem 0;
    font-size: 1.8rem;
    color: #333;
  }

  .close-btn {
    position: absolute;
    top: 10px;
    right: 15px;
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    color: #666;
    padding: 0;
    margin: 0;
  }

  .close-btn:hover {
    color: #333;
  }

  ul {
    margin-top: 0;
    margin-bottom: 0;
    padding-left: 1.5rem;
  }

  li {
    margin-bottom: 0.3rem;
    font-size: 1.2rem;
  }

  h2 {
    margin-bottom: 0.5rem;
  }

  h1 {
    margin-top: 0.5rem;
    margin-bottom: 1rem;
  }
</style>
